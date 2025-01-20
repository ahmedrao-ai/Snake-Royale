// All DOM Elements
// Audio Elements
const scoreSound = document.getElementById('scoreSound');
const winSound = document.getElementById('winSound');
const foulSound = document.getElementById('foulSound');
// Used by All
let board = document.getElementById('board-container');
let score = document.getElementById('score');
    //keys
const upKey = document.querySelectorAll('.up');
const downKey = document.querySelectorAll('.down');
const leftKey = document.querySelectorAll('.left');
const rightKey = document.querySelectorAll('.right');
// Home Menu
const menuHome = document.getElementById('menu');
const levelButton = document.getElementById('levelButton');
const customButton = document.getElementById('customButton');
// Levels Menu Container
const levelsMenuContainer = document.getElementById('levels-menu-container');
// Level Container
const levelContainer = document.getElementById('levels-container');
const levelHeading = document.getElementById('level');
const homeButton = document.getElementById('home')
// Custom Settings
const customSettingsContainer = document.getElementById('custom-settings');
const readyButton = document.getElementById('ready');
// Custom Container
const customContainer = document.getElementById('custom-container');
const playPauseButton = document.getElementById('play-pause');
const settingsButton = document.getElementById('settings');
// Detail Box
const detailBox = document.getElementById('detail-box');
const detailHeading = document.getElementById('heading-detail');
const detailMode = document.getElementById('mode-detail');
const detailSpeed = document.getElementById('speed-detail');
const detailLevelScore = document.getElementById('level-score-detail');
const startLevel = document.getElementById('start-level');
// Message Box
const messageBox = document.getElementById('message-box');
const mainMessage = document.getElementById('main-message');
const errorMessage = document.getElementById('error-message');
const foul = document.getElementById('foul');

// Variables and Arrays
let snake = [];
let hurdles = [];
let themeColors = [{'color1': 'rgb(158, 255, 158)','color2': 'rgb(102, 255, 102)'},{'color1': 'rgb(255, 253, 158)','color2': 'rgb(255, 246, 116)'},{'color1': 'rgb(255, 184, 184)','color2': 'rgb(255, 163, 163)'}];
// board/ground Length and Height
const groundRows = 20;// 0 - 19
const groundColumns = 20;// 0 - 19
// snake length
let snakeLength = 5;
// snake face position (leading box)
let leadingRow = -1, leadingColumn = -1;
// snake permissions for a particular direction
let direction = "right";
// permission to continue game
let gameOn = false;
// permission about button pressed
let buttonPressed = false;
// initializing food positions -1
let foodRow = -1;
let foodColumn = -1;
// pre tail positions in case of increment in length required when eat food
let preTailRow = '';
let preTailCol = '';
// current screen view - will be updating as using
let screenPage = '';
// time interval for each iteration
let timeInterval = 50;


// All Functions
// 1 - Function to update DOM
function updateBoard() {
    // Reset DOM
    board.innerHTML = "";
    // Boolean to match ground box with snake body part
    let snakeFound = false;
    // Two FOR loops for rows and columns
    for (let row = 0; row < groundRows; row++) {
        for (let column = 0; column < groundColumns; column++) {
            // Create a Div element on every loop element
            const box = document.createElement('div');
            // Assign "box" class
            box.className = 'box';
            // Assign ID
            box.id = String(row) + ':' + String(column);
            box.style.backgroundColor = (row + column) % 2 != 0? theme.color1: theme.color2;

            restrictions.forEach(element => {
                let rowH = parseInt(element.split(':')[0])
                let colH = parseInt(element.split(':')[1])
                if(row === rowH && column === colH){
                    box.innerHTML = ''
                    box.style.backgroundColor = 'black'
                    box.style.border = `1px solid ${theme.color1}`;
                }
            })
            // Update boolean if snake found
            snake.forEach( part => {
                const rowS = parseInt(part.split(':')[0]);
                const columnS = parseInt(part.split(':')[1]);
                if(rowS === row && columnS === column)
                    snakeFound = true;
            })
            
            // Change box backgroundColor for snake
            if(snakeFound){
                if(row === leadingRow && column === leadingColumn){
                    box.innerHTML = `
                        <img src="assets/images/head-${snakeColor}.png">
                    `
                    switch(direction) {
                        case "up":
                            box.style.transform = "rotate(270deg)";
                            break;
                        case "down":
                            box.style.transform = "rotate(90deg)";
                            break;
                        case "left":
                            box.style.transform = "rotate(180deg)";
                            break;
                        case "right":
                            box.style.transform = "rotate(0deg)";
                            break;
                    }
                } else {
                    box.innerHTML = `
                        <img src="assets/images/body-${snakeColor}.png">
                    `
                }
            }
            else{
                box.innerHTML = "";
            }
            
            // Food
            if(row === foodRow && column === foodColumn) {
                box.innerHTML = `
                    <img src="assets/images/${fruit}.png">
                `
                box.style.transform = "rotate(0deg)";
            }

            //  Append to DOM
            board.appendChild(box);
            // Reset boolean
            snakeFound = false;
        }
    }
}

