# Figma Design Tokens Setup Guide

## Recommended Token Structure

### 1. **Organize by Category**

Structure your tokens in Figma (using Tokens Studio or similar) with clear categories:

```
tokens/
├── colors/
│   ├── brand/
│   │   ├── primary
│   │   ├── secondary
│   │   └── accent
│   ├── neutral/
│   │   ├── white
│   │   ├── gray-100
│   │   └── black
│   └── semantic/
│       ├── success
│       ├── error
│       └── warning
├── spacing/
│   ├── xs (4px)
│   ├── sm (8px)
│   ├── md (16px)
│   ├── lg (24px)
│   └── xl (32px)
├── typography/
│   ├── font-family
│   ├── font-size-sm
│   ├── font-size-md
│   └── font-size-lg
└── components/
    └── button/
        ├── primary-bg
        ├── primary-text
        ├── radius
        └── padding
```

### 2. **Naming Convention**

Use kebab-case and descriptive names:

**Good:**
- `ds-color-button-primary`
- `ds-spacing-button-padding-x`
- `ds-radius-button-default`

**Avoid:**
- `buttonColor1`
- `btn-clr`
- `color`

### 3. **Export Structure**

Your `design-tokens.json` should look like this:

```json
{
  "colors": {
    "ds-color-button-primary": "hsl(24, 100%, 50%)",
    "ds-color-button-secondary": "hsl(200, 100%, 50%)",
    "ds-color-text-primary": "hsl(0, 0%, 10%)"
  },
  "spacing": {
    "ds-spacing-xs": "4px",
    "ds-spacing-sm": "8px",
    "ds-spacing-md": "16px"
  },
  "typography": {
    "ds-font-family-primary": "Inter, sans-serif",
    "ds-font-size-body": "16px"
  },
  "borders": {
    "ds-radius-button": "8px",
    "ds-radius-card": "12px"
  }
}
```

### 4. **Filtering Tokens**

To only pull specific tokens, edit `scripts/pull-tokens.js`:

```javascript
// Line 186: Update TOKEN_PATTERNS
const TOKEN_PATTERNS = [
  'ds-color-button*',  // All button colors
  'ds-spacing*',       // All spacing tokens
  'ds-radius*'         // All radius tokens
];
```

**Examples:**

Pull only button-related tokens:
```javascript
const TOKEN_PATTERNS = ['ds-color-button*', 'ds-radius-button*'];
```

Pull only colors:
```javascript
const TOKEN_PATTERNS = ['ds-color*'];
```

Pull everything (default):
```javascript
const TOKEN_PATTERNS = [];
```

### 5. **Best Practices**

#### ✅ DO:
- Use HSL format for colors: `hsl(24, 100%, 50%)`
- Prefix all tokens with `ds-` (design system)
- Group related tokens together
- Use semantic names (`primary`, `secondary`) not descriptive (`blue`, `red`)
- Keep token names consistent across Figma and code

#### ❌ DON'T:
- Mix color formats (hex, rgb, hsl)
- Use generic names (`color1`, `spacing1`)
- Include temporary or experimental tokens in production
- Nest tokens too deeply (max 3-4 levels)

### 6. **Figma Tokens Studio Setup**

If using Tokens Studio plugin:

1. **Create Token Sets:**
   - `core` - Primitive values (colors, spacing)
   - `semantic` - Semantic tokens (primary, secondary)
   - `component` - Component-specific tokens

2. **Export Settings:**
   - Format: JSON
   - Structure: Nested
   - Include: Only active sets

3. **Sync to GitHub:**
   - Set up GitHub sync in Tokens Studio
   - Point to: `tokens-test/tokens/design-tokens.json`
   - Auto-commit on save

### 7. **Testing Your Tokens**

After updating tokens in Figma:

```bash
# Pull latest tokens
npm run pull-tokens

# Check what was imported
cat src/tokens.ts

# Test locally
npm run dev
```

### 8. **Example Workflow**

1. **In Figma:**
   - Update button color: `ds-color-button-primary` → `hsl(200, 80%, 50%)`
   - Save/sync to GitHub

2. **Locally:**
   ```bash
   npm run pull-tokens
   ```

3. **Verify:**
   - Check `src/tokens.ts` has the new color
   - Test in browser at `localhost:5173`

4. **Deploy:**
   ```bash
   git add -A
   git commit -m "Update button color"
   git push
   ```
   - Vercel auto-deploys with new tokens!

## Common Issues

### Issue: Too many tokens imported
**Solution:** Use `TOKEN_PATTERNS` to filter

### Issue: Token names don't match
**Solution:** Ensure consistent naming in Figma (use `ds-` prefix)

### Issue: Colors not in HSL
**Solution:** Convert in Figma or add conversion to pull-tokens script

### Issue: Nested tokens not flattening
**Solution:** The script auto-flattens, but check your JSON structure

## Need Help?

Check the `pull-tokens.js` script for the filtering logic and adjust `TOKEN_PATTERNS` as needed.
