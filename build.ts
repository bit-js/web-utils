/// <reference types='bun-types' />
import { existsSync, rmSync } from 'fs';
import pkg from './package.json';
import { $ } from 'bun';

// Build source files
Bun.build({
    format: 'esm',
    target: 'bun',
    outdir: './lib',
    entrypoints: ['./src/index.ts'],
    minify: {
        whitespace: true,
        syntax: true
    },
    external: Object.keys(pkg.dependencies)
});

// Generating types
const dir = './types';
if (existsSync(dir)) rmSync(dir, { recursive: true });

await $`bun x tsc`;
