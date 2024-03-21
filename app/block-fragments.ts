/**
 * Generates file ./utils/queries/WpBlocksFragment.ts containing
 * a fragment with all the WP core block fragments Faust provides.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import blocks from './wp-blocks';

const filePath = pathToFileURL(__filename).toString();
const outDir = new URL('./utils/queries', filePath).pathname;
const outPath = `${outDir}/WpBlocksFragment.ts`;

const fragments: string[] = [];

for (const v of Object.values(blocks)) {
  if (v.fragments.entry.loc) {
    fragments.push(v.fragments.entry.loc.source.body);
  }
}

const lines: string[] = [];

lines.push('// Do not alter this file. Instead, use `npm run generate:all');
lines.push('/* eslint-disable */');
lines.push('');
lines.push("import { gql } from '@apollo/client';");
lines.push('');
lines.push(`const WpBlocksFragment = gql\`
  fragment WpBlocksFragment on EditorBlock {
    __typename
    clientId
    name
    renderedHtml
    parentClientId
`);

for (const fragment of fragments) {
  lines.push('    ' + fragment.trim().replace(/fragment \w+/, '...'));
}

lines.push('  }');
lines.push('`;');
lines.push('');
lines.push('export default WpBlocksFragment;');
lines.push('');

mkdirSync(outDir, { recursive: true });

writeFileSync(outPath, lines.join('\n'), { encoding: 'utf8' });
