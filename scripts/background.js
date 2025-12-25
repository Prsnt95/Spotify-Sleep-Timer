// Background service worker for managing timers

console.log('Spotify Sleep Timer: Background service worker initialized');

const ALARM_NAME = 'spotifySleepTimer';

// Handle messages from popup and content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background: Received message', message);

  if (message.action === 'setTimer') {
    setTimer(message.endTime, message.tabId);
    sendResponse({ success: true });
  } else if (message.action === 'cancelTimer') {
    cancelTimer();
    sendResponse({ success: true });
  } else if (message.action === 'contentScriptReady') {
    console.log('Background: Content script ready in tab', sender.tab?.id);
    sendResponse({ success: true });
  }

  return true;
});

// Set a timer using Chrome alarms API
async function setTimer(endTime, tabId) {
  try {
    // Clear any existing alarms
    await chrome.alarms.clear(ALARM_NAME);

    // Calculate delay in minutes
    const delayMs = endTime - Date.now();
    // Allow very short durations (minimum 0.001 minutes = ~60ms)
    const delayMinutes = Math.max(0.001, delayMs / 60000);

    console.log(
      `Background: Setting alarm for ${delayMinutes} minutes (${Math.round(delayMs / 1000)} seconds)`
    );

    // Create alarm
    await chrome.alarms.create(ALARM_NAME, {
      delayInMinutes: delayMinutes,
    });

    // Store tab ID for later
    await chrome.storage.local.set({ tabId: tabId });

    console.log('Background: Timer set successfully');
  } catch (error) {
    console.error('Background: Error setting timer', error);
  }
}

// Cancel the timer
async function cancelTimer() {
  try {
    await chrome.alarms.clear(ALARM_NAME);
    await chrome.storage.local.remove([
      'timerEndTime',
      'timerDuration',
      'tabId',
    ]);
    console.log('Background: Timer cancelled');
  } catch (error) {
    console.error('Background: Error cancelling timer', error);
  }
}

// Handle alarm trigger
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === ALARM_NAME) {
    console.log('Background: Timer alarm triggered');
    await handleTimerComplete();
  }
});

// Find Spotify tab
async function findSpotifyTab() {
  try {
    // First, try the stored tabId if it exists
    const stored = await chrome.storage.local.get(['tabId']);
    if (stored.tabId) {
      try {
        const tab = await chrome.tabs.get(stored.tabId);
        if (tab.url && tab.url.includes('open.spotify.com')) {
          console.log('Background: Found Spotify tab from stored tabId');
          return tab;
        }
      } catch (e) {
        // Tab doesn't exist anymore, continue searching
      }
    }

    // Search for any open Spotify tab
    const tabs = await chrome.tabs.query({
      url: 'https://open.spotify.com/*',
    });

    if (tabs.length > 0) {
      // Prefer audible tabs (tabs playing audio)
      const audibleTab = tabs.find((tab) => tab.audible);
      if (audibleTab) {
        console.log('Background: Found audible Spotify tab');
        return audibleTab;
      }
      console.log('Background: Found Spotify tab');
      return tabs[0];
    }

    console.log('Background: No Spotify tab found');
    return null;
  } catch (error) {
    console.error('Background: Error finding Spotify tab', error);
    return null;
  }
}

