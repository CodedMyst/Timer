let timerInterval;
let remainingTime = 25 * 60; // Default 25 minutes
let isRunning = false;

const timerElement = document.getElementById("timer");
const workInput = document.getElementById("work-duration");
const breakInput = document.getElementById("break-duration");
const startButton = document.getElementById("start");
const pauseButton = document.getElementById("pause");
const resetButton = document.getElementById("reset");

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateTimerDisplay() {
    timerElement.textContent = formatTime(remainingTime);
}

function startTimer() {
    if (isRunning) return;

    isRunning = true;
    timerInterval = setInterval(() => {
        if (remainingTime > 0) {
            remainingTime--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            isRunning = false;
            alert("Time's up!");
            switchToBreak();
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    isRunning = false;
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    const workDuration = parseInt(workInput.value) || 25;
    remainingTime = workDuration * 60;
    updateTimerDisplay();
}

function switchToBreak() {
    const breakDuration = parseInt(breakInput.value) || 5;
    remainingTime = breakDuration * 60;
    updateTimerDisplay();
    alert("Break time! Hit Start to begin.");
}

startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resetButton.addEventListener("click", resetTimer);

// Initialize the timer display
resetTimer();