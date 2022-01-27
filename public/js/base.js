let loadedFile;
let questionNumber;
let currentQuestionNumber;
const fr = new FileReader();
const questionText = document.getElementById('question');
const answerButtons = document.getElementsByClassName('question-answer');
const receivedPointsElem = document.getElementById('correct-points');
const maxPointsElem = document.getElementById('max-points');
const questionNumberElem = document.getElementById('question-number');
const fileInput = document.getElementById('file-input');
let correctAnswer;
let selectedAnswer;
let selectedAnswerNo;


// Listeners
for (var i = 0; i < answerButtons.length; i++) {
    let button = answerButtons[i];
    button.addEventListener('click', checkAnswer);
}
document.getElementById('load-questions').addEventListener('click', () => {
    document.getElementById('file-input').click();
});
document.getElementById('previous-question').addEventListener('click', previousQuestion);
document.getElementById('next-question').addEventListener('click', nextQuestion);
document.getElementById('confirm-choice').addEventListener('click', confirmChoice);

document.getElementById('file-input').addEventListener("change", function () {
    file_to_read = (document.getElementById('file-input').files[0]);
    var fileread = new FileReader();
  fileread.onload = function(e) {
    var content = e.target.result;
    loadedFile = JSON.parse(content); // parse json 
    displayQuestions();
  };
  fileread.readAsText(file_to_read);
})

function previousQuestion() {

    if (currentQuestionNumber === undefined) {
        alert('load question');
        return;
    } 

    if ((currentQuestionNumber - 1) !== -1) {
        setUpQuestion(loadedFile.questions[currentQuestionNumber-1], currentQuestionNumber-1);
    }

    // Clear selected btn
    clearBtnsColor();

    let currentQuestion = loadedFile.questions[currentQuestionNumber];

    if (currentQuestion.answered !== undefined && currentQuestion.answered === true) {
        if (currentQuestion.answeredCorrect === true) {
            //Color button if was answered
            selectAnswerField(currentQuestion.answeredButtonNumber, "rgb(103,230,140)");
        } else {
            selectAnswerField(currentQuestion.answeredButtonNumber, "rgb(230,138,138)");
        }
    }
    if (currentQuestion.selectedAnswer !== undefined) {
        selectAnswerField(currentQuestion.selectedAnswer, "rgb(0, 20, 230)");
    }
}

function nextQuestion() {
    if (currentQuestionNumber === undefined) {
        alert('load question');
        return;
    } 

    if ((currentQuestionNumber + 1) <= loadedFile.questions.length) {
        setUpQuestion(loadedFile.questions[currentQuestionNumber+1], currentQuestionNumber+1);
    }

    // Clear selected btn
    clearBtnsColor();

    let currentQuestion = loadedFile.questions[currentQuestionNumber];

    if (currentQuestion.answered !== undefined && currentQuestion.answered === true) {
        if (currentQuestion.answeredCorrect === true) {
            //Color button if was answered
            selectAnswerField(currentQuestion.answeredButtonNumber, "rgb(103,230,140)");
        } else {
            selectAnswerField(currentQuestion.answeredButtonNumber, "rgb(230,138,138)");
        }
    }
    if (currentQuestion.selectedAnswer !== undefined) {
        selectAnswerField(currentQuestion.selectedAnswer, "rgb(0, 20, 230)");
    }
}

function displayQuestions() {
    if(typeof loadedFile !== "undefined") {
        document.getElementById('test-name').textContent = loadedFile.fileName;
        // initially after loading new file, always start from question 0
        setUpQuestion(loadedFile.questions[0], 0);
        // Clear selected btn
        clearBtnsColor();
        // Set max points
        maxPointsElem.textContent = loadedFile.questions.length;
        // Set received points to 0
        receivedPointsElem.textContent = 0;
    } else {
        alert('questions are udnefined and couldnt display them');
    } 
}

