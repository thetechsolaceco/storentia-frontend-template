# Quick Reference: API Key Validation

## 🚀 Quick Start

```bash
npm create storentia@latest my-store
```

## 📋 What Happens

1. **Enter Store Name** → You'll be prompted for your store name
2. **Enter API Key** → You'll be prompted for your Storentia API key
3. **Automatic Validation** → The CLI validates your key
4. **View Store Info** → See your store details
5. **Store Creation** → Your store is created with validated data

## ✅ Valid Key Example

```
🔐 Enter your Storentia authentication key: sk_prod_gGBtannC3LcP76L3QIlmxLkyWpDuCuDnJfB9095je-I

🔍 Validating your authentication key...
✅ Authentication successful!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Store Information:
  • Store Name: test store
  • Store ID: 20dc50db-b623-4076-85df-c6d2eec70992
  • Owner: samridh satnalika
  • Key Type: PROD
  • Permissions: READ, WRITE, MANAGE_PRODUCTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 Cloning Storentia template...
```

## ❌ Invalid Key Example

```
🔐 Enter your Storentia authentication key: invalid_key

🔍 Validating your authentication key...
❌ Authentication failed: Invalid API key
Please check your API key and try again.
```

## 🔑 Getting Your API Key

1. Visit https://storekit.samarthh.me
2. Sign in to your account
3. Navigate to Store Settings
4. Generate a new API key
5. Copy the key (starts with `sk_prod_`)

## 📁 Environment Variables Created

After successful validation, these files are created:

### `.env.local`
```env
STORENTIA_AUTH=sk_prod_...
NEXT_PUBLIC_STORE_ID=your_store_id
NEXT_PUBLIC_STORE_NAME=Your Store Name
STORE_OWNER_ID=owner_id
STORE_OWNER_NAME=Owner Name
STORE_OWNER_EMAIL=owner@example.com
API_KEY_TYPE=PROD
API_KEY_PERMISSIONS=READ,WRITE,MANAGE_PRODUCTS
NEXT_PUBLIC_API_URL=https://storekit.samarthh.me/v1
```

### `.env.dashboard`
Same as `.env.local` plus:
```env
NEXT_PUBLIC_DASHBOARD_MODE=true
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=auto_generated_secret
```

## 🛠️ Common Issues

### "Authentication failed: Invalid API key"
**Solution**: Check that your API key is correct and active

### "API validation failed: getaddrinfo ENOTFOUND"
**Solution**: Check your internet connection

### "Authentication key cannot be empty"
**Solution**: Enter a valid API key when prompted

## 📖 More Information

- Full Documentation: [API_VALIDATION_FEATURE.md](./API_VALIDATION_FEATURE.md)
- Changelog: [CHANGELOG.md](./CHANGELOG.md)
- Implementation Details: [API_VALIDATION_IMPLEMENTATION.md](./API_VALIDATION_IMPLEMENTATION.md)

## 🔒 Security Tips

- ✅ Never commit `.env.local` or `.env.dashboard` to Git
- ✅ Keep your API keys secure
- ✅ Use production keys only in production
- ✅ Rotate keys if compromised

## 🆘 Support

- GitHub Issues: https://github.com/thetechsolaceco/Storentia-Init/issues
- Email: support@techsolace.co

---

**Version**: 1.1.0  
**Last Updated**: December 11, 2025
