# BIZUIT Custom Form Template

> **This is the base template for creating new custom forms**

## 📖 Documentation

The complete documentation for creating and developing custom forms has been moved to the root of the repository:

👉 **[FORM_DEVELOPMENT_GUIDE.md](../FORM_DEVELOPMENT_GUIDE.md)**

This guide includes:
- ✅ Template setup and customization
- ✅ Local development with fat bundle
- ✅ Testing workflows
- ✅ Environment configuration
- ✅ Deployment instructions
- ✅ Troubleshooting

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup dev credentials (REQUIRED for local testing)
cp dev-credentials.example.js dev-credentials.js
# Edit dev-credentials.js with your Dashboard credentials

# 3. Build form
npm run build

# 4. Serve locally
cd dist
python3 -m http.server 8080

# 5. Open browser
open http://localhost:8080/dev.html
```

⚠️ **Important:** The form needs `dev-credentials.js` for authentication during local testing.

For detailed instructions, see [FORM_DEVELOPMENT_GUIDE.md](../FORM_DEVELOPMENT_GUIDE.md).