// setup displayed question and answers. Assigns correct answer to the variable
function setUpQuestion(givenQuestion, questionNumber){
    
    questionText.textContent  = givenQuestion.question;
    for (var i = 0; i < answerButtons.length; i++) {
        answerButtons[i].textContent = givenQuestion.answers[i];
    }

    correctAnswer = givenQuestion.correctAnswer;
    currentQuestionNumber = questionNumber;
    questionNumberElem.textContent = questionNumber+1+'.';
}

function checkAnswer(evt) {
    // if no question was selected create pop up
    if (currentQuestionNumber === undefined) {
        alert('load question');
        return;
    } 

    let anySelected = false;
    let selectedNumber;
    let currentQuestion = loadedFile.questions[currentQuestionNumber];

    // if current question was not answered
    if (currentQuestion.answered === undefined && currentQuestion.answered !== true) {
        let clickedButtonNumber = evt.currentTarget.id;
        // let clickedButton = answerButtons[evt.currentTarget.id];
        console.log(answerButtons[evt.currentTarget.id]);

        // iterate over answers and check if any was selected
        for (var i = 0; i < answerButtons.length; i++) {
            if (answerButtons[i].anySelected === true) {
                anySelected = true;
                selectedNumber = i;
                break;
            }
        }

        // if non was selected, color selected option and save selected answer
        if (anySelected === false) {

            selectAnswerField(clickedButtonNumber, "rgb(0, 20, 230)");
            currentQuestion.selectedAnswer = clickedButtonNumber;

        // if any was selected, deselect it, change properties and color, and select new one
        } else if (anySelected === true && typeof selectedNumber !== "undefined") {
            answerButtons[i].anySelected = false;
            answerButtons[i].style.backgroundColor = "#6c757d";

            selectAnswerField(clickedButtonNumber, "rgb(0, 20, 230)");
            currentQuestion.selectedAnswer = clickedButtonNumber;
        }
    }

}

// After clicking confirm btn
function confirmChoice() {
    // if no question was selected create pop up
    if (currentQuestionNumber === undefined) {
        alert('load question');
        return;
    } 

    if (selectedAnswer !== undefined) {
        loadedFile.questions[currentQuestionNumber]["answered"] = true
        // If answer was correct
        if (selectedAnswer === correctAnswer) {
            loadedFile.questions[currentQuestionNumber].answeredCorrect = true;
            loadedFile.questions[currentQuestionNumber].answeredButtonNumber = selectedAnswerNo;
            answerButtons[selectedAnswerNo].style.backgroundColor = "rgb(103,230,140)";
            receivedPointsElem.textContent = Number(receivedPointsElem.textContent)+1;
            loadedFile.questions[currentQuestionNumber].selectedAnswer = undefined;
        // If answer was incorrect
        } else {
            loadedFile.questions[currentQuestionNumber].answeredCorrect = false;
            loadedFile.questions[currentQuestionNumber].answeredButtonNumber = selectedAnswerNo;
            answerButtons[selectedAnswerNo].style.backgroundColor = "rgb(230,138,138)";
            loadedFile.questions[currentQuestionNumber].selectedAnswer = undefined;
        }
    }
}

// Iterates over btns html elements list, removes color and info is selected. 
// Undefines selected answer
function clearBtnsColor() {
    for (var i = 0; i < answerButtons.length; i++) {
        if (answerButtons[i].anySelected === true) {
            answerButtons[i].anySelected = false;
            answerButtons[i].style.backgroundColor = "#6c757d";
        }
    }

    selectedAnswer = undefined;
}

// Marks field as selected for the given number
function selectAnswerField(buttonNumber, color) {
    answerButtons[buttonNumber].style.backgroundColor = color;
    answerButtons[buttonNumber]["anySelected"] = true;
    selectedAnswer = answerButtons[buttonNumber].textContent;
    selectedAnswerNo = answerButtons[buttonNumber].id;
}