let matchCount = 0;
let moves = 0;
let matches = 0;
let classList = [];
let backIds = [];
let backEvents = [];
let frontEvents = [];
let idCount = [];
let timer = 0;
let timerStart = 0;
let timerStop = '';
let clock;

// this funciton sets the functionality for the reset and refresh buttons, 
// which calls the freshGame function to reset the board
buttonFunctions = () => {
    document.querySelector(".resetButton").addEventListener('click', function (event) {
        event.preventDefault();
        stopTimerClock();
        freshGame();
    })

    document.querySelector(".yes").addEventListener('click', function (event) {
        event.preventDefault();
        freshGame();
    })
}

// This function resets the entire game board to default when called. The entire gameboard gets removed and
// rebuild and the timer, match number, counters, and variables get set back to zero
freshGame = () => {
    const score = `<p class="movesScore"> Moves 0 </p>`;
    const star = `<img class="starRating" src="img/star.png"  alt="star ating image"/> 
    <img class="starRating" src="img/star.png"  alt="star ating image"/>
    <img class="starRating" src="img/star.png"  alt="star ating image"/>`;

    let newGameCard = document.createDocumentFragment();

    matchCount = 0;
    moves = 0;
    matches = 0;
    classList = [];
    backIds = [];
    idCount = [];
    timer = 0;
    timerStart = 0;
    
    document.querySelector(".clock").textContent = `Timer 0s`;
    document.querySelector(".win").style.position = `relative`;
    document.querySelector(".win").classList.add("hide");
    document.querySelector(".win").classList.remove("show");
    document.querySelector(".gameCard").remove();
    document.getElementById('movesTime').innerHTML = "";

    newGameCard = document.createElement('div');
    newGameCard.classList.add('gameCard');

    document.querySelector(".game").appendChild(newGameCard);

    for (let i = 0; i < 3; i++){
        if (document.querySelectorAll('.starLost').length > 0){
            document.querySelector('.starLost').remove();
        }
        if (document.querySelectorAll('.starRating').length > 0){
            document.querySelector('.starRating').remove();
        }
    }     
    document.querySelector('.stars').insertAdjacentHTML('afterbegin', star);   

    document.querySelector(".movesScore").remove();
    document.querySelector('.moves').insertAdjacentHTML('afterbegin', score);
    timerStop = '';

    pieceCreation();
    boardOrganization();
    setBackColorToRandom();
    // buttonFunctions();
}

// This function is creates the game pieces, their classnames, images, and IDs
pieceCreation = () => {
    const gameCard = document.querySelector(".gameCard");
    const gamePieces = document.createDocumentFragment();

    for (let i = 1; i < 17; i++) {
        const gamePiece = document.createElement('div');
        const gamePieceBack = document.createElement('div');
        const pieceImg = document.createElement('img');

        pieceImg.setAttribute('src', 'img/magnoliaFlower.svg');
        
        gamePiece.setAttribute('id', i);
        gamePiece.classList.add('gamePiece', 'gamePieceFront', 'col-4');

        gamePieceBack.setAttribute('id', `back${i}`);
        gamePieceBack.classList.add('gamePiece', 'gamePieceBack', 'col-4');

        gamePieces.appendChild(gamePiece);
        gamePieces.appendChild(gamePieceBack);

        gamePiece.appendChild(pieceImg);
    }
    gameCard.appendChild(gamePieces);
}

// This function places the pieces on the board and sets the back images in a random order
boardOrganization = () => {
    const container = document.querySelector('.gameCard');
    const rows = document.createDocumentFragment();
    const backColor = [
        ['red', 'img/aggierings.jpg'], 
        ['purple', 'img/bout.jpg'], 
        ['blue', 'img/cufflinks.jpg'], 
        ['pink', 'img/groomscake.jpg'], 
        ['green', 'img/grow.jpg'], 
        ['yellow', 'img/guestbook.jpg'], 
        ['orange', 'img/ring.jpg'], 
        ['black', 'img/watermelon.jpg']
    ];
    const randomizedPlace = randomPlace(16);

    let count = 1;
    for (let i = 1; i < 9; i++) {
        const pieceImg = document.createElement('img');
        pieceImg.setAttribute('src', backColor[i - 1][1]);
        const pieceImgMatch = document.createElement('img');
        pieceImgMatch.setAttribute('src', backColor[i - 1][1]);

        const back = document.getElementById(`back${i}`);
        back.classList.add(backColor[i-1][0], 'hide');
        const backMatch = document.getElementById(`back${(((backColor.length * 2) +1 ) - i)}`);
        backMatch.classList.add(backColor[i-1][0], 'hide');
        back.appendChild(pieceImg);
        backMatch.appendChild(pieceImgMatch);
    }
    for (let i = 1; i < 5; i++) {
        const row = document.createElement('div');            
        for (let x = 1; x < 5; x++) {

            row.appendChild(document.getElementById(randomizedPlace[count-1]));
            row.appendChild(document.getElementById(`back${randomizedPlace[count-1]}`));
            count++;
        }        
        row.classList.add('row', 'gameRow');
        rows.appendChild(row);
    }
    container.appendChild(rows);

    document.querySelector(".no").addEventListener('click', function(click){
        click.preventDefault();
        chooseNo();
    });
}