// 2 - Function to assign details for every particular level or custom
function updateDetailsForLevel(level = ''){
    direction = 'right';
    createDefaultSnake();
    totalScore = 0;
    score.innerText = totalScore;

    switch(level){
        case 1:
            levelScore = 5;
            mode = 'freestyle';
            theme = returnTheme('orange');
            snakeColor = 'orange';
            fruit = 'cherry';
            speed = returnSpeed('slow');
            restrictions = returnHurdle();
            break;
        case 2:
            levelScore = 5;
            mode = 'hurdle';
            theme = returnTheme('green');
            snakeColor = 'skyblue';
            fruit = 'orange';
            speed = returnSpeed('normal');
            restrictions = returnHurdle();
            break;
        case 3:
            levelScore = 5;
            mode = 'boundry';
            theme = returnTheme('orange');
            snakeColor = 'skyblue';
            fruit = 'cherry';
            speed = returnSpeed('fast');
            restrictions = returnHurdle();
            break;
        case 4:
            levelScore = 5;
            mode = 'master';
            theme = returnTheme('red');
            snakeColor = 'pink';
            fruit = 'apple';
            speed = returnSpeed('fast');
            restrictions = returnHurdle();
            break;
        case 5:
            levelScore = 5;
            mode = 'master';
            theme = returnTheme('orange');
            snakeColor = 'skyblue';
            fruit = 'orange';
            speed = returnSpeed('fast');
            restrictions = returnHurdle().concat(['8:10','9:10','10:10','11:10','12:10']);            
            break;
        default:
            levelScore = 20;
            mode = document.querySelector('input[name="mode"]:checked').value;
            theme = returnTheme(`${document.querySelector('input[name="board"]:checked').value}`);
            snakeColor = document.querySelector('input[name="snake"]:checked').value;
            fruit = document.querySelector('input[name="food"]:checked').value;
            speed = returnSpeed(`${document.querySelector('input[name="speed"]:checked').value}`);
            restrictions = returnHurdle();
            break;
    }
}

// 3 - Function to initialize snake head and body positions
function createDefaultSnake(){
    // empty snake array
    snake = [];
    // filling snake array with default value
    for (let i = 0; i <= snakeLength; i++) {
        snake.push(`0:${i}`);
    }
    // Update leadings
    leadingRow = parseInt(snake[snake.length - 1].split(':')[0]);
    leadingColumn = parseInt(snake[snake.length - 1].split(':')[1]);
}

// 4 - Function to initialize hurdle posotions
function createHurdle(){
    hurdles = [];
    let a = groundRows/4;
    let b = groundColumns/4;
    let c = 20 - a;
    let d = 20 - b;    
    for(let i = a; i <= c; i++){
        for(let j = b; j <= d; j++){
            if(i === a || i === c)
                hurdles.push(`${i}:${j}`);
        }
    }
}

