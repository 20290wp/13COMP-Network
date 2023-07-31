/*****************************************************/
//  Written by Wina, Term 2 2022
//  Program to Tic Tac Toe game
//  ttt_game.js
//    all functions from this module starts with ttt_
//  v1 base code
//  v2 drawing the board
//  v3 draws in the X or O
//  v4 checks the winner in the board
//  v5 mousePressed on ttt_canvas
//  v6 resets
//  v7 tailored to fit the switching pages in 2023
/*****************************************************/

/*************************************************************/
// VARIABLES, CONSTANTS, ARRAYS, ETC.
/*************************************************************/

let board = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
];

let players = ['X', 'O'];

var gameRun = false;
var gameBoolean = false;

let x = players[0];
let o = players[1];
let currentPlayer = x;
let available = [];

const TTTBTN = document.getElementById("tttBtn");

const WIN = document.getElementById("tttWin");
const PLAYER = document.getElementById("tttPlayer");
const P1WIN = document.getElementById("tttPlayer1Wins");
const P2WIN = document.getElementById("tttPlayer2Wins");
const TIE = document.getElementById("tttTie");

/*****************************************************/
// ttt_setup()
// called by setup in interface.js
/*****************************************************/
function ttt_setup() {
  console.log("tttSetup");
  
  var tttElmnt = document.getElementById("tttCanvas");
  ttt_canvas = createCanvas(tttElmnt.offsetWidth, 
                        tttElmnt.offsetHeight); 
  ttt_canvas.parent("tttCanvas");

  console.log("Height/Width : " + tttElmnt.offsetHeight +
              "/" + tttElmnt.offsetWidth + " xpos/ypos : " +
              tttElmnt.offsetLeft+ "/" + tttElmnt.offsetTop);

  //create an observer to change the size of the ttt_canvas
  const observer = new ResizeObserver(() => {
      resizeCanvas(tttElmnt.offsetWidth, tttElmnt.offsetHeight); 
  });

  //observe size changes to the element
  observer.observe(tttElmnt); 

  tttElmnt.style.padding = 0;
  // createCanvas(0, 0);
}

/*****************************************************/
// ttt_draw()
// called by draw in interface.js
/*****************************************************/
function ttt_draw() {
  background(220);
  
  P1WIN.textContent = "Player 1 Wins : " + gameScores.tttPlayer1Win;
  P2WIN.textContent = "Player 2 Wins : " + gameScores.tttPlayer2Win;
  TIE.textContent = "Number of Ties : " + gameScores.tttTie;
  
  if(gameBoolean == true){
    checkSpots();
	  drawBoard();
    winner();
  }
}

/*************************************************************/
//ttt_gameStart()
//called by TTTBTN
//starts the timer, game and hit&miss counts when pressed
//stops the TIMER and restarts it when pressed
//also restarts the game, and hit&miss counts when stop is pressed
/*************************************************************/
function ttt_gameStart() {
  //reset the HTMLs
  PLAYER.textContent = "Current Player : ";
  WIN.textContent = "Winner : ";
  
	if (gameRun == false) {
    //loops TTTBTN's function
		gameRun = true;
    //continues the loop after the prev game
    loop();
    result = null;
    currentPlayer = x;
		console.log("tttStart");
		if (buttonText == "start") {
      //changes TTTBTN's style
      TTTBTN.innerText = "STOP";
      TTTBTN.style.backgroundColor = "red";
      TTTBTN.style.color = "white";

      buttonText = "stop";

      //starts the ttt functions
      gameBoolean = true;

      //makes sure the board and player are empty
      board = [
      ['', '', ''],
      ['', '', ''],
      ['', '', '']];

      available = [];
  
      //check if the ball is hit
      ttt_canvas.mousePressed(ttt_mouse);
		}
	} else {
    //loops TTTBTN's functions
		gameRun = false;
    console.log("tttStop");
		if (buttonText == "stop") {
      //resets all the buttons
      TTTBTN.innerText = "START";
      TTTBTN.style.backgroundColor = "green";
      TTTBTN.style.color = "white";
			buttonText = "start";

      //reset the HTMLs
      PLAYER.textContent = "Current Player : ";
      WIN.textContent = "Winner : ";

      gameBoolean = false;

      //resets the board and player
      board = [
      ['', '', ''],
      ['', '', ''],
      ['', '', '']];

      available = [];
      currentPlayer = null;
		}
	}
}


/*****************************************************/
// drawBoard()
// called by ttt_draw()
// creates the game board
/*****************************************************/
function drawBoard(){  
  let w = ttt_canvas.width / 3;
  let h = ttt_canvas.height / 3;
  strokeWeight(4);

  for(let i = 0; i <3; i++){
    line(w, 0, w, height);
    line(w * 2, 0, w * 2, height);
    line(0, h, width, h);
    line(0, h * 2, width, h * 2);
  }
  
}

/*****************************************************/
// checkSpots()
// called by ttt_draw()
// checks the spots
// if spots are pressed, draw in the X or O
/*****************************************************/
function checkSpots(){
  let w = ttt_canvas.width / 3;
  let h = ttt_canvas.height / 3;
  
  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < 3; i++) {
      let x = w * i + w / 2;
      let y = h * j + h / 2;
      let spot = board[i][j];
      textSize(32);
      let r = w / 4;
      if (spot == players[1]) {
        noFill();
        ellipse(x, y, r * 2);
      } else if (spot == players[0]) {
        line(x - r, y - r, x + r, y + r);
        line(x + r, y - r, x - r, y + r);
      }
    }
  }
}

/*****************************************************/
// equals3()
// called by checkWinner()
// makes sure the spots are equal and aren't blank
/*****************************************************/
function equals3(a, b, c) {
  return a == b && b == c && a != '';
}

