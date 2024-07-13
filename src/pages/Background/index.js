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
    chrome.runtime.sendMessage({ time: `${hours}:${minutes}:${seconds}` });
}

function PausePlayTimer() {
    if (!paused) {
        prev_time += Math.floor(Date.now() - startTime);
        clearTimer();
        paused = true;
    } else {
        paused = false;
        startTimer();
    }
}

function clearTimer() {
    clearInterval(interval);
    interval = null;
}

function startTimer() {
    startTime = Date.now();
    interval = setInterval(updateTime, 1000);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "start-timer") {
        console.log("starting-timer");
        startTimer();
        sendResponse({ status: "timer started" });
    } else if (message.type === "end-timer") {
        console.log("stopping-timer");
        clearTimer();
        sendResponse({ status: "timer stopped" });
    } else if (message.type === "pause-timer") {
        console.log("pause-timer");
        PausePlayTimer();
        sendResponse({ status: "timer paused" });
    } else if (message.type === "resume-timer") {
        console.log("resume-timer");
        PausePlayTimer();
        sendResponse({ status: "timer resumed" });
    }
});
