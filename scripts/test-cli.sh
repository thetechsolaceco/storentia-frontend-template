#!/bin/bash

echo "🧪 Storentia CLI Local Testing"
echo "================================"
echo ""

if [ ! -f "create-storentia-1.0.1.tgz" ]; then
    echo "📦 Creating package tarball..."
    npm pack
    echo ""
fi

echo "✅ Tarball ready"
echo ""
echo "📋 Test options:"
echo ""
echo "Option 1: Direct Node Execution"
echo "  node scripts/cli.js test-store"
echo ""
echo "Option 2: Install from Tarball"
echo "  npm install -g ./create-storentia-*.tgz"
echo "  create-storentia test-store"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
read -p "Test now with direct node execution? (y/n): " choice

if [ "$choice" = "y" ]; then
    echo ""
    node scripts/cli.js test-local-store
else
    echo ""
    echo "👍 Skipping test."
fi