/*****************************************************/
// checkWinner()
// called by ttt_draw()
// checks the spots to see if there is any winner
// returns the winner if there is one
/*****************************************************/
function checkWinner() {
  let winner = null;

  // horizontal
  for (let i = 0; i < 3; i++) {
    if (equals3(board[i][0], board[i][1], board[i][2])) {
      winner = board[i][0];
    }
  }

  // Vertical
  for (let i = 0; i < 3; i++) {
    if (equals3(board[0][i], board[1][i], board[2][i])) {
      winner = board[0][i];
    }
  }

  // Diagonal
  if (equals3(board[0][0], board[1][1], board[2][2])) {
    winner = board[0][0];
  }
  if (equals3(board[2][0], board[1][1], board[0][2])) {
    winner = board[2][0];
  }

  //check open spots
  let openSpots = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] == '') {
        openSpots++;
      }
    }
  }

  //returns the winner
  if (winner == null && openSpots == 0) {
    return 'tie';
  } else {
    return winner;
  }
}

/*****************************************************/
// ttt_mouse()
// called by event
// draws in the X or O
// nullifies it if it's not valid
/*****************************************************/
function ttt_mouse() {
  let w = ttt_canvas.width / 3;
  let h = ttt_canvas.height / 3;
  
  if (currentPlayer == o) {
    // player 2 make turn
    let i = floor(mouseX / w);
    let j = floor(mouseY / h);
    // If valid turn
    if (board[i][j] == '') {
      board[i][j] = o;
      currentPlayer = x;
      PLAYER.textContent = "Current Player : X";
    }
  }
  else if(currentPlayer == x) {
    // player 1 make turn
    let i = floor(mouseX / w);
    let j = floor(mouseY / h);
    // If valid turn
    if (board[i][j] == '') {
      board[i][j] = x;
      currentPlayer = o;
      PLAYER.textContent = "Current Player : O";
    }
  }
}

/*****************************************************/
// winner()
// called by ttt_draw()
// determines the winner
// returns the winner
// resets the game
/*****************************************************/
function winner(){
  let result = checkWinner();
  if (result != null) {
    noLoop();
    gameRun = false;
    let bbScore = gameScores.bbScore;
    if (result == 'tie') {
      WIN.textContent = 'Winner : Tie!';
      
      let tttPlayer1Win = gameScores.tttPlayer1Win;
      let tttPlayer2Win = gameScores.tttPlayer2Win;
      if (gameScores.tttTie == 'n/a'){
        let tttTie = 1;
        int_writeRec(bbScore, tttPlayer1Win, tttPlayer2Win, tttTie);
      }
      else{
        let tttTie = (gameScores.tttTie-0) + 1;
        int_writeRec(bbScore, tttPlayer1Win, tttPlayer2Win, tttTie);
      }

      //resets the game
      currentPlayer = null;
      
      gameRun = false;
      gameBoolean = false;

      result = null;
      
      TTTBTN.innerText = "START";
      TTTBTN.style.backgroundColor = "green";
      TTTBTN.style.color = "white";
	    buttonText = "start";
      
    } else {
      WIN.textContent = `Winner : ${result}!`;
      let tttTie = gameScores.tttTie;
      if (result == players[0]){
        let tttPlayer2Win = gameScores.tttPlayer2Win;
        if (gameScores.tttPlayer1Win == 'n/a'){
          let tttPlayer1Win = 1;
          int_writeRec(bbScore, tttPlayer1Win, tttPlayer2Win, tttTie);
        }
        else{
          let tttPlayer1Win = (gameScores.tttPlayer1Win-0) + 1;
          int_writeRec(bbScore, tttPlayer1Win, tttPlayer2Win, tttTie);
        }
      }
      else if (result == players[1]){
        let tttPlayer1Win = gameScores.tttPlayer1Win;
        if (gameScores.tttPlayer2Win == 'n/a'){
          let tttPlayer2Win = 1;
          int_writeRec(bbScore, tttPlayer1Win, tttPlayer2Win, tttTie);
        }
        else {
          let tttPlayer2Win = (gameScores.tttPlayer1Win-0) + 1;
          int_writeRec(bbScore, tttPlayer1Win, tttPlayer2Win, tttTie);
          
        }
      }
      

      //resets the game
      currentPlayer = null;

      gameRun = false;
      gameBoolean = false;

      result = null;
      TTTBTN.innerText = "START";
      TTTBTN.style.backgroundColor = "green";
      TTTBTN.style.color = "white";
	    buttonText = "start";

      
    }
  }
}

/*****************************************************/
// ttt_reset()
// called by back button
// resets the board and game
/*****************************************************/
function ttt_reset(){
  console.log("tttReset");

  //resets the game
  gameRun = false;
  gameBoolean = false;

  result = null;

  //continues the loop
  loop();

  //resets all the buttons
  TTTBTN.innerText = "START";
  TTTBTN.style.backgroundColor = "green";
  TTTBTN.style.color = "white";
	buttonText = "start";

  //resets the board and player
  board = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']];

  available = [];
  currentPlayer = null;
}


/*****************************************************/
// ttt_back()
// called by back button
// resets the board and game
/*****************************************************/
function ttt_back(){
  console.log("ttt_back");

  //resets the game
  gameRun = false;
  gameBoolean = false;

  result = null;

  //continues the loop
  loop();

  //resets all the buttons
  TTTBTN.innerText = "START";
  TTTBTN.style.backgroundColor = "green";
  TTTBTN.style.color = "white";
	buttonText = "start";

  //resets the board and player
  board = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']];

  available = [];
  currentPlayer = null;

  tttClick = false;
  sessionStorage.setItem("tttClick", tttClick);
}

/*****************************************************/
//    END OF CODE
/*****************************************************/