// 5 - Function to check steps and assign new steps as per selected mode
function checkStepWithMode(mode){
    switch(mode){
        case 'freestyle':
        case 'hurdle':
            board.style.borderWidth = '0px'
            switch(direction){
                case "up":
                    leadingRow = leadingRow >= 0 ? leadingRow : 19;
                    break;
                case "down":
                    leadingRow = leadingRow <= 19 ? leadingRow : 0;
                    break;
                case "left":
                    leadingColumn = leadingColumn >= 0 ? leadingColumn : 19;
                    break;
                case "right":
                    leadingColumn = leadingColumn <= 19 ? leadingColumn : 0;
                    break;
            }
            break;
        case 'boundry':
        case 'master':
            board.style.borderWidth = '5px'
            gameOn = true;
            if(leadingRow < 0 || leadingRow > 19 || leadingColumn < 0 || leadingColumn > 19){
                // Playig Foul Sound
                foulSound.play();
                // show Error message
                messageBox.classList.remove('hide');
                mainMessage.innerText = 'Game Over';
                errorMessage.classList.add('show');
                foul.innerText = 'Wall Hit';
                messageBox.querySelector('.home').innerText = screenPage === 'message-level' ? 'Next' : 'Home';
                gameOn = false;
            }
            break;
    }
}

// 6 - Function to instantly move snake in case of button press
function moveSnakeToAndDISPLAY(leadingRow,leadingColumn){
    preTailRow = parseInt(snake[0].split(':')[0]);
    preTailCol = parseInt(snake[0].split(':')[1]);
    for(let i = 0; i < snake.length; i++)
        snake[i] = (i === snake.length-1) ? (`${leadingRow}:${leadingColumn}`) : snake[i+1];
    updateBoard();
}

// 7 - Function to move snake one step UP
function goUpAndDISPLAY(){
    leadingRow--;
    checkStepWithMode(mode);
    moveSnakeToAndDISPLAY(leadingRow,leadingColumn);
}

// 8 - Function to move snake one step DOWN
function goDownAndDISPLAY(){
    leadingRow++;
    checkStepWithMode(mode);
    moveSnakeToAndDISPLAY(leadingRow,leadingColumn);
}

// 9 - Function to move snake one step LEFT
function goLeftAndDISPLAY(){
    leadingColumn--;
    checkStepWithMode(mode);
    moveSnakeToAndDISPLAY(leadingRow,leadingColumn);
}

// 10 - Function to move snake one step RIGHT
function goRightAndDISPLAY(){
    leadingColumn++;
    checkStepWithMode(mode);
    moveSnakeToAndDISPLAY(leadingRow,leadingColumn);
}

// 11 - Function to keep snake moving using one step functions according to current direction
function keepMovingIn(direction){
    if(!buttonPressed){
        switch(direction) {
            case "up":
                goUpAndDISPLAY();
                break;
            case "down":
                goDownAndDISPLAY();
                break;
            case "left":
                goLeftAndDISPLAY();
                break;
            case "right":
                goRightAndDISPLAY();
                break;
        }
    }
    buttonPressed = false;
}

// 12 - Function to check snake bite on hurdles
function checkForHurdles(hurdles){
    gameOn = true;
    let row = -1;
    let column = -1;
    for(let i = 0; i < hurdles.length; i++){
        row = parseInt(hurdles[i].split(':')[0]);
        column = parseInt(hurdles[i].split(':')[1]);
        if(leadingRow === row && leadingColumn === column){
            // Playig Foul Sound
            foulSound.play();
            // show Error message
            messageBox.classList.remove('hide');
            mainMessage.innerText = 'Game Over';
            errorMessage.classList.add('show');
            foul.innerText = 'Wall Hit';
            messageBox.querySelector('.home').innerText = screenPage === 'message-level' ? 'Next' : 'Home';
            gameOn = false;
        }
    }
}

