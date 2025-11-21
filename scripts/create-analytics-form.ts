#!/usr/bin/env ts-node
/**
 * Automated Google Forms Creation & Entry ID Extraction
 *
 * This script automates the entire process of creating analytics forms:
 * 1. Reads form config JSON
 * 2. Creates form via Google Forms API
 * 3. Adds questions via batchUpdate
 * 4. Links to Google Sheets
 * 5. Extracts entry IDs using Playwright
 * 6. Generates TypeScript service file
 * 7. Updates form registry
 *
 * Usage:
 *   npm run create-form -- --config forms/techniqueAnalytics.config.json
 */

import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import { getAuthenticatedClient } from './auth/google-oauth';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'paragraph' | 'choice';
  required: boolean;
  options?: string[];
}

interface FormConfig {
  name: string;
  title: string;
  description: string;
  fields: FormField[];
  linkToSheets: boolean;
  batching?: {
    enabled: boolean;
    flushInterval?: number;
    batchSize?: number;
  };
}

interface EntryMapping {
  [fieldName: string]: string;
}

interface FormMetadata {
  name: string;
  formId: string;
  formUrl: string;
  formResponseUrl: string;
  sheetUrl?: string;
  createdAt: string;
}

/**
 * Load form configuration from JSON file
 */
function loadFormConfig(configPath: string): FormConfig {
  if (!fs.existsSync(configPath)) {
    throw new Error(`Config file not found: ${configPath}`);
  }
  return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
}

/**
 * Create form via Google Forms API
 */
async function createForm(config: FormConfig, auth: any): Promise<any> {
  const forms = google.forms({ version: 'v1', auth });

  console.log('📝 Creating form via API...');

  // Step 1: Create empty form
  const form = await forms.forms.create({
    requestBody: {
      info: {
        title: config.title,
        documentTitle: config.title,
      },
    },
  });

  console.log(`✓ Form created: ${form.data.formId}`);

  // Step 2: Add questions via batchUpdate
  console.log('📝 Adding form fields...');

  const requests = config.fields.map((field, index) => {
    const item: any = {
      title: field.label,
      description: '',
      questionItem: {
        question: {
          required: field.required,
        },
      },
    };

    if (field.type === 'text') {
      item.questionItem.question.textQuestion = { paragraph: false };
    } else if (field.type === 'paragraph') {
      item.questionItem.question.textQuestion = { paragraph: true };
    } else if (field.type === 'choice' && field.options) {
      item.questionItem.question.choiceQuestion = {
        type: 'RADIO',
        options: field.options.map(opt => ({ value: opt })),
      };
    }

    return {
      createItem: {
        item,
        location: { index },
      },
    };
  });

  await forms.forms.batchUpdate({
    formId: form.data.formId!,
    requestBody: { requests },
  });

  console.log(`✓ Added ${config.fields.length} fields`);

  // Step 2.5: Make form publicly accessible via Drive API
  console.log('🌐 Making form publicly accessible...');
  try {
    const drive = google.drive({ version: 'v3', auth });
    await drive.permissions.create({
      fileId: form.data.formId!,
      requestBody: {
        type: 'anyone',
        role: 'reader',
      },
    });
    console.log('✓ Form is now public');
  } catch (err) {
    console.warn('⚠ Could not make form public:', (err as Error).message);
    console.warn('  Form may require authentication to view');
  }

  // Step 3: Link to Google Sheets (if enabled)
  if (config.linkToSheets) {
    console.log('📊 Linking to Google Sheets...');
    // Note: This requires additional Drive API setup
    // For now, user must manually click "Link to Sheets" in form UI
    console.log('⚠  Please manually link to Sheets in the form settings');
  }

  return form.data;
}

/**
 * Extract entry IDs from form by parsing the page HTML
 */
