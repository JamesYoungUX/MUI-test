#!/usr/bin/env node

/**
 * Pull Design Tokens from GitHub Repository
 * This script fetches the latest design tokens from the tokens-test repository
 * and generates a CSS file with CSS custom properties
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const GITHUB_RAW_URL = 'https://raw.githubusercontent.com/jamesyoung-tech/tokens-test/main/design-tokens.json';
const OUTPUT_FILE = path.join(__dirname, '../src/tokens.css');

// Add cache busting to ensure we get the latest version
const url = `${GITHUB_RAW_URL}?t=${Date.now()}`;

console.log('🚀 Fetching design tokens from GitHub...');
console.log(`📍 URL: ${GITHUB_RAW_URL}`);

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        if (res.statusCode !== 200) {
            console.error(`❌ Failed to fetch tokens: HTTP ${res.statusCode}`);
            console.error('Response:', data);
            process.exit(1);
        }

        try {
            const tokens = JSON.parse(data);
            console.log('✅ Successfully fetched tokens');

            // Generate CSS
            const css = generateCSS(tokens);

            // Write to file
            fs.writeFileSync(OUTPUT_FILE, css, 'utf8');
            console.log(`✅ Tokens written to ${OUTPUT_FILE}`);
            console.log('🎉 Design tokens updated successfully!');

        } catch (error) {
            console.error('❌ Error processing tokens:', error.message);
            process.exit(1);
        }
    });

}).on('error', (error) => {
    console.error('❌ Network error:', error.message);
    process.exit(1);
});

/**
 * Generate CSS from design tokens
 */
function generateCSS(tokens) {
    const timestamp = new Date().toISOString();

    let css = `/* Design Tokens - Auto-generated from GitHub repository */\n`;
    css += `/* Last updated: ${timestamp} */\n`;
    css += `/* Source: https://github.com/jamesyoung-tech/tokens-test */\n\n`;
    css += `:root {\n`;

    // Process each token
    for (const [key, value] of Object.entries(tokens)) {
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