// 13 - Function to check snake bite on snake body
function checkForSnakeBite(snake){
    gameOn = true;
    let row = -1;
    let column = -1;
    for(let i = 0; i < snake.length - 1; i++){// last index is for leadinngs themself
        row = parseInt(snake[i].split(':')[0]);
        column = parseInt(snake[i].split(':')[1]);
        if(leadingRow === row && leadingColumn === column){
            // Playig Foul Sound
            foulSound.play();
            // show Error message
            messageBox.classList.remove('hide');
            mainMessage.innerText = 'Game Over';
            errorMessage.classList.add('show');
            foul.innerText = 'Self Bite';
            messageBox.querySelector('.home').innerText = screenPage === 'message-level' ? 'Next' : 'Home';
            gameOn = false;
        }
    }
}

// 14 - Function to return speed value
function returnSpeed(speed){
    switch(speed){
        case 'slow':
            return 500;
            break;
        case 'normal':
            return 300;
        case 'fast':
            return 100;
    }
}

// 15 - Function to return theme
function returnTheme(theme){
    switch(theme){
        case 'green':
            return themeColors[0];
            break;
        case 'orange':
            return themeColors[1];
            break;
        case 'red':
            return themeColors[2];
            break;
    }
}

// 16 - Function to return food position on positions other than avoiding positions (snake position and hurdles etc)
function returnFoodIndex(avoidingPositions){
    let wrong = false;
    let row, column;
    do{
        wrong = false;
        row = Math.floor(Math.random() * 20);
        avoidingPositions.forEach(element => {
            if(row === parseInt(element.split(":")[0]))
                wrong = true;
        })
    } while(wrong);

    wrong = false;
    do{
        wrong = false;
        column = Math.floor(Math.random() * 20);
        avoidingPositions.forEach(element => {
            if(column === parseInt(element.split(":")[1]))
                wrong = true;
            else
                wrong = false;
        })
    } while(wrong);    
    return {
        "foodRow": row,
        "foodColumn": column
    }
}

// 17 - Function to return Hurdles according to mode
function returnHurdle(){
    switch(mode){
        case 'freestyle':
            return [];
            break;
        case 'boundry':
            return [];
            break;
        case 'hurdle':
            return hurdles;
            break;
        case 'master':
            return hurdles;
            break;
    }
}

// 18 - Function to show destination Page and hide extra Pages
function pageFlowControler(destinationPage,...extraPages){
    destinationPage.classList.remove('hide');
    extraPages.forEach(page => !page.classList.contains('hide') ? page.classList.add('hide'): '');
    // const allPages = [menuHome,levelsMenuContainer,levelContainer,customContainer,detailBox,messageBox];
}

// 19 - Function to show current game details on detailBox
function showDetails(level = -1){
    gameOn = false;
    detailBox.classList.remove('hide');
    detailHeading.innerText = level === -1 ? 'The Details' : `Level: ${level} (Details)`;
    detailMode.innerText = mode[0].toUpperCase() + mode.slice(1,);
    detailSpeed.innerText = speed === 100 ? 'Fast' : speed === 300 ? 'Normal' : 'Slow';
    detailLevelScore.innerText = levelScore;

    startLevel.addEventListener('click', e => {
        ! detailBox.classList.contains('hide') ? detailBox.classList.add('hide') : '';
        updateDetailsForLevel(level);
        gameOn = true;
    });
}

