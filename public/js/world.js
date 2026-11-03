let currentIsland = null;

const islandButtons =
    document.querySelectorAll(".island");

islandButtons.forEach(button => {

    button.addEventListener("click", () => {

        const islandId =
            button.dataset.island;

        openIsland(islandId);

    });

});


function openIsland(islandId) {

    currentIsland = islandId;

    const island =
        getIsland(islandId);

    if (!island) {
        return;
    }


    const name =
        island.querySelector("name").textContent;

    const description =
        island.querySelector("description").textContent;


    document.getElementById(
        "island-title"
    ).textContent =
        name.toUpperCase();


    document.getElementById(
        "island-description"
    ).textContent =
        description;


    generateStages(islandId);

    showScreen("island-screen");
}


function generateStages(islandId) {

    const stageMap = document.getElementById("stage-map");
    const svgStages = document.getElementById("svg-stages");

    svgStages.innerHTML = "";

    const stages = getStages(islandId);

    const positions = [
        { x: 150, y: 80 },
        { x: 500, y: 230 },
        { x: 850, y: 150 },
        { x: 700, y: 360 },
        { x: 500, y: 550 }
    ];

    stages.forEach((stage, index) => {

        const stageId = stage.getAttribute("id");
        const stageName =
            stage.querySelector("name").textContent;

        const completed =
            localStorage.getItem(
                `completed-${stageId}`
            ) === "true";

        const previousStage =
            index > 0
                ? stages[index - 1].getAttribute("id")
                : null;

        const previousCompleted =
            index === 0 ||
            localStorage.getItem(
                `completed-${previousStage}`
            ) === "true";

        const unlocked =
            completed || previousCompleted;

        const current =
            unlocked && !completed;

        const position = positions[index];

        const group =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "g"
            );

        group.classList.add("svg-stage");

        if (completed)
            group.classList.add("completed");

        else if (current)
            group.classList.add("current");

        else
            group.classList.add("locked");


        group.setAttribute(
            "transform",
            `translate(${position.x},${position.y})`
        );


        /*
         * Outer ring
         */

        const ring =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "circle"
            );

        ring.classList.add("stage-ring");

        ring.setAttribute("r", "43");


        /*
         * Inner node
         */

        const core =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "circle"
            );

        core.classList.add("stage-core");

        core.setAttribute("r", "32");


        /*
         * Number
         */

        const number =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "text"
            );

        number.classList.add("stage-number-svg");

        number.setAttribute("y", "1");

        number.textContent =
            String(index + 1).padStart(2, "0");


        /*
         * Label
         */

        const label =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "text"
            );

        label.classList.add("stage-label-svg");

        label.setAttribute("y", "70");

        label.textContent =
            stageName;


        group.appendChild(ring);
        group.appendChild(core);
        group.appendChild(number);
        group.appendChild(label);


        /*
         * Completed check mark
         */

        if (completed) {

            const check =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "text"
                );

            check.classList.add("stage-check");

            check.setAttribute("x", "28");
            check.setAttribute("y", "-28");

            check.textContent = "✓";

            group.appendChild(check);
        }


        /*
         * Click event
         */

        if (unlocked) {

            group.addEventListener(
                "click",
                () => {

                    startQuiz(
                        islandId,
                        stageId
                    );

                }
            );

        }


        svgStages.appendChild(group);

    });
}
function travelToNextStage(callback) {

    const stageMap =
        document.getElementById("stage-map");

    const particleMotion =
        document.getElementById("particle-motion");

    if (!stageMap || !particleMotion) {

        callback();

        return;
    }


    stageMap.classList.add("traveling");


    /*
     * Restart SVG animation
     */

    particleMotion.beginElement();


    /*
     * Wait until the player reaches
     * the next stage.
     */

    setTimeout(() => {

        stageMap.classList.remove(
            "traveling"
        );

        callback();

    }, 2000);
}
document
    .getElementById("continue-button")
    .addEventListener("click", nextStage);

function nextStage() {

    const stages = getStages(currentIsland);

    let currentIndex = -1;

    stages.forEach((stage, index) => {

        if (
            stage.getAttribute("id") === currentStageId
        ) {
            currentIndex = index;
        }

    });

    // Last stage completed
    if (
        currentIndex === -1 ||
        currentIndex === stages.length - 1
    ) {

        showScreen("island-screen");
        generateStages(currentIsland);

        return;
    }

    const nextStage =
        stages[currentIndex + 1];

    const nextStageId =
        nextStage.getAttribute("id");

    // Show island map
    showScreen("island-screen");

    generateStages(currentIsland);

    // Start travel animation
    requestAnimationFrame(() => {

        travelToNextStage(() => {

            startQuiz(
                currentIsland,
                nextStageId
            );

        });

    });
}
function travelToNextStage(callback) {

    const stageMap =
        document.getElementById("stage-map");

    const particleMotion =
        document.getElementById("particle-motion");

    if (!stageMap || !particleMotion) {

        callback();

        return;
    }

    stageMap.classList.add("traveling");

    particleMotion.beginElement();

    setTimeout(() => {

        stageMap.classList.remove("traveling");

        callback();

    }, 2000);
}