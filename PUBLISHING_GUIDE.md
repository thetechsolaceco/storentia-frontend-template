# Storentia Publishing Guide

## ✅ Completed Tasks

### 1. GitHub Repository Setup
- ✅ Initialized Git repository
- ✅ Created initial commit with all project files
- ✅ Added remote: https://github.com/thetechsolaceco/Storentia-Init.git
- ✅ Pushed to GitHub (main branch)

### 2. NPM Package Configuration
- ✅ Updated `package.json` with NPM metadata
- ✅ Created CLI entry point at `bin/cli.js`
- ✅ Made CLI executable
- ✅ Created `.npmignore` to exclude unnecessary files
- ✅ Updated README.md with installation instructions

## 📋 Next Steps for NPM Publishing

### Step 1: Complete NPM Login
You should see a browser login prompt. Follow these steps:

1. Press ENTER in the terminal to open the browser
2. Log in to your NPM account
3. Authorize the CLI access
4. Return to the terminal

### Step 2: Verify NPM Login
After logging in, verify with:
```bash
npm whoami
```

### Step 3: Check Package Name Availability
Before publishing, check if the name is available:
```bash
npm view create-storentia
```

If the package doesn't exist, you'll see an error (which is good!).
If it exists, you may need to choose a different name or scope it (e.g., `@thetechsolace/create-storentia`).

### Step 4: Test the Package Locally (Optional but Recommended)
Test your package locally before publishing:
```bash
npm pack
```

This creates a `.tgz` file. You can test it with:
```bash
npm install -g ./create-storentia-1.0.0.tgz
create-storentia test-store
```

### Step 5: Publish to NPM
When ready, publish your package:
```bash
npm publish
```

For scoped packages (if needed):
```bash
npm publish --access public
```

### Step 6: Verify Publication
After publishing, verify it's available:
```bash
npm view create-storentia
```

### Step 7: Test Installation
Test the published package:
```bash
npm create storentia@latest my-test-store
```

## 🔄 Version Management

For future updates, follow semantic versioning:

### Patch Release (1.0.0 → 1.0.1)
Bug fixes and minor changes:
```bash
npm version patch
git push && git push --tags
npm publish
```

### Minor Release (1.0.0 → 1.1.0)
New features, backward compatible:
```bash
npm version minor
git push && git push --tags
npm publish
```

### Major Release (1.0.0 → 2.0.0)
Breaking changes:
```bash
npm version major
git push && git push --tags
npm publish
```

## 📦 Package Structure

```
create-storentia/
├── bin/
│   └── cli.js          # CLI entry point
├── src/                # Next.js application
├── public/             # Static assets
├── package.json        # NPM package config
├── README.md           # Documentation
├── .gitignore          # Git ignore rules
└── .npmignore          # NPM ignore rules
```

## 🚀 How Users Will Install

Once published, users can create a new Storentia store with:

```bash
npm create storentia@latest my-store-name
```

Or:

```bash
npx create-storentia@latest my-store-name
```

## 🔧 Troubleshooting

### Package Name Already Taken
If `create-storentia` is taken, use a scoped package:
1. Update `package.json` name to `@thetechsolace/create-storentia`
2. Publish with: `npm publish --access public`
3. Users install with: `npm create @thetechsolace/storentia@latest`

### Authentication Issues
If you have 2FA enabled:
```bash
npm login --auth-type=web
```

### Publishing Errors
Check your package before publishing:
```bash
npm publish --dry-run
```

## 📝 Important Notes

1. **Version Control**: Always commit changes before publishing
2. **Testing**: Test locally before publishing to avoid mistakes
3. **Changelog**: Keep a CHANGELOG.md for version history
4. **Tags**: Git tags are automatically created with `npm version`
5. **Unpublishing**: You can only unpublish within 72 hours of publishing

## 🎯 Quick Reference Commands

```bash
# Check login status
npm whoami

# View package info
npm view create-storentia

# Test package locally
npm pack

# Publish package
npm publish

# Update version and publish
npm version patch && git push --tags && npm publish
```

---

**Repository**: https://github.com/thetechsolaceco/Storentia-Init
**Package Name**: create-storentia
**Current Version**: 1.0.0
