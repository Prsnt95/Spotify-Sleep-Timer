# Chrome Web Store Submission Guide

## Prerequisites

1. **Chrome Web Store Developer Account**
   - Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   - Sign in with your Google account
   - Pay a **one-time $5 registration fee** (if you haven't already)
   - This fee is required to publish extensions

## Step 1: Prepare Your Extension Package

### Create a ZIP file

1. **Make sure your extension folder is clean:**
   - Remove any unnecessary files (like `.git`, `node_modules`, etc.)
   - Keep only the essential files:
     - `manifest.json`
     - `icons/` folder (with all icon files)
     - `popup/` folder (with HTML, CSS, JS)
     - `scripts/` folder (with background.js and content.js)

2. **Create a ZIP file:**
   - On Mac: Right-click the `spotify-sleep-timer` folder → "Compress"
   - On Windows: Right-click → "Send to" → "Compressed (zipped) folder"
   - **Important:** ZIP the folder contents, not the folder itself
   - Name it something like `spotify-sleep-timer-v1.0.0.zip`

### Verify your manifest.json

Your manifest looks good! Make sure:
- ✅ `manifest_version: 3` (required)
- ✅ All required icons present (16, 48, 128px)
- ✅ Proper permissions declared
- ✅ Version number is set

## Step 2: Prepare Store Listing Assets

### Required Information:

1. **Screenshots** (at least 1, recommended 5):
   - **1280x800px** or **640x400px** (16:10 aspect ratio)
   - Show your extension in action
   - Take screenshots of:
     - The popup with timer buttons
     - The countdown display
     - Custom timer input
     - Desktop notification

2. **Small Promotional Tile** (440x280px):
   - Optional but recommended
   - Marketing image for the store listing

3. **Detailed Description** (up to 16,000 characters):
   ```
   Add a sleep timer to Spotify Web Player! Automatically pause your music after a set duration.

   Features:
   • Quick presets: 5 seconds, 15, 30, 45, or 60 minutes
   • Custom timer: Set any duration in minutes
   • Visual countdown: See remaining time at a glance
   • Works from any tab: Set timer without switching to Spotify
   • Desktop notifications: Get notified when timer completes
   • Auto-pause: Music stops automatically when timer expires

   Perfect for:
   • Falling asleep to music
   • Focused work sessions
   • Preventing music from playing all night
   • Users who can't install the desktop app

   How to use:
   1. Open Spotify Web Player (open.spotify.com)
   2. Start playing music
   3. Click the extension icon
   4. Select a timer duration or enter custom minutes
   5. Music will pause automatically when timer expires

   Privacy:
   • Runs entirely locally in your browser
   • Does NOT collect any data
   • Does NOT track your listening habits
   • Does NOT require Spotify API access
   • Only interacts with Spotify Web Player

   Note: This extension works with Spotify Web Player only. It does not work with the Spotify desktop app.
   ```

4. **Short Description** (up to 132 characters):
   ```
   Add a sleep timer to Spotify Web Player. Automatically pause music after a set duration.
   ```

5. **Category:**
   - Select "Productivity" or "Entertainment"

6. **Language:**
   - English (and any other languages you support)

## Step 3: Upload to Chrome Web Store

1. **Go to Developer Dashboard:**
   - Visit: https://chrome.google.com/webstore/devconsole
   - Click **"New Item"** button

2. **Upload ZIP file:**
   - Click **"Upload"** or drag and drop your ZIP file
   - Wait for upload and processing (may take a few minutes)

3. **Fill in Store Listing:**
   - **Name:** Spotify Web Sleep Timer
   - **Summary:** (Short description from above)
   - **Description:** (Detailed description from above)
   - **Category:** Productivity or Entertainment
   - **Language:** English
   - **Screenshots:** Upload your screenshots
   - **Icon:** Your 128x128 icon (auto-filled from manifest)
   - **Privacy Policy:** (See Step 4)

4. **Set Visibility:**
   - **Unlisted:** Only people with the link can install
   - **Public:** Anyone can find and install (recommended after testing)

5. **Pricing:**
   - Select **"Free"**

## Step 4: Privacy Policy (Required)

Since your extension uses permissions, you need a privacy policy URL.

### Option 1: Create a Simple Privacy Policy Page

Create a file `PRIVACY_POLICY.md` or host it online:

```
# Privacy Policy for Spotify Web Sleep Timer

Last updated: [Date]

## Data Collection

Spotify Web Sleep Timer does NOT collect, store, or transmit any personal data.

## Data Storage

The extension stores timer settings locally in your browser using Chrome's local storage API. This data:
- Never leaves your device
- Is not shared with any third parties
- Is deleted when you uninstall the extension

## Permissions Used

- **storage**: To save timer settings locally
- **alarms**: To schedule timer completion
- **activeTab**: To detect Spotify tabs
- **notifications**: To show timer completion alerts
- **scripting**: To pause Spotify playback
- **host_permissions**: To access Spotify Web Player (open.spotify.com)

## Third-Party Services

This extension does not use any third-party analytics, tracking, or data collection services.

## Contact

If you have questions about this privacy policy, please contact [your email].
```

### Option 2: Use a Free Hosting Service

- GitHub Pages (free)
- Google Sites (free)
- Netlify (free)
- Any web hosting service

Upload your privacy policy and use that URL in the store listing.

## Step 5: Submit for Review

1. **Review Checklist:**
   - ✅ All required fields filled
   - ✅ Privacy policy URL provided
   - ✅ Screenshots uploaded
   - ✅ ZIP file uploaded successfully
   - ✅ No errors in the dashboard

2. **Click "Submit for Review"**

3. **Wait for Review:**
   - Usually takes **1-3 business days**
   - You'll receive an email when reviewed
   - If rejected, you'll get feedback on what to fix

## Step 6: After Approval

1. **Your extension will be live!**
   - Share the Chrome Web Store link
   - Users can install with one click

2. **Monitor:**
   - Check reviews and ratings
   - Respond to user feedback
   - Fix bugs and release updates

## Common Issues & Solutions

### Issue: "Manifest file is invalid"
- **Solution:** Make sure your manifest.json is valid JSON (no trailing commas, proper quotes)

### Issue: "Missing required icon"
- **Solution:** Ensure you have 16x16, 48x48, and 128x128 PNG icons

### Issue: "Privacy policy required"
- **Solution:** You must provide a privacy policy URL if your extension requests permissions

### Issue: "Host permissions must be declared"
- **Solution:** Your manifest already has this correct with `host_permissions`

## Tips for Success

1. **Good Screenshots:** Show the extension in action, not just the UI
2. **Clear Description:** Explain what it does and why users need it
3. **Respond to Reviews:** Engage with users who leave feedback
4. **Regular Updates:** Fix bugs and add features based on feedback
5. **Keywords:** Use relevant keywords in your description for discoverability

## Updating Your Extension

When you want to release an update:

1. Update `version` in `manifest.json` (e.g., "1.0.1")
2. Create a new ZIP file
3. Go to your extension in the Developer Dashboard
4. Click "Upload Updated Package"
5. Upload the new ZIP
6. Submit for review (updates usually review faster)

## Resources

- [Chrome Web Store Developer Documentation](https://developer.chrome.com/docs/webstore/)
- [Chrome Web Store Policies](https://developer.chrome.com/docs/webstore/program-policies/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)

Good luck with your submission! 🚀

