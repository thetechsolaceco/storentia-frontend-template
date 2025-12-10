# 🔐 NPM Two-Factor Authentication Setup

## Current Status
- ✅ Logged in as: **thetechsolaceco**
- ✅ Email: thetechsolaceco@gmail.com (verified)
- ⚠️ Two-Factor Auth: **DISABLED** (required for publishing)

## Why 2FA is Required
NPM requires 2FA for publishing packages to prevent unauthorized access and ensure package security.

## How to Enable 2FA

### Option 1: Enable via Web (Recommended)
1. Go to https://www.npmjs.com/settings/thetechsolaceco/profile
2. Click on "Two-Factor Authentication"
3. Choose "Authorization and Publishing" (recommended) or "Authorization Only"
4. Follow the setup wizard:
   - Scan QR code with authenticator app (Google Authenticator, Authy, etc.)
   - Enter the 6-digit code from your app
   - Save your recovery codes in a safe place

### Option 2: Enable via CLI
Run this command and follow the prompts:
```bash
npm profile enable-2fa auth-and-writes
```

You'll need:
- An authenticator app on your phone (Google Authenticator, Authy, Microsoft Authenticator, etc.)
- To scan a QR code or enter a secret key
- To enter a verification code

## After Enabling 2FA

### Publishing with 2FA
When you run `npm publish`, you'll be prompted for a one-time password (OTP):
```bash
npm publish --otp=123456
```

Replace `123456` with the current code from your authenticator app.

### Alternative: Use Automation Token
For CI/CD or automated publishing, create an automation token:
```bash
npm token create --type=automation
```

## Quick Steps to Publish After 2FA Setup

1. **Enable 2FA** (see options above)
2. **Get OTP code** from your authenticator app
3. **Publish with OTP**:
   ```bash
   npm publish --otp=YOUR_6_DIGIT_CODE
   ```

## Example Publishing Flow

```bash
# 1. Check your authenticator app for the current code
# Let's say the code is: 123456

# 2. Publish with the OTP
npm publish --otp=123456

# 3. If successful, verify the package
npm view create-storentia
```

## Troubleshooting

### "Invalid OTP" Error
- Make sure you're using the current code (they expire every 30 seconds)
- Check that your phone's time is synchronized
- Try the next code if you're close to expiration

### Lost Authenticator Access
- Use your recovery codes saved during setup
- Contact NPM support if you've lost both

## Next Steps

1. ✅ Enable 2FA using one of the methods above
2. ✅ Save your recovery codes
3. ✅ Get OTP from authenticator app
4. ✅ Run: `npm publish --otp=YOUR_CODE`
5. ✅ Test installation: `npm create storentia@latest test-store`

---

**Need Help?**
- NPM 2FA Docs: https://docs.npmjs.com/configuring-two-factor-authentication
- NPM Support: https://www.npmjs.com/support
