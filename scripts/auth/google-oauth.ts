#!/usr/bin/env ts-node
/**
 * Google OAuth 2.0 Authentication Helper
 *
 * This script handles OAuth authentication for Google Forms API.
 *
 * Usage:
 *   npm run google-auth    # Initial setup (opens browser for consent)
 *
 * After initial setup, tokens are stored in .google-tokens.json
 * and automatically refreshed as needed.
 */

import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import * as url from 'url';

const SCOPES = [
  'https://www.googleapis.com/auth/forms.body',
  'https://www.googleapis.com/auth/drive.file',
];

const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials_forms.json');
const TOKEN_PATH = path.join(process.cwd(), '.google-tokens.json');

interface Credentials {
  installed?: {
    client_id: string;
    client_secret: string;
    redirect_uris: string[];
  };
  web?: {
    client_id: string;
    client_secret: string;
    redirect_uris: string[];
  };
}

/**
 * Load OAuth credentials from credentials.json
 */
function loadCredentials(): Credentials {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    throw new Error(
      `credentials_forms.json not found!\n\n` +
      `Please follow these steps:\n` +
      `1. Go to https://console.cloud.google.com\n` +
      `2. Create/select a project\n` +
      `3. Enable Google Forms API and Google Drive API\n` +
      `4. Create OAuth 2.0 credentials (Web application)\n` +
      `5. Add redirect URI: http://localhost:3000/oauth2callback\n` +
      `6. Download credentials.json as credentials_forms.json to project root\n`
    );
  }

  return JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8'));
}

/**
 * Create OAuth2 client from credentials
 */
function createOAuth2Client(credentials: Credentials): OAuth2Client {
  // Support both "web" and "installed" credential types
  const config = credentials.web || credentials.installed;
  if (!config) {
    throw new Error('Invalid credentials format. Expected "web" or "installed" property.');
  }

  const { client_id, client_secret, redirect_uris } = config;
  return new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
}

/**
 * Get stored tokens or null if not found
 */
function loadTokens(): any | null {
  if (!fs.existsSync(TOKEN_PATH)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
}

/**
 * Save tokens to disk
 */
function saveTokens(tokens: any): void {
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
  console.log('✓ Tokens saved to .google-tokens.json');
}

/**
 * Get authorization from user via browser
 */
async function getNewTokens(oauth2Client: OAuth2Client): Promise<void> {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('\n🔐 Authorization required');
  console.log('Opening browser for Google OAuth consent...\n');
  console.log('If browser doesn\'t open automatically, visit this URL:');
  console.log(authUrl);
  console.log();

  // Start local server to receive OAuth callback
  const code = await new Promise<string>((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      try {
        if (req.url && req.url.indexOf('/oauth2callback') > -1) {
          const qs = url.parse(req.url, true).query;
          const code = qs.code as string;

          res.end('✓ Authentication successful! You can close this window.');
          server.close();
          resolve(code);
        }
      } catch (e) {
        reject(e);
      }
    });

    server.listen(3000, () => {
      console.log('Waiting for authorization...');

      // Open browser automatically
      const open = process.platform === 'darwin' ? 'open' :
                    process.platform === 'win32' ? 'start' : 'xdg-open';
      require('child_process').exec(`${open} "${authUrl}"`);
    });
  });

  // Exchange code for tokens
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  saveTokens(tokens);
}

/**
 * Get authenticated OAuth2 client
 */
export async function getAuthenticatedClient(): Promise<OAuth2Client> {
  const credentials = loadCredentials();
  const oauth2Client = createOAuth2Client(credentials);

  // Check for existing tokens
  const tokens = loadTokens();

  if (tokens) {
    oauth2Client.setCredentials(tokens);

    // Refresh token if needed
    try {
      await oauth2Client.getAccessToken();
      console.log('✓ Using existing authentication');
      return oauth2Client;
    } catch (error) {
      console.log('⚠ Stored tokens expired, re-authenticating...');
      await getNewTokens(oauth2Client);
      return oauth2Client;
    }
  }

  // No tokens, need authorization
  await getNewTokens(oauth2Client);
  return oauth2Client;
}

/**
 * CLI entry point
 */
async function main() {
  try {
    console.log('🚀 Google Forms API Authentication\n');
    await getAuthenticatedClient();
    console.log('\n✅ Authentication successful!');
    console.log('You can now use the create-analytics-form script.\n');
  } catch (error) {
    console.error('\n❌ Authentication failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}
