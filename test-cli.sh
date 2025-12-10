#!/bin/bash

# Storentia Local Testing Script
# This script helps you test the CLI before publishing to NPM

echo "🧪 Storentia CLI Local Testing"
echo "================================"
echo ""

# Check if tarball exists
if [ ! -f "create-storentia-1.0.1.tgz" ]; then
    echo "📦 Creating package tarball..."
    npm pack
    echo ""
fi

echo "✅ Tarball ready: create-storentia-1.0.1.tgz"
echo ""
echo "📋 You can now test the CLI in several ways:"
echo ""
echo "Option 1: Direct Node Execution"
echo "  node bin/cli.js test-store"
echo ""
echo "Option 2: Install from Tarball (Recommended)"
echo "  npm install -g ./create-storentia-1.0.1.tgz"
echo "  create-storentia test-store"
echo "  # When done: npm uninstall -g create-storentia"
echo ""
echo "Option 3: Use npx with Tarball"
echo "  npx ./create-storentia-1.0.1.tgz test-store"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
read -p "Would you like to test now with direct node execution? (y/n): " choice

if [ "$choice" = "y" ]; then
    echo ""
    echo "🚀 Running: node bin/cli.js test-local-store"
    echo ""
    node bin/cli.js test-local-store
else
    echo ""
    echo "👍 Skipping test. You can run it manually later."
    echo ""
    echo "Remember: npm create storentia@latest will ONLY work"
    echo "after you publish the package to NPM!"
fi

echo ""
echo "📝 See TESTING_BEFORE_PUBLISH.md for more testing options"