// 20 - Function start game and update on every interval
function startGame(){
    setInterval(() => {        
        if(gameOn && timeInterval % speed === 0){
            // 1 - Keep remember previous tail positions to increase snake size when eat Food
            preTailRow = parseInt(snake[0].split(':')[0]);
            preTailCol = parseInt(snake[0].split(':')[1]);
            // 2 - Only if game is On - Move Forward
            if(gameOn)
                keepMovingIn(direction);
            // 3 - Only if game is On - Check for Game Fouls By hitting hurdles
            if(gameOn)
                checkForHurdles(restrictions);
            // 4 - Only if game is On - Check for Game Fouls By self bite
            if(gameOn)
                checkForSnakeBite(snake);
            // 5 - Check if Snake got Food - its a succes
            if(leadingRow === foodRow && leadingColumn === foodColumn && gameOn) {
                // Playig Score Sound
                scoreSound.play();
                // 5.1 - On every success increment score and display
                totalScore++;
                score.innerText = totalScore;
                // 5.2 - Check if player is WON, stop the game
                if(totalScore === levelScore){
                    // Playig Winner Sound
                    winSound.play();
                    // remove Food
                    foodRow = -1, foodColumn = -1;
                    // increase snake size by 1
                    snake.push(`${leadingRow}:${leadingColumn}`);
                    for(let i = snake.length - 1; i > 0; i-- )
                        snake[i] = snake[i-1];
                    snake[0] = `${preTailRow}:${preTailCol}`;
                    // show to DOM
                    updateBoard();
                    // stop the game
                    gameOn = false;
                    // show YOU WON message
                    messageBox.classList.remove('hide');
                    mainMessage.innerText = 'You Won!';
                    messageBox.querySelector('.home').innerText = screenPage === 'message-level' ? 'Next' : 'Home';
                    errorMessage.classList.remove('show');
                    gameOn = false;
                }
                // 5.3 - If still game is continue
                if (gameOn) {
                    // update new Food position
                    const foodIndex = returnFoodIndex(snake.concat(restrictions));
                    foodRow = foodIndex.foodRow;
                    foodColumn = foodIndex.foodColumn;
                    updateBoard();
                    // increase snake size by 1
                    snake.push(`${leadingRow}:${leadingColumn}`);
                    for(let i = snake.length - 1; i > 0; i-- )
                        snake[i] = snake[i-1];
                    snake[0] = `${preTailRow}:${preTailCol}`;
                }
            }
        }
        timeInterval += 50;
    }, timeInterval);
}

// 21 - Function to show active key on screen also
function keyActivated(key) {
    key.style.transform = 'scale(0.95)';
    key.style.backgroundColor = 'rgb(192, 115, 255)';
}

// 22 - Function to run when key is released
function keyReleased(key) {
    key.style.transform = 'scale(1)';
    key.style.backgroundColor = 'rgb(168, 62, 255)';
}

// All Event Listeners
// 1 - Event listener to control snake
document.addEventListener('keydown', e => {
    if(gameOn) {
        switch(e.code) {
            case "ArrowUp":
            case "KeyW":
                if(direction !== "up" && direction !== "down"){
                    upKey.forEach(key => keyActivated(key));
                    buttonPressed = true;
                    direction = "up";
                    goUpAndDISPLAY();
                }
                break;
            case "ArrowDown":
            case "KeyS":
                if(direction !== "down" && direction !== "up"){
                    downKey.forEach(key => keyActivated(key));
                    buttonPressed = true;
                    direction = "down";
                    goDownAndDISPLAY();
                }
                break;
            case "ArrowLeft":
            case "KeyA":
                if(direction !== "left" && direction !== "right"){
                    leftKey.forEach(key => keyActivated(key));
                    buttonPressed = true;
                    direction = "left";
                    goLeftAndDISPLAY();
                }
                break;
            case "ArrowRight":
            case "KeyD":
                if(direction !== "right" && direction !== "left"){
                    rightKey.forEach(key => keyActivated(key));
                    buttonPressed = true;
                    direction = "right";
                    goRightAndDISPLAY();
                }
                break;
        }
    }
})

// 2 - Event listener to make key view default on key release (keyup)
document.addEventListener('keyup', e => {
    if(gameOn) {
        switch(e.code) {
            case "ArrowUp":
            case "KeyW":
                upKey.forEach(key => keyReleased(key));
                break;
            case "ArrowDown":
            case "KeyS":
                downKey.forEach(key => keyReleased(key));
                break;
            case "ArrowLeft":
            case "KeyA":
                leftKey.forEach(key => keyReleased(key));
                break;
            case "ArrowRight":
            case "KeyD":
                rightKey.forEach(key => keyReleased(key));
                break;
        }
    }
})

// 3 - Event listener at Menu to go to Levels Menu
levelButton.addEventListener('click', e => {
    screenPage = '';
    pageFlowControler(levelsMenuContainer,menuHome);
})

