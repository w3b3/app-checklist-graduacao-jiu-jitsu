import { buildRequirementsData } from '../scripts/build-requirements-data.ts';
import { createProgressStore } from './progress-store.ts';
import { mountChecklist } from './checklist-ui.ts';

const root = document.getElementById('checklist');
if (root) mountChecklist(root, buildRequirementsData(), createProgressStore(window.localStorage));
