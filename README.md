# Spotify Web Sleep Timer

A Chrome extension that adds a missing feature to Spotify Web Player: a sleep timer to automatically pause music after a set duration.

## Features

- **Simple Timer Presets**: Choose from 15, 30, 45, or 60-minute timers
- **Visual Countdown**: See remaining time at a glance
- **Automatic Pause**: Music stops automatically when the timer expires
- **Desktop Notification**: Get notified when the timer completes
- **Clean Interface**: Spotify-themed design that matches the web player

## Why This Extension?

The Spotify mobile app has a built-in sleep timer, but the web player doesn't. This extension fills that gap, making it perfect for:

- Falling asleep to music
- Focused work sessions with time limits
- Preventing music from playing all night
- Users who can't install the desktop app (e.g., corporate restrictions)

## Installation

### Method 1: Load Unpacked Extension (Developer Mode)

1. **Download the extension files** to your computer
2. **Open Chrome** and navigate to `chrome://extensions/`
3. **Enable Developer Mode** by toggling the switch in the top-right corner
4. **Click "Load unpacked"** button
5. **Select the extension folder** (`spotify-sleep-timer`)
6. The extension is now installed and ready to use!

### Method 2: Package as .crx (Optional)

1. Follow steps 1-3 from Method 1
2. Click **"Pack extension"** button
3. Select the extension folder and click "Pack Extension"
4. Share the generated `.crx` file with others

## How to Use

1. **Open Spotify Web Player** at [open.spotify.com](https://open.spotify.com)
2. **Start playing music**
3. **Click the extension icon** in your Chrome toolbar (moon + music note icon)
4. **Select a timer duration**: 15, 30, 45, or 60 minutes
5. **Watch the countdown** in the popup
6. **Music will pause automatically** when the timer expires

### Canceling a Timer

- Click the extension icon and press the **"Cancel Timer"** button

## Technical Details

### Architecture

- **Manifest V3**: Uses the latest Chrome extension standards
- **Background Service Worker**: Manages timers using Chrome Alarms API
- **Content Script**: Interacts with Spotify's DOM to control playback
- **Popup Interface**: Provides user controls and countdown display

### Permissions

- `storage`: Store timer state
- `alarms`: Schedule timer completion
- `activeTab`: Access current tab information
- `notifications`: Show completion notifications
- `host_permissions`: Access Spotify Web Player (open.spotify.com)

### Browser Compatibility

- Chrome 88+
- Edge 88+
- Any Chromium-based browser with Manifest V3 support

## Files Structure

```
spotify-sleep-timer/
├── manifest.json          # Extension configuration
├── icons/                 # Extension icons (16, 48, 128px)
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── popup/                 # Popup UI
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
├── scripts/               # Background and content scripts
│   ├── background.js      # Timer management
│   └── content.js         # Spotify playback control
└── README.md             # This file
```

## Troubleshooting

### Timer doesn't pause music

- Make sure you're on the Spotify Web Player (`open.spotify.com`)
- Ensure music is actually playing when the timer expires
- Try refreshing the Spotify page and setting a new timer

### Extension icon doesn't appear

- Check that the extension is enabled in `chrome://extensions/`
- Pin the extension to your toolbar by clicking the puzzle icon

### Timer doesn't persist after closing popup

- This is expected behavior - the timer runs in the background
- You can close the popup and the timer will still complete

## Privacy

This extension:
- ✅ Runs entirely locally in your browser
- ✅ Does NOT collect any data
- ✅ Does NOT track your listening habits
- ✅ Does NOT require a Spotify account or API access
- ✅ Only interacts with the Spotify Web Player DOM

## License

This project is provided as-is for personal use. Feel free to modify and share.

## Version History

### v1.0.0 (2024-12-24)
- Initial release
- Timer presets: 15, 30, 45, 60 minutes
- Countdown display
- Desktop notifications
- Automatic pause functionality

## Credits

Created to solve a common user pain point: the missing sleep timer in Spotify Web Player.

Icon design inspired by Spotify's brand colors and sleep/music themes.