async function extractEntryIds(
  formUrl: string,
  fieldLabels: string[],
  fields: FormField[]
): Promise<EntryMapping> {
  console.log('🔍 Extracting entry IDs from form HTML...');

  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(formUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    // Get page content to parse
    const pageContent = await page.content();

    // Extract entry IDs from the JavaScript embedded in the page
    // Google Forms embeds form data like: [QUESTION_ID,"LABEL",null,TYPE,[[ENTRY_ID,...
    const pattern = /\[\d+,&quot;([^&]*(?:&[^q][^u][^o][^t][^;][^&]*)*?)&quot;[^\[]*\[\[(\d{9,})/g;
    const matches = Array.from(pageContent.matchAll(pattern));

    const entryData: Array<{ label: string; entryId: string }> = [];

    for (const match of matches) {
      const [, label, entryId] = match;
      // Decode HTML entities
      const decodedLabel = label
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
      entryData.push({ label: decodedLabel, entryId });
      console.log(`  Found: "${decodedLabel}" → entry.${entryId}`);
    }

    await browser.close();

    console.log(`✓ Found ${entryData.length} entry IDs in page`);

    // Map to field labels
    const mapping: EntryMapping = {};

    for (const field of fields) {
      const label = field.label;

      // Find exact match first
      let match = entryData.find(e => e.label === label);

      // Try fuzzy match
      if (!match) {
        match = entryData.find(e =>
          e.label.toLowerCase().includes(label.toLowerCase()) ||
          label.toLowerCase().includes(e.label.toLowerCase())
        );
      }

      if (match) {
        mapping[label] = `entry.${match.entryId}`;
        console.log(`✓ Matched "${label}" → entry.${match.entryId}`);
      } else {
        console.warn(`⚠ Could not find entry ID for field: ${label}`);
      }
    }

    const foundCount = Object.keys(mapping).length;
    console.log();
    console.log(`✓ Extracted ${foundCount}/${fields.length} entry IDs`);

    return mapping;

  } catch (error) {
    await browser.close();
    throw error;
  }
}

/**
 * Generate TypeScript service file
 */
function generateServiceFile(
  config: FormConfig,
  formMetadata: FormMetadata,
  entryMapping: EntryMapping
): string {
  const template = `// Auto-generated - DO NOT EDIT MANUALLY
// Config: forms/{{configName}}.config.json
// Form: {{formUrl}}
// Generated: {{timestamp}}

export const {{constantName}}_CONFIG = {
  formUrl: '{{formResponseUrl}}',
  sheetUrl: '{{sheetUrl}}',
  entryIds: {
{{#each entryIds}}
    {{@key}}: '{{this}}', // {{lookup ../labels @key}}
{{/each}}
  },
};

export interface {{interfaceName}}Data {
{{#each fields}}
  {{name}}{{#unless required}}?{{/unless}}: {{tsType}};
{{/each}}
}

export async function submit{{functionName}}(
  data: {{interfaceName}}Data
): Promise<void> {
  const formData = new FormData();

{{#each fields}}
{{#if required}}
  formData.append({{../constantName}}_CONFIG.entryIds.{{name}}, String(data.{{name}}));
{{else}}
  if (data.{{name}} !== undefined) {
    formData.append({{../constantName}}_CONFIG.entryIds.{{name}}, String(data.{{name}}));
  }
{{/if}}
{{/each}}

  try {
    await fetch({{constantName}}_CONFIG.formUrl, {
      method: 'POST',
      body: formData,
      mode: 'no-cors',
    });
  } catch (error) {
    console.log('Form submission attempted:', error);
  }
}
`;

  const compiled = Handlebars.compile(template);

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const getTypeScriptType = (field: FormField): string => {
    if (field.type === 'choice' && field.options) {
      return field.options.map(o => `'${o}'`).join(' | ');
    }
    return 'string';
  };

  return compiled({
    configName: config.name,
    formUrl: formMetadata.formUrl,
    formResponseUrl: formMetadata.formResponseUrl,
    sheetUrl: formMetadata.sheetUrl || '',
    timestamp: new Date().toISOString(),
    constantName: config.name.toUpperCase(),
    interfaceName: capitalize(config.name),
    functionName: capitalize(config.name),
    entryIds: entryMapping,
    labels: Object.fromEntries(
      config.fields.map(f => [f.name, f.label])
    ),
    fields: config.fields.map(f => ({
      ...f,
      tsType: getTypeScriptType(f),
    })),
  });
}

/**
 * Update forms registry
 */
function updateRegistry(metadata: FormMetadata): void {
  const registryPath = path.join(process.cwd(), '.forms-registry.json');

  let registry: { forms: FormMetadata[] } = { forms: [] };

  if (fs.existsSync(registryPath)) {
    registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
  }

  // Remove existing entry for this form
  registry.forms = registry.forms.filter(f => f.name !== metadata.name);

  // Add new entry
  registry.forms.push(metadata);

  fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2));
  console.log('✓ Updated .forms-registry.json');
}

/**
 * Update forms index file
 */
function updateFormsIndex(config: FormConfig): void {
  const indexPath = path.join(process.cwd(), 'src/services/forms/index.ts');

  let existingContent = '';
  if (fs.existsSync(indexPath)) {
    existingContent = fs.readFileSync(indexPath, 'utf-8');
  }

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const exportLine = `export { submit${capitalize(config.name)}, ${capitalize(config.name)}Data } from './${config.name}';`;

  // Check if export already exists
  if (!existingContent.includes(exportLine)) {
    const newContent = existingContent + '\n' + exportLine;
    fs.writeFileSync(indexPath, newContent);
    console.log('✓ Updated src/services/forms/index.ts');
  }
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  const configIndex = args.indexOf('--config');

  if (configIndex === -1 || !args[configIndex + 1]) {
    console.error('Usage: create-analytics-form --config <path-to-config.json>');
    process.exit(1);
  }

  const configPath = path.join(process.cwd(), args[configIndex + 1]);

  try {
    console.log('🚀 Creating Analytics Form\n');

    // Step 1: Load config
    console.log('📖 Loading configuration...');
    const config = loadFormConfig(configPath);
    console.log(`✓ Loaded config for: ${config.title}\n`);

    // Step 2: Authenticate
    console.log('🔐 Authenticating with Google...');
    const auth = await getAuthenticatedClient();
    console.log();

    // Step 3: Create form
    const formData = await createForm(config, auth);

    const formUrl = formData.responderUri!;
    const formResponseUrl = formUrl.replace('/viewform', '/formResponse');

    console.log();

    // Step 4: Extract entry IDs
    const fieldLabels = config.fields.map(f => f.label);
    const entryMapping = await extractEntryIds(formUrl, fieldLabels, config.fields);

    // Map entry IDs to field names (not labels)
    const entryMappingByName: EntryMapping = {};
    config.fields.forEach(field => {
      const entryId = entryMapping[field.label];
      if (entryId) {
        entryMappingByName[field.name] = entryId;
      }
    });

    console.log();

    // Step 5: Generate TypeScript file
    console.log('📝 Generating TypeScript service...');

    const metadata: FormMetadata = {
      name: config.name,
      formId: formData.formId!,
      formUrl,
      formResponseUrl,
      createdAt: new Date().toISOString(),
    };

    const serviceCode = generateServiceFile(config, metadata, entryMappingByName);

    const outputDir = path.join(process.cwd(), 'src/services/forms');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, `${config.name}.ts`);
    fs.writeFileSync(outputPath, serviceCode);

    console.log(`✓ Generated ${outputPath}`);

    // Step 6: Update registry
    updateRegistry(metadata);

    // Step 7: Update index
    updateFormsIndex(config);

    // Summary
    console.log('\n✅ Form created successfully!\n');
    console.log('Form URL:', formUrl);
    console.log('Response URL:', formResponseUrl);
    console.log('\n📊 Next steps:');
    console.log('1. Open the form and manually link to Google Sheets');
    console.log('2. Import in your app:');
    console.log(`   import { submit${config.name.charAt(0).toUpperCase()}${config.name.slice(1)} } from '../services/forms';`);
    console.log('\n');

  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
