# Publishing Guide

## Prerequisites

- NPM account with 2FA enabled
- Logged in: `npm login`

## Version Management

```bash
# Patch (1.0.0 → 1.0.1) - Bug fixes
npm version patch

# Minor (1.0.0 → 1.1.0) - New features
npm version minor

# Major (1.0.0 → 2.0.0) - Breaking changes
npm version major
```

## Publishing Steps

1. **Test locally**
   ```bash
   npm link
   create-storentia test-store
   npm unlink -g create-storentia
   ```

2. **Bump version**
   ```bash
   npm version patch
   ```

3. **Push to GitHub**
   ```bash
   git push && git push --tags
   ```

4. **Publish to NPM**
   ```bash
   npm publish --otp=YOUR_CODE
   ```

5. **Verify**
   ```bash
   npm view create-storentia
   ```

## Post-Publishing

- Test: `npm create storentia@latest test-store`
- Update GitHub release notes
- Notify users if needed