// Handle timer completion
async function handleTimerComplete() {
  try {
    // Find Spotify tab (searches if stored tabId doesn't work)
    const tab = await findSpotifyTab();

    if (!tab) {
      console.error('Background: No Spotify tab found');
      await cleanupTimer();
      return;
    }

    // Pause playback using direct script injection (most reliable)
    console.log('Background: Attempting to pause playback');

    let pauseSuccess = false;

    try {
      // Method 1: Try direct script injection to pause
      const result = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          console.log('Spotify Sleep Timer: Executing pause script');

          // First, check if music is currently playing
          const playPauseButton = document.querySelector(
            '[data-testid="control-button-playpause"]'
          );

          if (!playPauseButton) {
            console.log(
              'Spotify Sleep Timer: Could not find play/pause button'
            );
            return false;
          }

          const ariaLabel = playPauseButton.getAttribute('aria-label') || '';
          const title = playPauseButton.getAttribute('title') || '';
          const buttonText = playPauseButton.textContent || '';

          // Check if music is currently playing
          // If button says "Pause", music is playing. If it says "Play", music is paused.
          const isCurrentlyPlaying =
            ariaLabel.toLowerCase().includes('pause') ||
            title.toLowerCase().includes('pause') ||
            buttonText.toLowerCase().includes('pause');

          if (!isCurrentlyPlaying) {
            console.log(
              'Spotify Sleep Timer: Music is already paused, doing nothing'
            );
            return true; // Success - music is already paused
          }

          console.log(
            'Spotify Sleep Timer: Music is playing, attempting to pause'
          );

          // Method 1: Try keyboard shortcut (Space bar) - only if playing
          try {
            const spaceEvent = new KeyboardEvent('keydown', {
              key: ' ',
              code: 'Space',
              keyCode: 32,
              which: 32,
              bubbles: true,
              cancelable: true,
            });
            document.dispatchEvent(spaceEvent);
            document.body.dispatchEvent(spaceEvent);
            // Also try keyup
            const spaceUpEvent = new KeyboardEvent('keyup', {
              key: ' ',
              code: 'Space',
              keyCode: 32,
              which: 32,
              bubbles: true,
              cancelable: true,
            });
            document.dispatchEvent(spaceUpEvent);
            console.log('Spotify Sleep Timer: Sent keyboard events');
          } catch (e) {
            console.error('Spotify Sleep Timer: Keyboard event failed', e);
          }

          // Method 2: Click the pause button
          try {
            playPauseButton.click();
            playPauseButton.dispatchEvent(
              new MouseEvent('click', { bubbles: true, cancelable: true })
            );
            console.log('Spotify Sleep Timer: Clicked pause button');
          } catch (e) {
            console.error('Spotify Sleep Timer: Button click failed', e);
          }

          return true;
        },
      });

      if (result && result[0] && result[0].result !== false) {
        pauseSuccess = true;
        console.log('Background: Pause command executed successfully');
      } else {
        console.log('Background: Script executed but pause may have failed');
        pauseSuccess = true; // Assume success if script ran
      }
    } catch (error) {
      console.error('Background: Direct script injection failed', error);

      // Method 2: Try sending message to content script
      try {
        const response = await chrome.tabs.sendMessage(tab.id, {
          action: 'pausePlayback',
        });
        if (response && response.success) {
          pauseSuccess = true;
          console.log('Background: Pause via content script succeeded');
        } else {
          console.log(
            'Background: Content script responded but pause may have failed'
          );
          pauseSuccess = true; // Assume success if we got a response
        }
      } catch (messageError) {
        console.error(
          'Background: Message to content script failed',
          messageError
        );
      }
    }

    if (pauseSuccess) {
      // Show notification
      try {
        await chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon128.png',
          title: 'Spotify Sleep Timer',
          message: 'Timer completed - Music paused',
          priority: 1,
        });
      } catch (notifError) {
        console.error('Background: Failed to show notification', notifError);
      }
    } else {
      console.error('Background: All pause methods failed');
    }

    // Clean up
    await cleanupTimer();
  } catch (error) {
    console.error('Background: Error handling timer completion', error);
  }
}

// Clean up timer data
async function cleanupTimer() {
  await chrome.storage.local.remove(['timerEndTime', 'timerDuration', 'tabId']);
  await chrome.alarms.clear(ALARM_NAME);
  console.log('Background: Timer data cleaned up');
}

// Check for expired timers on startup (in case service worker was killed)
chrome.runtime.onStartup.addListener(async () => {
  console.log('Background: Extension startup - checking for expired timers');

  const result = await chrome.storage.local.get(['timerEndTime']);

  if (result.timerEndTime) {
    if (result.timerEndTime <= Date.now()) {
      // Timer has expired while service worker was inactive
      console.log('Background: Found expired timer, triggering now');
      await handleTimerComplete();
    } else {
      // Timer is still active, recreate the alarm
      console.log('Background: Recreating active timer alarm');
      const tabId = (await chrome.storage.local.get(['tabId'])).tabId;
      await setTimer(result.timerEndTime, tabId);
    }
  }
});

// Also check on installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Background: Extension installed/updated');
});
