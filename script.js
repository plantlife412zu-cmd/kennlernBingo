// ==========================================
// KENNENLERN-BINGO
// 5 x 5
// Mitte = FREE
// ==========================================


// ------------------------------------------
// Deine 24 Bingo-Aussagen
// ------------------------------------------

const questions = [
    'Nutzt kein TikTok',
    'Ist nicht Hetero',
    'Macht regelmäßig Sport',
    'Hat ein "n" und "a" im Namen',
    'Ist 18',
    'Lieblingsfarbe Pink ist',
    'Ist/wird dieses Jahr umziehen',
    'Hat Woyzeck gelesen',
    'Hat keine Allergie',
    'Macht ein FöJ/FSJ',
    'Noch nie vorher in Dortmund war',
    'Hat die Känguru Pentalogie gehört',
    'Ist nicht ausgezogen',
    'Hat in der Schule jedes Buch gelesen',
    'Kein BVB Fan ist :(',
    'Hat regelmäßig Kontakt zu Pferden',
    'War schon auf 3 Kontinenten',
    'Kommt relativ frisch aus dem Urlaub',
    'Ist Hetero',
    'War mit Laurenz in der Grundschule',
    'Hat in der Schule kein Buch gelesen',
    'Noch nie in Münsti war',
    'Spielt ein Instrument',
    'Hat Haustier(e)'
];


// ------------------------------------------
// Zufällige Reihenfolge erstellen
// ------------------------------------------

function shuffle(array) {

    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {

        const j =
            Math.floor(Math.random() * (i + 1));

        [
            shuffled[i],
            shuffled[j]
        ] = [
            shuffled[j],
            shuffled[i]
        ];
    }

    return shuffled;
}


// ------------------------------------------
// Board auswählen
// ------------------------------------------
//
// Wir speichern das Board im Browser.
// Dadurch bekommt das gleiche Handy
// beim erneuten Öffnen wieder dasselbe Board.
//

let savedBoard =
    localStorage.getItem("bingoBoard");

let board;


if (savedBoard) {

    board = JSON.parse(savedBoard);

} else {

    board = shuffle(questions);

    localStorage.setItem(
        "bingoBoard",
        JSON.stringify(board)
    );
}


// ------------------------------------------
// Bereits eingetragene Namen laden
// ------------------------------------------

let savedNames =
    JSON.parse(
        localStorage.getItem("bingoNames")
    ) || {};


// ------------------------------------------
// Board anzeigen
// ------------------------------------------

const bingoBoard =
    document.getElementById("bingoBoard");

const boardInfo =
    document.getElementById("boardInfo");


boardInfo.textContent =
    "Finde jemanden, der/die...";


// ------------------------------------------
// 25 Felder erstellen
// ------------------------------------------

for (let index = 0; index < 25; index++) {

    const cell =
        document.createElement("div");

    cell.className = "bingo-cell";


    // --------------------------------------
    // Mittleres Feld = FREE
    // --------------------------------------

    if (index === 12) {

        cell.classList.add("free-cell");
        cell.classList.add("completed");

        const freeText =
            document.createElement("div");

        freeText.className =
            "question";

        freeText.textContent =
            "Freies Feld!";

        cell.appendChild(freeText);

        bingoBoard.appendChild(cell);

        continue;
    }


    // --------------------------------------
    // Frage
    // --------------------------------------

    // Weil das mittlere Feld frei ist,
    // müssen wir bei den Fragen ab Position
    // 12 eine Position überspringen.

    let questionIndex;

    if (index < 12) {

        questionIndex = index;

    } else {

        questionIndex = index - 1;
    }


    const question =
        board[questionIndex];


    const questionElement =
        document.createElement("div");

    questionElement.className =
        "question";

    questionElement.textContent =
        question;


    // --------------------------------------
    // Namensfeld
    // --------------------------------------

    const input =
        document.createElement("input");

    input.className =
        "name-input";

    input.placeholder =
        "Name";


    // Gespeicherten Namen laden

    if (savedNames[index]) {

        input.value =
            savedNames[index];

        cell.classList.add(
            "completed"
        );
    }


    // --------------------------------------
    // Namen speichern
    // --------------------------------------

    input.addEventListener(
        "input",
        function () {

            savedNames[index] =
                input.value;

            localStorage.setItem(
                "bingoNames",
                JSON.stringify(savedNames)
            );


            if (
                input.value.trim() !== ""
            ) {

                cell.classList.add(
                    "completed"
                );

            } else {

                cell.classList.remove(
                    "completed"
                );
            }


            checkBingo();
        }
    );


    // --------------------------------------
    // Elemente ins Feld
    // --------------------------------------

    cell.appendChild(
        questionElement
    );

    cell.appendChild(
        input
    );

    bingoBoard.appendChild(
        cell
    );
}


// ------------------------------------------
// Bingo überprüfen
// ------------------------------------------

function checkBingo() {

    const cells =
        document.querySelectorAll(
            ".bingo-cell"
        );


    const completed =
        Array.from(cells).map(
            cell =>
                cell.classList.contains(
                    "completed"
                )
        );


    // Reihen

    for (let row = 0; row < 5; row++) {

        const start =
            row * 5;

        if (
            completed[start] &&
            completed[start + 1] &&
            completed[start + 2] &&
            completed[start + 3] &&
            completed[start + 4]
        ) {

            showBingo();
            return;
        }
    }


    // Spalten

    for (let col = 0; col < 5; col++) {

        if (
            completed[col] &&
            completed[col + 5] &&
            completed[col + 10] &&
            completed[col + 15] &&
            completed[col + 20]
        ) {

            showBingo();
            return;
        }
    }


    // Diagonale 1

    if (
        completed[0] &&
        completed[6] &&
        completed[12] &&
        completed[18] &&
        completed[24]
    ) {

        showBingo();
        return;
    }


    // Diagonale 2

    if (
        completed[4] &&
        completed[8] &&
        completed[12] &&
        completed[16] &&
        completed[20]
    ) {

        showBingo();
        return;
    }
}


// ------------------------------------------
// BINGO anzeigen
// ------------------------------------------

function showBingo() {

    if (
        document.getElementById(
            "bingoMessage"
        )
    ) {
        return;
    }


    const message =
        document.createElement("div");

    message.id =
        "bingoMessage";

    message.textContent =
        "🎉 BINGO! 🎉";


    document
        .querySelector(".container")
        .prepend(message);
}


// ------------------------------------------
// Neues Bingo
// ------------------------------------------

document
    .getElementById("resetButton")
    .addEventListener(
        "click",
        function () {

            const answer =
                confirm(
                    "Möchtest du wirklich ein neues Bingo bekommen? Deine bisherigen Einträge werden gelöscht."
                );


            if (!answer) {
                return;
            }


            localStorage.removeItem(
                "bingoBoard"
            );

            localStorage.removeItem(
                "bingoNames"
            );


            location.reload();
        }
    );
