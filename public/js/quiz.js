let currentQuestions = [];
let currentQuestionIndex = 0;

let currentScore = 0;
let currentXP = 0;

let currentStageId = null;


function startQuiz(islandId, stageId) {

    currentStageId = stageId;

    currentQuestions =
        getQuestions(stageId);

    currentQuestionIndex = 0;

    currentScore = 0;

    currentXP = 0;


    document.getElementById(
        "quiz-island"
    ).textContent =
        islandId.toUpperCase();


    showScreen("quiz-screen");

    displayQuestion();

}


function displayQuestion() {

    const question =
        currentQuestions[currentQuestionIndex];


    if (!question) {

        finishQuiz();

        return;
    }


    const total =
        currentQuestions.length;


    const number =
        currentQuestionIndex + 1;


    document.getElementById(
        "question-number"
    ).textContent =
        `QUESTION ${String(number).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;


    document.getElementById(
        "quiz-stage"
    ).textContent =
        currentStageId.toUpperCase();


    document.getElementById(
        "question-text"
    ).textContent =
        question.querySelector("text").textContent.trim();


    const xp =
        question.querySelector("xp").textContent;


    document.getElementById(
        "question-xp"
    ).textContent =
        `+${xp}`;


    const progress =
        (number / total) * 100;


    document.getElementById(
        "quiz-progress"
    ).style.width =
        `${progress}%`;


    renderOptions(question);

}


function renderOptions(question) {

    const optionsContainer =
        document.getElementById("options");

    optionsContainer.innerHTML = "";


    const options =
        question.querySelectorAll("option");


    options.forEach(option => {

        const button =
            document.createElement("button");

        button.className = "option";


        const id =
            option.getAttribute("id");


        const text =
            option.textContent;


        button.innerHTML = `
            <span class="option-label">
                ${id}
            </span>

            ${text}
        `;


        button.addEventListener(
            "click",
            () => {

                checkAnswer(
                    question,
                    id,
                    button
                );

            }
        );


        optionsContainer.appendChild(button);

    });
}


function checkAnswer(
    question,
    selectedAnswer,
    selectedButton
) {

    const correctAnswer =
        question.querySelector(
            "answer"
        ).textContent.trim();


    const allOptions =
        document.querySelectorAll(".option");


    allOptions.forEach(
        option => option.disabled = true
    );


    if (selectedAnswer === correctAnswer) {

        selectedButton.classList.add(
            "correct"
        );

        currentScore++;

        const xp =
            Number(
                question.querySelector("xp").textContent
            );

        currentXP += xp;

        addXP(xp);

        showNotification(
            "✓ ANSWER VERIFIED"
        );

    } else {

        selectedButton.classList.add(
            "wrong"
        );

        allOptions.forEach(option => {

            const label =
                option.querySelector(
                    ".option-label"
                ).textContent;

            if (label === correctAnswer) {

                option.classList.add(
                    "correct"
                );

            }

        });

        showNotification(
            "✕ INCORRECT // SIGNAL LOST"
        );
    }


    setTimeout(() => {

        currentQuestionIndex++;

        displayQuestion();

    }, 1000);
}

function finishQuiz() {

    localStorage.setItem(
        `completed-${currentStageId}`,
        "true"
    );


    document.getElementById(
        "result-score"
    ).textContent =
        `${currentScore} / ${currentQuestions.length}`;


    document.getElementById(
        "result-xp"
    ).textContent =
        currentXP;


    const stage =
        xmlDocument.querySelector(
            `stage[id="${currentStageId}"]`
        );


    if (stage) {

        document.getElementById(
            "result-title"
        ).textContent =
            stage.querySelector(
                "name"
            ).textContent.toUpperCase();

    }


    showScreen("result-screen");
}