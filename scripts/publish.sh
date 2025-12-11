#!/bin/bash

echo "🚀 Storentia Publishing Helper"
echo "================================"
echo ""

if ! npm whoami &> /dev/null; then
    echo "❌ Not logged in to NPM. Please run: npm login"
    exit 1
fi

echo "✅ Logged in as: $(npm whoami)"
echo ""

CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "📦 Current version: $CURRENT_VERSION"
echo ""

echo "Select version bump type:"
echo "1) Patch (bug fixes)"
echo "2) Minor (new features)"
echo "3) Major (breaking changes)"
echo "4) Skip version bump"
echo ""

read -p "Enter choice (1-4): " choice

case $choice in
    1)
        npm version patch
        ;;
    2)
        npm version minor
        ;;
    3)
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

if [ "$choice" != "4" ]; then
    echo "📤 Pushing to GitHub..."
    git push && git push --tags
    echo ""
fi

echo "🧪 Running publish dry-run..."
npm publish --dry-run
echo ""

read -p "Ready to publish? (y/n): " confirm

if [ "$confirm" != "y" ]; then
    echo "❌ Publish cancelled"
    exit 0
fi

echo ""
read -p "Enter OTP: " otp

echo ""
echo "📤 Publishing to NPM..."
npm publish --otp=$otp

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully published create-storentia@$NEW_VERSION"
else
    echo ""
    echo "❌ Publish failed."
    exit 1
fi
