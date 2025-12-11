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

const OUTPUT_FILE = path.join(__dirname, '../src/tokens.css');

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

// Main execution
console.log('🚀 Fetching design tokens from GitHub...\n');

fetchTokens()
    .then(tokens => {
        console.log('\n✅ Successfully fetched tokens');
        console.log(`📦 Found ${Object.keys(tokens).length} token(s)\n`);

        // Generate CSS
        const css = generateCSS(tokens);

        // Write to file
        fs.writeFileSync(OUTPUT_FILE, css, 'utf8');
        console.log(`✅ Tokens written to ${OUTPUT_FILE}`);
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
