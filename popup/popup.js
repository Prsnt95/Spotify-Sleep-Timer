// DOM elements
const timerButtons = document.getElementById('timer-buttons');
const activeTimerDiv = document.getElementById('active-timer');
const countdownDisplay = document.getElementById('countdown');
const cancelBtn = document.getElementById('cancel-btn');
const statusDiv = document.getElementById('status');
const customMinutesInput = document.getElementById('custom-minutes');
const customTimerBtn = document.getElementById('custom-timer-btn');

// Store countdown timeout ID so we can clear it
let countdownTimeoutId = null;

// Stop any running countdown
function stopCountdown() {
  if (countdownTimeoutId !== null) {
    clearTimeout(countdownTimeoutId);
    countdownTimeoutId = null;
  }
}

// Update UI based on current timer state
async function updateUI() {
  // Stop any existing countdown first
  stopCountdown();

  const result = await chrome.storage.local.get([
    'timerEndTime',
    'timerDuration',
  ]);

  if (result.timerEndTime && result.timerEndTime > Date.now()) {
    // Timer is active
    timerButtons.classList.add('hidden');
    activeTimerDiv.classList.remove('hidden');
    updateCountdown(result.timerEndTime);
  } else {
    // No active timer
    timerButtons.classList.remove('hidden');
    activeTimerDiv.classList.add('hidden');
    countdownDisplay.textContent = '--:--';
  }
}

// Format time as MM:SS
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Update countdown display
function updateCountdown(endTime) {
  // Clear any existing timeout first
  stopCountdown();

  const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
  countdownDisplay.textContent = formatTime(remaining);

  if (remaining > 0) {
    countdownTimeoutId = setTimeout(() => updateCountdown(endTime), 1000);
  } else {
    updateUI();
  }
}

// Show status message
function showStatus(message, isError = false) {
  statusDiv.textContent = message;
  statusDiv.className = 'status ' + (isError ? 'error' : 'success');
  setTimeout(() => {
    statusDiv.textContent = '';
    statusDiv.className = 'status';
  }, 3000);
}

// Find Spotify tab
async function findSpotifyTab() {
  try {
    // First, try to find any open Spotify tab
    const tabs = await chrome.tabs.query({
      url: 'https://open.spotify.com/*',
    });

    if (tabs.length > 0) {
      // Return the first Spotify tab (prefer audible/active ones)
      const audibleTab = tabs.find((tab) => tab.audible);
      return audibleTab || tabs[0];
    }

    // If no Spotify tab found, check if there's a stored tabId that might be Spotify
    const stored = await chrome.storage.local.get(['tabId']);
    if (stored.tabId) {
      try {
        const tab = await chrome.tabs.get(stored.tabId);
        if (tab.url && tab.url.includes('open.spotify.com')) {
          return tab;
        }
      } catch (e) {
        // Tab doesn't exist anymore
      }
    }

    return null;
  } catch (error) {
    console.error('Error finding Spotify tab:', error);
    return null;
  }
}

// Set timer
async function setTimer(minutes, seconds) {
  try {
    // Find Spotify tab (can be from any tab)
    const spotifyTab = await findSpotifyTab();

    if (!spotifyTab) {
      showStatus('Please open Spotify Web Player in a tab first', true);
      return;
    }

    // Calculate duration in milliseconds
    let duration;
    let statusMessage;
    if (seconds !== undefined) {
      duration = seconds * 1000;
      statusMessage = `Timer set for ${seconds} seconds`;
    } else {
      duration = minutes * 60 * 1000;
      statusMessage = `Timer set for ${minutes} minutes`;
    }

    const endTime = Date.now() + duration;

    // Store timer info
    await chrome.storage.local.set({
      timerEndTime: endTime,
      timerDuration: duration,
      tabId: spotifyTab.id,
    });

    // Send message to background script to set alarm
    await chrome.runtime.sendMessage({
      action: 'setTimer',
      endTime: endTime,
      tabId: spotifyTab.id,
    });

    showStatus(statusMessage);
    updateUI();
  } catch (error) {
    console.error('Error setting timer:', error);
    showStatus('Failed to set timer', true);
  }
}

// Cancel timer
async function cancelTimer() {
  try {
    // Stop countdown immediately
    stopCountdown();

    await chrome.storage.local.remove([
      'timerEndTime',
      'timerDuration',
      'tabId',
    ]);
    await chrome.runtime.sendMessage({ action: 'cancelTimer' });

    showStatus('Timer cancelled');
    updateUI();
  } catch (error) {
    console.error('Error cancelling timer:', error);
    showStatus('Failed to cancel timer', true);
  }
}

// Event listeners
timerButtons.addEventListener('click', (e) => {
  if (e.target.classList.contains('timer-btn')) {
    const seconds = e.target.dataset.seconds
      ? parseInt(e.target.dataset.seconds)
      : undefined;
    const minutes = e.target.dataset.minutes
      ? parseInt(e.target.dataset.minutes)
      : undefined;
    setTimer(minutes, seconds);
  }
});

cancelBtn.addEventListener('click', cancelTimer);

// Custom timer event listeners
customTimerBtn.addEventListener('click', () => {
  const minutes = parseInt(customMinutesInput.value);
  if (minutes && minutes > 0) {
    setTimer(minutes, undefined);
    customMinutesInput.value = ''; // Clear input after setting timer
  } else {
    showStatus('Please enter a valid number of minutes', true);
  }
});

// Allow Enter key to submit custom timer
customMinutesInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    customTimerBtn.click();
  }
});

// Initialize UI on load
updateUI();

// Listen for timer completion messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'timerCompleted') {
    updateUI();
    showStatus('Timer completed - Music paused');
  }
});
