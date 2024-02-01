import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

const testWrapper = document.querySelector(".test-wrapper");
const testArea = document.querySelector("#test-area");
const resetButton = document.querySelector("#reset");
const theTimer = document.querySelector(".timer");

var originText = "";
getText();

async function getText(){
    const messages = [
        {
          role: 'system',
          content: 'You are a language knowledge expert.'
        },
        {
          role: 'user',
          content: `Create a random sentence with 10 words in english`
      }
      ]
  
      try {
      const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: messages
          });
        let text =response.choices[0].message.content;
        document.querySelector("#origin-text p").innerHTML = text;
        originText = document.querySelector("#origin-text p").innerHTML;
      } catch (err) {
          console.log(err);
      } 
}

var timer = [0, 0, 0, 0];
var interval;
var timerRunning = false;
var errors = 0;
// Add leading zero to numbers 9 or below (purely for aesthetics):
function leadingZero(time) {
    if (time <= 9) {
        time = "0" + time;
    }
    return time;
}

// Run a standard minute/second/hundredths timer:
function runTimer() {
    let currentTime = leadingZero(timer[0]) + ":" + leadingZero(timer[1]) + ":" + leadingZero(timer[2]);
    theTimer.innerHTML = currentTime;
    timer[3]++;

    timer[0] = Math.floor((timer[3] / 100) / 60);
    timer[1] = Math.floor((timer[3] / 100) - (timer[0] * 60));
    timer[2] = Math.floor(timer[3] - (timer[1] * 100) - (timer[0] * 6000));
}

// Match the text entered with the provided text on the page:
function spellCheck() {
    let textEnterd = testArea.value;
    let originTextMatch = originText.substring(0, textEnterd.length);

    if (textEnterd == originText) {
        clearInterval(interval);
        testWrapper.style.borderColor = "#429890";
        theTimer.style.color = "#429890";
    } else {
        if (textEnterd == originTextMatch) {
            testWrapper.style.borderColor = "#65CCf3";
        }
        else {
            testWrapper.style.borderColor = "#E95D0F";
            errors++;
            document.querySelector(".errors").innerHTML = "Errors: " + errors;
        }
    }
}

// Start the timer:
function start() {
    let textEnterdLen = testArea.value.length;
    if (textEnterdLen === 0 && !timerRunning) {
        timerRunning = true;
        interval = setInterval(runTimer, 10);
    }

}

// Reset everything:
function reset() {
    clearInterval(interval);
    interval = null;
    timer = [0, 0, 0, 0];
    timerRunning = false;
    errors = 0;

    testArea.value = "";
    theTimer.innerHTML = "00:00:00";
    testWrapper.style.borderColor = "grey";
    theTimer.style.color = "black";

    originText = "";
    getText();

    document.querySelector(".errors").innerHTML = "Errors: 0";
}

// Event listeners for keyboard input and the reset button:
testArea.addEventListener("keypress", start, false);
testArea.addEventListener("keyup", spellCheck, false);
resetButton.addEventListener("click", reset, false);