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


//event listener

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

    function isClickValid(clickTarget) {
        return (clickTarget.classList.contains('card') && 
        !clickTarget.classList.contains('match') && toggledCards.length < 2 && !toggledCards.includes(clickTarget)
        );
    }

    function toggleCard(card) {
        card.classList.toggle('open');
        card.classList.toggle('show');
    }

    function addToggleCard(clickTarget) {
        toggledCards.push(clickTarget);
        console.log(toggledCards);
    }

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

    function addMove() {
        moves++;
        const movesText = document.querySelector('.moves');
        movesText.innerHTML = moves;
    }

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

    
    function startClock() {
        clockId = setInterval(() => {
            time++;
            displayTime();
        }, 1000);
    }
    
    
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
    
    
    function stopClock() {
        clearInterval(clockId);
    }

    function toggleModal() {
        const modal = document.querySelector('.modal_background');
        modal.classList.toggle('hide');
    }

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


    function gameOver() {
        stopClock();
        toggleModal();
        writeModalStats();
        }

    

