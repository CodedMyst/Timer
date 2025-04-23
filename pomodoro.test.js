const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

describe('Pomodoro Timer', () => {
    let document, window, timer, startButton, stopButton, durationInput, labelInput, coffeeButton;

    beforeAll(() => {
        // Load the HTML file
        const filePath = path.join(__dirname, 'index.html');
        const html = fs.readFileSync(filePath, 'utf-8');
        const dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });

        document = dom.window.document;
        window = dom.window;

        // Mock the script.js functionality
        const scriptPath = path.join(__dirname, 'script.js');
        const scriptContent = fs.readFileSync(scriptPath, 'utf-8');
        const scriptElement = document.createElement('script');
        scriptElement.textContent = scriptContent;
        document.body.appendChild(scriptElement);

        // Wait for the script to be evaluated
        return new Promise((resolve) => {
            dom.window.onload = resolve;
        });
    });

    beforeEach(() => {
        timer = document.getElementById('timer');
        startButton = document.getElementById('start');
        stopButton = document.getElementById('stop');
        durationInput = document.getElementById('duration');
        labelInput = document.getElementById('label');
        coffeeButton = document.querySelector('a[href="https://www.buymeacoffee.com/sarahk.links"]');
    });

    test('Work interval completes and short break starts', (done) => {
        durationInput.value = 5; // Simulate 5 seconds as 25 minutes
        labelInput.value = "Work Interval";

        jest.spyOn(window, 'alert').mockImplementation(() => {});

        startButton.click();

        setTimeout(() => {
            expect(window.alert).toHaveBeenCalledWith('Work Interval is up!');

            durationInput.value = 2; // Simulate 2 seconds as 5 minutes
            labelInput.value = "Short Break";
            startButton.click();

            setTimeout(() => {
                expect(window.alert).toHaveBeenCalledWith('Short Break is up!');
                done();
            }, 2500);
        }, 5500);
    });

    test('Pomodoro cycle completes with long break', (done) => {
        const pomodoroCycle = async (workDuration, shortBreakDuration, longBreakDuration) => {
            for (let i = 1; i <= 4; i++) {
                durationInput.value = workDuration; // Work interval
                labelInput.value = `Work Interval ${i}`;
                startButton.click();

                await new Promise((resolve) => setTimeout(resolve, workDuration * 1000 + 500));
                expect(window.alert).toHaveBeenCalledWith(`Work Interval ${i} is up!`);

                if (i < 4) {
                    durationInput.value = shortBreakDuration; // Short break
                    labelInput.value = `Short Break ${i}`;
                    startButton.click();

                    await new Promise((resolve) => setTimeout(resolve, shortBreakDuration * 1000 + 500));
                    expect(window.alert).toHaveBeenCalledWith(`Short Break ${i} is up!`);
                }
            }

            durationInput.value = longBreakDuration; // Long break
            labelInput.value = "Long Break";
            startButton.click();

            await new Promise((resolve) => setTimeout(resolve, longBreakDuration * 1000 + 500));
            expect(window.alert).toHaveBeenCalledWith('Long Break is up!');
            done();
        };

        pomodoroCycle(2, 1, 3); // Simulated shorter durations for testing
    });

    test('Timer pauses and resumes correctly', (done) => {
        durationInput.value = 5; // Simulate 5 seconds
        labelInput.value = "Pause Test";

        startButton.click();

        setTimeout(() => {
            stopButton.click(); // Pause the timer
            const pausedTime = timer.textContent;

            setTimeout(() => {
                expect(timer.textContent).toBe(pausedTime); // Timer should not change while paused

                startButton.click(); // Resume timer

                setTimeout(() => {
                    expect(timer.textContent).not.toBe(pausedTime); // Timer should resume
                    done();
                }, 2000);
            }, 2000);
        }, 2000);
    });

    test('Handles invalid durations gracefully', () => {
        durationInput.value = -5; // Negative duration
        labelInput.value = "Negative Duration";

        startButton.click();

        expect(timer.textContent).toBe('0:00'); // Timer should not start
    });

    test('Handles zero duration gracefully', () => {
        durationInput.value = 0; // Zero duration
        labelInput.value = "Zero Duration";

        startButton.click();

        expect(timer.textContent).toBe('0:00'); // Timer should not start
    });

    test('Buy Me a Coffee button exists and links correctly', () => {
        expect(coffeeButton).not.toBeNull(); // Button should exist
        expect(coffeeButton.getAttribute('href')).toBe('https://www.buymeacoffee.com/sarahk.links'); // Correct link
    });
});
