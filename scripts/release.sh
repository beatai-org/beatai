#!/bin/bash

# Release script for beatai-website
# Usage: ./scripts/release.sh <version> "<commit message>"
# Example: ./scripts/release.sh 0.4.4 "Fix authentication bug"

set -e

# Check if version is provided
if [ -z "$1" ]; then
  echo "Error: Version number is required"
  echo "Usage: ./scripts/release.sh <version> \"<commit message>\""
  echo "Example: ./scripts/release.sh 0.4.4 \"Fix authentication bug\""
  exit 1
fi

VERSION=$1
COMMIT_MSG=${2:-"Release v${VERSION}"}

echo "🚀 Starting release process for v${VERSION}..."

# Update package.json version
echo "📝 Updating package.json..."
sed -i '' "s/\"version\": \".*\"/\"version\": \"${VERSION}\"/" package.json

# Check git status
echo "📊 Checking git status..."
git status

# Stage all changes
echo "➕ Staging changes..."
git add -A

# Create commit
echo "💾 Creating commit..."
git commit -m "Release v${VERSION}: ${COMMIT_MSG}

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"

# Create tag
echo "🏷️  Creating tag v${VERSION}..."
git tag -a "v${VERSION}" -m "Release v${VERSION}: ${COMMIT_MSG}"

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main
git push origin "v${VERSION}"

# Show summary
echo ""
echo "✅ Release v${VERSION} completed successfully!"
echo ""
echo "📋 Summary:"
git log --oneline -3
echo ""
echo "🏷️  Tags:"
git tag -l | tail -5
echo ""
echo "🔗 GitHub links:"
echo "   Commit: https://github.com/genesislab-ai/beatai-website/commit/$(git rev-parse HEAD)"
echo "   Tag: https://github.com/genesislab-ai/beatai-website/releases/tag/v${VERSION}"
