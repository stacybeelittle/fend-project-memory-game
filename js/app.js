/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}




const deck = document.querySelector('.deck');

function shuffleDeck() {
    const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
    const shuffledCards = shuffle(cardsToShuffle);
    for (card of shuffledCards) {
        deck.appendChild(card);
    }
}
shuffleDeck();


/*Global variables*/

const totalMatches = 8;

let clockId;
let clockOff = true;
let matched = 0;
let moves = 0;
let time = 0;
let toggledCards = [];


//event listener to make clicks responsive

    deck.addEventListener('click', event => {
        const clickTarget = event.target;
        if (isClickValid(clickTarget)) {
            if (clockOff) {
                startClock();
                clockOff = false;
            }
            toggleCard(clickTarget);
            addToggleCard(clickTarget);
            if (clickTarget.classList.contains('card') && toggledCards.length === 2){
                checkForMatch(clickTarget);
                addMove();
                checkScore();
            }
        }
    });


    //checks that clicks are on valid cards (not already matched cards)

    function isClickValid(clickTarget) {
        return (clickTarget.classList.contains('card') && 
        !clickTarget.classList.contains('match') && toggledCards.length < 2 && !toggledCards.includes(clickTarget)
        );
    }

    //switches cards from open to closed

    function toggleCard(card) {
        card.classList.toggle('open');
        card.classList.toggle('show');
    }

    //adds card to small array to check for a match

    function addToggleCard(clickTarget) {
        toggledCards.push(clickTarget);
        console.log(toggledCards);
    }

    //checks the cards against each other to see if they are matching.  Also triggers the end of the game if all matched cards are found

    function checkForMatch() {
        if (toggledCards[0].firstElementChild.className === toggledCards[1].firstElementChild.className) {
            toggledCards[0].classList.toggle('match');
            toggledCards[1].classList.toggle('match');
            toggledCards = [];
            matched++;
            if (matched === totalMatches) {
                gameOver();
            } 
        } else {
            setTimeout(() => {
                toggleCard(toggledCards[0]);
                toggleCard(toggledCards[1]);
                toggledCards = [];
            }, 1000);
        }
    }

    //adds moves to the move counter, changes html of word 'Moves' if only a single move has been recorded

    function addMove() {
        moves++;
        const movesText = document.querySelector('.moves');
        movesText.innerHTML = moves;
        if (moves === 1) {
            document.querySelector('.movesHtml').innerHTML = "  Move";
        } else {
            document.querySelector('.movesHtml').innerHTML = "  Moves";
        }
    }

    //adjusts number of stars depending on how many clicks are made

    function checkScore() {
        if (moves === 17 || moves === 21 || moves === 25) {
            hideStar();
        }
    }

    function hideStar() {
        const allStars = document.querySelectorAll('.stars li');
        for (star of allStars) {
            if (star.style.display !== 'none') {
                star.style.display = 'none';
                break;
            }
        }
    }
    
    //triggers the timer to begin

    function startClock() {
        clockId = setInterval(() => {
            time++;
            displayTime();
        }, 1000);
    }
    
    //adjusts clock on page to reflect time on timer

    function displayTime() {
        const clock = document.querySelector('.clock');
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        if (seconds < 10) {
            clock.innerHTML = `${minutes}:0${seconds}`;
        } else {
            clock.innerHTML = `${minutes}:${seconds}`;
        }
    }
    
    //stops the clock

    function stopClock() {
        clearInterval(clockId);
    }

    //Modal functions

    //triggers modal to appear and disappear

    function toggleModal() {
        const modal = document.querySelector('.modal_background');
        modal.classList.toggle('hide');
    }

    //prints game stats to the modal at end of game

    function writeModalStats() {
        const timeStat = document.querySelector('.modal_time');
        const clockTime = document.querySelector('.clock').innerHTML;
        const movesStat = document.querySelector('.modal_moves');
        const starsStat = document.querySelector('.modal_stars');
        const stars = getStars();

        timeStat.innerHTML = `Time - ${clockTime}`;
        movesStat.innerHTML = `Moves - ${moves}`;
        starsStat.innerHTML = `Stars - ${stars}`;
    }

    function getStars() {
        stars = document.querySelectorAll('.stars li');
        starCount = 0;
        for (star of stars) {
            if (star.style.display !== 'none') {
                starCount++;
            }
        }
        return starCount;
    }

    //Replay/reset functions

    //triggers game to reset all previous settings and start new game

    function replayGame() {
        resetGame();
        toggleModal();
        resetCards();
    }

    function resetCards() {
        const cards = document.querySelectorAll('.deck li');
        for (let card of cards) {
            card.className = 'card';
        }
    }

    function resetGame() {
        resetCards();
        resetGameAndTime();
        resetMoves();
        resetStars();
        shuffleDeck();
    }

    function resetGameAndTime() {
        stopClock();
        clockOff = true;
        time = 0;
        displayTime();
    }

    function resetMoves() {
        moves = 0;
        document.querySelector('.moves').innerHTML = moves;
    }

    function resetStars() {
        stars = 0;
        const starList = document.querySelectorAll('.stars li');
        for (star of starList) {
            star.style.display = 'inline';
        }
    }

    

    document.querySelector('.modal_cancel').addEventListener('click', () => {
        toggleModal();
    })

    document.querySelector('.modal_replay').addEventListener('click', replayGame);

    document.querySelector('.restart').addEventListener('click', resetGame);

//ends the game 

    function gameOver() {
        stopClock();
        toggleModal();
        writeModalStats();
        }

    

