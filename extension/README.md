# Nullmail Browser Extension

Browser extension for quick access to Nullmail.cc temporary email addresses.

## Features
- Automatic detection of visited Nullmail.cc mailboxes
- Quick access via right-click context menu
- Smart expiry detection and cleanup
- One-click generation of new temporary emails
- Cross-browser compatible (Chrome & Firefox)

## How It Works
- Monitors navigation to Nullmail.cc mailbox pages
- Uses webRequest API to detect email expiry (404 responses)
- Stores active email addresses locally
- Provides context menu shortcuts

## Installation
Available on:
- Chrome Web Store: [link when approved]
- Firefox Add-ons: [link when approved]

## Development
```bash
npm run build:extension:all    # Build both versions
npm run package:extension:all  # Create store packages
```

## Files
- `manifest-v2.json` - Firefox Manifest V2
- `manifest-v3.json` - Chrome Manifest V3
- `background.js` - Main extension logic