// 4 - Event listener to goto Level Game
levelsMenuContainer.addEventListener('click', e => {
    if(e.target.className === 'level-box'){
        screenPage = 'message-level';

        gameOn = true;
        const id = e.target.id;

        pageFlowControler(levelContainer,levelsMenuContainer);

        levelHeading.innerText = id;
        board = levelContainer.querySelector('.board-container');
        score = levelContainer.querySelector('.score');
        score.scrollIntoView();

        createDefaultSnake();
        createHurdle();
        updateDetailsForLevel(parseInt(id));
        checkStepWithMode(mode);
        let food = returnFoodIndex(snake.concat(restrictions));
        foodRow = food.foodRow;
        foodColumn = food.foodColumn;
        updateBoard();

        showDetails(parseInt(id));
    }
})

// 5 - Event listener to go main Menu on clicking Home
Array.from(document.querySelectorAll('.home')).forEach(button => button.addEventListener('click', e => {
    e.preventDefault();
    if(screenPage === 'message-level'){
        pageFlowControler(levelsMenuContainer,levelContainer,messageBox,detailBox);
        screenPage = '';
    } else {
        pageFlowControler(menuHome,messageBox,detailBox,customContainer,customSettingsContainer,levelsMenuContainer,levelContainer);
    }
    gameOn = false;
}))

// 6 - Event listener at Menu to go to Custom Game Settings
customButton.addEventListener('click', e => {
    screenPage = '';
    pageFlowControler(customSettingsContainer,menuHome);
})

// 7 - Event listener to go to custom Game Container
readyButton.addEventListener('click', e => {
    e.preventDefault();
    pageFlowControler(customContainer,customSettingsContainer);

    board = customContainer.querySelector('.board-container');
    score = customContainer.querySelector('.score');
    score.scrollIntoView();

    playPauseButton.innerText = 'Pause';
    playPauseButton.className = 'btn playing'

    createDefaultSnake();
    createHurdle();
    updateDetailsForLevel();
    checkStepWithMode(mode);
    let food = returnFoodIndex(snake.concat(restrictions));
    foodRow = food.foodRow;
    foodColumn = food.foodColumn;
    updateBoard();

    showDetails(-1);
})

// 8 - Event listener to play pause game in custom
playPauseButton.addEventListener('click', e => {
    e.target.classList.toggle('playing');
    e.target.innerText = e.target.classList.contains('playing') ? 'Pause' : 'Resume';
    gameOn = gameOn === true ? false : true;
    e.target.style.backgroundColor = e.target.classList.contains('playing') ? 'rgb(0, 255, 191)' : 'rgb(255, 244, 93)';
})

// 9 - Event listener to move to settings
settingsButton.addEventListener('click', e => {
    pageFlowControler(customSettingsContainer,customContainer,messageBox,detailBox);
    gameOn = false;
})

// 10 - Event listener for Screen Navgation Buttons
document.addEventListener('click', e => {
    if(gameOn){
        Array.from(document.querySelectorAll('.key')).forEach(key => {
            if(e.path.includes(key)){
                switch(key.getAttribute('data-direction')) {
                    case "up":
                        if(direction !== "up" && direction !== "down"){
                            buttonPressed = true;
                            direction = "up";
                            goUpAndDISPLAY();
                        }
                        break;
                    case "down":
                        if(direction !== "down" && direction !== "up"){
                            buttonPressed = true;
                            direction = "down";
                            goDownAndDISPLAY();
                        }
                        break;
                    case "left":
                        if(direction !== "left" && direction !== "right"){
                            buttonPressed = true;
                            direction = "left";
                            goLeftAndDISPLAY();
                        }
                        break;
                    case "right":
                        if(direction !== "right" && direction !== "left"){
                            buttonPressed = true;
                            direction = "right";
                            goRightAndDISPLAY();
                        }
                        break;
                }
            }
        })
    }
})

// Calling function to update board DOM before game start
updateDetailsForLevel();
// Calling startGame function to start game iteration(Game will start on clicking start button)
startGame();