import { buildSite } from './scripts/build-site.ts';

await buildSite('dist');
console.log('built dist/');
