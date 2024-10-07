let timer;
let seconds = 0;

document.getElementById('start').addEventListener('click', function() {
    const duration = document.getElementById('duration').value;
    const label = document.getElementById('label').value;
    seconds = parseInt(duration);
    document.getElementById('timer').innerHTML = formatTime(seconds);
    timer = setInterval(function() {
        seconds--;
        document.getElementById('timer').innerHTML = formatTime(seconds);
        if (seconds <= 0) {
            clearInterval(timer);
            alert(`${label} is up!`);
        }
    }, 1000);
});

document.getElementById('stop').addEventListener('click', function() {
    clearInterval(timer);
});

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}
