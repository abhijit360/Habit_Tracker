let startTime;
let interval;
let paused = false;
let prev_time = 0;

function updateTime() {
  const currentTime = Date.now();
  const elapsedTime = Math.floor((currentTime - startTime + prev_time) / 1000);
  const hours = Math.floor(elapsedTime / 3600);
  const minutes = Math.floor((elapsedTime % 3600) / 60);
  const seconds = elapsedTime % 60;
  chrome.runtime.sendMessage({ h: hours, m: minutes, s: seconds });
  chrome.storage.session.set({
    'current-time': { h: hours, m: minutes, s: seconds },
  });
}

function resumeTimer() {
  if (paused) {
    paused = false;
    startTimer();
    chrome.storage.session.set({"timer-state": "resume"})
  }
}

function pauseTimer() {
  if (!paused) {
    prev_time += Math.floor(Date.now() - startTime);
    clearTimer();
    paused = true
    chrome.storage.session.set({"timer-state": "paused"});
  }
}
async function clearTimer() {
//   prev_time = 0;
  clearInterval(interval);
  interval = null;
}

async function EndTimer() {
  prev_time = 0;
  clearInterval(interval);
  interval = null;
  chrome.storage.session.set({ 'timer-active-key': false });
}

function startTimer() {
  if (interval == null) {
    chrome.storage.session.set({"timer-state": "resume"})
    startTime = Date.now();
    interval = setInterval(updateTime, 1000);
    chrome.storage.session.setAccessLevel({
      accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS',
    });
    chrome.storage.session.set({ 'timer-active-key': true });
  }
}

chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${oldValue}", new value is "${newValue}".`
    );
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'start-timer') {
    console.log('starting-timer');
    startTimer();
    sendResponse({ status: 'timer started' });
  } else if (message.type === 'end-timer') {
    console.log('stopping-timer');
    EndTimer();
    sendResponse({ status: 'timer stopped' });
  } else if (message.type === 'pause-timer') {
    console.log('pause-timer');
    pauseTimer();
    sendResponse({ status: 'timer paused' });
  } else if (message.type === 'resume-timer') {
    console.log('resume-timer');
    resumeTimer();
    sendResponse({ status: 'timer resumed' });
  }
});
