#!/bin/bash

# Storentia Quick Publish Script
# This script helps you publish updates to NPM with proper version control

echo "🚀 Storentia Publishing Helper"
echo "================================"
echo ""

# Check if logged in to NPM
if ! npm whoami &> /dev/null; then
    echo "❌ Not logged in to NPM. Please run: npm login"
    exit 1
fi

echo "✅ Logged in as: $(npm whoami)"
echo ""

# Show current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "📦 Current version: $CURRENT_VERSION"
echo ""

# Ask for version bump type
echo "Select version bump type:"
echo "1) Patch (bug fixes) - $CURRENT_VERSION → $(npm version patch --no-git-tag-version --dry-run 2>&1 | grep -o 'v[0-9.]*' | sed 's/v//')"
echo "2) Minor (new features) - $CURRENT_VERSION → $(npm version minor --no-git-tag-version --dry-run 2>&1 | grep -o 'v[0-9.]*' | sed 's/v//')"
echo "3) Major (breaking changes) - $CURRENT_VERSION → $(npm version major --no-git-tag-version --dry-run 2>&1 | grep -o 'v[0-9.]*' | sed 's/v//')"
echo "4) Skip version bump"
echo ""

read -p "Enter choice (1-4): " choice

case $choice in
    1)
        echo "📝 Bumping patch version..."
        npm version patch
        ;;
    2)
        echo "📝 Bumping minor version..."
        npm version minor
        ;;
    3)
        echo "📝 Bumping major version..."
        npm version major
        ;;
    4)
        echo "⏭️  Skipping version bump"
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

NEW_VERSION=$(node -p "require('./package.json').version")
echo ""
echo "📦 Version: $NEW_VERSION"
echo ""

# Git push
if [ "$choice" != "4" ]; then
    echo "📤 Pushing to GitHub..."
    git push && git push --tags
    echo ""
fi

# Dry run
echo "🧪 Running publish dry-run..."
npm publish --dry-run
echo ""

# Ask for confirmation
read -p "Ready to publish? (y/n): " confirm

if [ "$confirm" != "y" ]; then
    echo "❌ Publish cancelled"
    exit 0
fi

# Get OTP
echo ""
echo "🔐 Check your authenticator app for the 6-digit code"
read -p "Enter OTP: " otp

# Publish
echo ""
echo "📤 Publishing to NPM..."
npm publish --otp=$otp

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully published create-storentia@$NEW_VERSION"
    echo ""
    echo "🔍 Verify with: npm view create-storentia"
    echo "🧪 Test with: npm create storentia@latest test-store"
else
    echo ""
    echo "❌ Publish failed. Check the error above."
    exit 1
fi
