let totalXP = 0;


document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await loadXML();


        setTimeout(() => {

            const loading =
                document.getElementById(
                    "loading-screen"
                );

            loading.style.opacity = "0";

            setTimeout(() => {

                loading.remove();

            }, 500);

        }, 1200);

    }
);


/*
    Screen navigation
*/

function showScreen(screenId) {

    document
        .querySelectorAll(".screen")
        .forEach(screen => {

            screen.classList.remove(
                "active"
            );

        });


    document
        .getElementById(screenId)
        .classList.add("active");
}


/*
    Back buttons
*/

document.getElementById(
    "back-world"
).addEventListener(
    "click",
    () => {

        showScreen("world-screen");

    }
);


document.getElementById(
    "back-island"
).addEventListener(
    "click",
    () => {

        openIsland(currentIsland);

    }
);


document.getElementById(
    "continue-button"
).addEventListener(
    "click",
    () => {

        openIsland(currentIsland);

    }
);


/*
    XP
*/

function addXP(amount) {

    totalXP += amount;

    document.getElementById(
        "xp"
    ).textContent =
        String(totalXP).padStart(4, "0");


    const level =
        Math.floor(totalXP / 500) + 1;


    document.getElementById(
        "level"
    ).textContent =
        String(level).padStart(2, "0");

}


/*
    Notification
*/

function showNotification(message) {

    const notification =
        document.getElementById(
            "notification"
        );


    notification.textContent =
        message;


    notification.classList.add(
        "show"
    );


    setTimeout(() => {

        notification.classList.remove(
            "show"
        );

    }, 1300);

}