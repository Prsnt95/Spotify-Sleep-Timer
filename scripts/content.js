// Content script for Spotify Web Player
// This script runs in the context of the Spotify web page

console.log('Spotify Sleep Timer: Content script loaded');

// Function to pause Spotify playback
function pauseSpotify() {
  console.log('Spotify Sleep Timer: Attempting to pause playback');

  // First, check if music is currently playing
  const playPauseButton = document.querySelector(
    '[data-testid="control-button-playpause"]'
  );

  if (!playPauseButton) {
    console.log('Spotify Sleep Timer: Could not find play/pause button');
    return false;
  }

  const ariaLabel = playPauseButton.getAttribute('aria-label') || '';
  const title = playPauseButton.getAttribute('title') || '';
  const buttonText = playPauseButton.textContent || '';

  // Check if it's currently playing (button shows "Pause" or has pause icon)
  const isCurrentlyPlaying =
    ariaLabel.toLowerCase().includes('pause') ||
    title.toLowerCase().includes('pause') ||
    buttonText.toLowerCase().includes('pause') ||
    playPauseButton.querySelector('svg[aria-label*="Pause"]') ||
    playPauseButton.querySelector('svg[aria-label*="pause"]');

  if (!isCurrentlyPlaying) {
    console.log('Spotify Sleep Timer: Music is already paused, doing nothing');
    return true; // Success - music is already paused
  }

  console.log('Spotify Sleep Timer: Music is playing, attempting to pause');

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
    console.log('Spotify Sleep Timer: Sent Space key event');
  } catch (error) {
    console.log('Spotify Sleep Timer: Keyboard event failed', error);
  }

  // Method 2: Click the pause button
  try {
    playPauseButton.click();
    playPauseButton.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true })
    );
    playPauseButton.dispatchEvent(
      new MouseEvent('mousedown', { bubbles: true, cancelable: true })
    );
    playPauseButton.dispatchEvent(
      new MouseEvent('mouseup', { bubbles: true, cancelable: true })
    );
    console.log('Spotify Sleep Timer: Clicked pause button');
    return true;
  } catch (error) {
    console.error('Spotify Sleep Timer: Button click failed', error);
  }

  // If we got here, pause attempt failed
  console.error('Spotify Sleep Timer: Failed to pause playback');
  return false;
}

// Function to check if music is currently playing
function isPlaying() {
  const playButton = document.querySelector(
    '[data-testid="control-button-playpause"]'
  );
  if (playButton) {
    const ariaLabel = playButton.getAttribute('aria-label');
    return ariaLabel && ariaLabel.toLowerCase().includes('pause');
  }
  return false;
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Spotify Sleep Timer: Received message', message);

  if (message.action === 'pausePlayback') {
    const success = pauseSpotify();
    sendResponse({ success: success });
  } else if (message.action === 'checkPlaying') {
    const playing = isPlaying();
    sendResponse({ isPlaying: playing });
  }

  return true; // Keep message channel open for async response
});

// Notify background script that content script is ready
chrome.runtime.sendMessage({ action: 'contentScriptReady' });