// This function establishes the click functions for the front and backs of the game gamePieces
// and randomizes the order of each peice in its row
setBackColorToRandom = () => {
    let count = 1;
    clickCount = 1;

    for (let i = 0; i < 4; i++) {
        const randomizedPlace = randomPlace(4);

        for (let x = 0; x < 4; x++) {
          
            (function (count, x, randomizedPlace) {

                backClickFunct = () => {
                    document.getElementById(count).classList.toggle('hide');
                    document.getElementById(`back${count}`).classList.toggle('hide');
                }

                frontClickFunct = () => {
                    const backClasses = document.getElementById(`back${count}`).classList.toString();
                    document.getElementById(count).classList.toggle('hide');
                    document.getElementById(`back${count}`).classList.toggle('hide');
                    matchBacks(count, backClasses, `back${count}`);
                };

                backEvents.push(backClickFunct);
                frontEvents.push(frontClickFunct);

                document.getElementById(count).addEventListener("click", frontClickFunct );
                document.getElementById(`back${count}`).addEventListener("click", backEvents[count - 1]);
                document.getElementById(count).style.order = `${randomizedPlace[x] - 1}`;
                document.getElementById(`back${count}`).style.order = `${randomizedPlace[x] - 1}`;
            })(count, x, randomizedPlace)
            count++;            
        }  
    }   
}

// This function keeps track of the matches, number of moves, removes the back pieces' click functions 
// and reestablishes the click functions if there is no match. This also calls the onWin function and stops the 
// timer when all pieces have been matched
matchBacks = (count, backClasses, backId) => {
    moves ++;
    matchCount = matchCount + 1;
    classList.push(backClasses);
    backIds.push(count);
    clickCount = count;

    timerStart = new Date().getTime();
    if (moves%2 === 0){
        const score = `<p class="movesScore"> Moves ${moves/2} </p>`;
        document.querySelector(".movesScore").remove();
        document.querySelector('.moves').insertAdjacentHTML('afterbegin', score);

    }
    const star = `<img class="starLost" src="img/starOutline.svg"  alt="star outline"/>`;

    document.getElementById(backId).removeEventListener('click', backEvents[count -1]);
    
    if (moves === 1) {
        timer = performance.now();
        timerClock();
    }else if (moves === 22) {
        document.querySelector('.starRating').remove();
        document.querySelector('.stars').insertAdjacentHTML('afterbegin', star);
    } else if (moves === 28) {
        document.querySelector('.starRating').remove();
        document.querySelector('.stars').insertAdjacentHTML('afterbegin', star);
    }

    if (matchCount === 2) {
        if (classList[0] === classList [1]){
            matches ++;
            if (matches === 8) {
                timerStop = "stop";
                timer = Math.floor((performance.now() - timer) / 1000);
                onWin();
            }
        }
        else {
            (function (backIds) {
                setTimeout(function () {
                    document.getElementById(`back${backIds[0]}`).classList.toggle('hide');
                    document.getElementById(backIds[0]).classList.toggle('hide');

                    document.getElementById(`back${backIds[1]}`).classList.toggle('hide');
                    document.getElementById(backIds[1]).classList.toggle('hide');

                    document.getElementById(`back${backIds[0]}`).addEventListener('click', backEvents[backIds[0] - 1]);
                    document.getElementById(`back${backIds[1]}`).addEventListener('click', backEvents[backIds[1] - 1]);
                }, 1000)
            })(backIds)
        }
        matchCount = 0;
        classList = [];
        backIds = [];
    }
}

// This function creates an array with random numbers bases on the prop passed in. The function returned is used to randomize the backPiece
// images and piece order
randomPlace = (count) => {
    const place = []; 
    const randomizedPlace = [];
    i = count,
    tempPlace = 0;

    for (let x = 1; x < count +1; x++) {
        place.push(x);
    }

    while (i--) {
        tempPlace = Math.floor(Math.random() * Math.floor(place.length));
        randomizedPlace.push(place[tempPlace]);
        place.splice(tempPlace, 1);   
    }
   
    return randomizedPlace;
}

// This function sets the timer functionality based on the performance.now time captured
// at the first move. The timer is stoped when the last piece is matched
timerClock = () => {
  clock =  setInterval(() => {

        let now = performance.now();
        let distance = now - timer;
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.querySelector(".clock").textContent = `Timer ${seconds}s`;

        if (timerStop === "stop") {
            document.querySelector(".clock").textContent = `Timer ${timer}s`;
            clearInterval(clock);
        }
    }, 1000);
}

//This function clears the setInterval function when called
stopTimerClock = () => {
    clearInterval(clock);
}

// This function set the functionality when the player wins. The game card is hidden and the winning announcement along with the Yes and No buttons 
// are shown to the player to continue
onWin = () => {
    const stars = document.querySelectorAll(".starRating").length;
    document.querySelector(".gameCard").classList.add("hide");
    document.querySelector(".win").classList.remove("hide");
    document.querySelector(".win").classList.add("show");
    const time = `You won in ${timer} seconds! <br> You finished with ${stars} stars!`
    document.getElementById("movesTime").innerHTML = `You won in ${timer} seconds! <br> <br> You finished with ${stars} stars!`;
}

// This function sets the functionality when the player selects no. A thank you message is shown.
chooseNo = () => {
    document.querySelector(".win").classList.add("hide");
    document.querySelector(".thanks").classList.remove("hide");
}

pieceCreation();
boardOrganization();
setBackColorToRandom();
buttonFunctions();

