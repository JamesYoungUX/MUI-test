#!/usr/bin/env node

/**
 * Pull Design Tokens from GitHub Repository
 * This script fetches the latest design tokens from the tokens-test repository
 * and generates a CSS file with CSS custom properties
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration - Try multiple possible paths
const POSSIBLE_PATHS = [
    'https://raw.githubusercontent.com/jamesyoung-tech/tokens-test/main/design-tokens.json',
    'https://raw.githubusercontent.com/jamesyoung-tech/tokens-test/main/tokens/design-tokens.json',
    'https://raw.githubusercontent.com/jamesyoung-tech/tokens-test/master/design-tokens.json',
    'https://raw.githubusercontent.com/jamesyoung-tech/tokens-test/master/tokens/design-tokens.json',
];

const OUTPUT_CSS_FILE = path.join(__dirname, '../src/tokens.css');
const OUTPUT_TS_FILE = path.join(__dirname, '../src/tokens.ts');

// Try fetching from each path
async function fetchTokens() {
    for (const url of POSSIBLE_PATHS) {
        console.log(`🔍 Trying: ${url}`);
        try {
            const tokens = await fetchFromUrl(url);
            console.log(`✅ Found tokens at: ${url}`);
            return tokens;
        } catch (error) {
            console.log(`   ❌ Not found at this path`);
        }
    }
    throw new Error('Could not find design-tokens.json at any of the expected paths');
}

function fetchFromUrl(url) {
    return new Promise((resolve, reject) => {
        const urlWithCache = `${url}?t=${Date.now()}`;

        https.get(urlWithCache, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode !== 200) {
                    reject(new Error(`HTTP ${res.statusCode}`));
                    return;
                }

                try {
                    const tokens = JSON.parse(data);
                    resolve(tokens);
                } catch (error) {
                    reject(error);
                }
            });

        }).on('error', (error) => {
            reject(error);
        });
    });
}

/**
 * Generate CSS from design tokens
 */
function generateCSS(tokens) {
    const timestamp = new Date().toISOString();

    let css = `/* Design Tokens - Auto-generated from GitHub repository */\n`;
    css += `/* Last updated: ${timestamp} */\n`;
    css += `/* Source: https://github.com/jamesyoung-tech/tokens-test */\n\n`;
    css += `:root {\n`;

    // Flatten and process tokens
    const flatTokens = {};

    for (const [category, value] of Object.entries(tokens)) {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            // If it's an object, extract its properties
            for (const [key, val] of Object.entries(value)) {
                flatTokens[key] = val;
            }
        } else {
            // If it's a primitive value, use it directly
            flatTokens[category] = value;
        }
    }

    // Process each flattened token
    for (const [key, value] of Object.entries(flatTokens)) {
        // Convert camelCase or other formats to kebab-case for CSS variables
        const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;

        // Format the value appropriately
        let cssValue = value;

        // If it's an object with a value property, use that
        if (typeof value === 'object' && value !== null) {
            if (value.value) {
                cssValue = value.value;
            } else if (value.color) {
                cssValue = value.color;
            } else {
                cssValue = JSON.stringify(value);
            }
        }

        css += `  ${cssVarName}: ${cssValue};\n`;
    }

    css += `}\n`;

    return css;
}

/**
 * Generate TypeScript module from design tokens
 */
function generateTypeScript(flatTokens) {
    const timestamp = new Date().toISOString();

    let ts = `/* Design Tokens - Auto-generated from GitHub repository */\n`;
    ts += `/* Last updated: ${timestamp} */\n`;
    ts += `/* Source: https://github.com/jamesyoung-tech/tokens-test */\n\n`;

    ts += `export interface DesignTokens {\n`;
    for (const key of Object.keys(flatTokens)) {
        ts += `  '${key}': string;\n`;
    }
    ts += `}\n\n`;

    ts += `export const tokens: DesignTokens = {\n`;
    for (const [key, value] of Object.entries(flatTokens)) {
        const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
        ts += `  '${key}': '${stringValue}',\n`;
    }
    ts += `};\n\n`;

    ts += `export default tokens;\n`;

    return ts;
}

/**
 * Filter tokens based on patterns
 * Only include tokens that match the specified prefixes or patterns
 */
function filterTokens(flatTokens, patterns = []) {
    // If no patterns specified, return all tokens
    if (patterns.length === 0) {
        return flatTokens;
    }

    const filtered = {};
    for (const [key, value] of Object.entries(flatTokens)) {
        // Check if token key matches any pattern
        const matches = patterns.some(pattern => {
            if (pattern.endsWith('*')) {
                // Wildcard pattern
                return key.startsWith(pattern.slice(0, -1));
            }
            return key === pattern || key.startsWith(pattern + '-');
        });

        if (matches) {
            filtered[key] = value;
        }
    }
    return filtered;
}

// Configuration: Define which token patterns to include
// Examples: ['button*', 'color*', 'spacing*']
// Leave empty [] to include all tokens
const TOKEN_PATTERNS = []; // Change this to filter specific tokens

// Main execution
console.log('🚀 Fetching design tokens from GitHub...\n');

fetchTokens()
    .then(tokens => {
        console.log('\n✅ Successfully fetched tokens');
        console.log(`📦 Found ${Object.keys(tokens).length} token category(ies)\n`);

        // Flatten tokens for easier access
        const flatTokens = {};
        for (const [category, value] of Object.entries(tokens)) {
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                for (const [key, val] of Object.entries(value)) {
                    flatTokens[key] = val;
                }
            } else {
                flatTokens[category] = value;
            }
        }

        console.log(`📋 Total flattened tokens: ${Object.keys(flatTokens).length}`);

        // Filter tokens if patterns are specified
        const filteredTokens = filterTokens(flatTokens, TOKEN_PATTERNS);

        if (TOKEN_PATTERNS.length > 0) {
            console.log(`🔍 Filtered to ${Object.keys(filteredTokens).length} token(s) matching patterns: ${TOKEN_PATTERNS.join(', ')}`);
        }

        // Generate CSS
        const css = generateCSS(tokens);
        fs.writeFileSync(OUTPUT_CSS_FILE, css, 'utf8');
        console.log(`✅ CSS tokens written to ${OUTPUT_CSS_FILE}`);

        // Generate TypeScript (using filtered tokens)
        const ts = generateTypeScript(filteredTokens);
        fs.writeFileSync(OUTPUT_TS_FILE, ts, 'utf8');
        console.log(`✅ TypeScript tokens written to ${OUTPUT_TS_FILE}`);

        console.log('🎉 Design tokens updated successfully!');
    })
    .catch(error => {
        console.error('\n❌ Error:', error.message);
        console.error('\n💡 Please ensure:');
        console.error('   1. The tokens-test repository exists and is public');
        console.error('   2. The design-tokens.json file exists in the repository');
        console.error('   3. You have internet connectivity');
        console.error('\n📝 You can manually update src/tokens.css with your design tokens');
        process.exit(1);
    });
