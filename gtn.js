/*****************************************************/
//  Written by Wina, Term 2 2023
//  gtn.js
//    game page
//    fit the page to each player
//    number and guesses
//    win/loss and move user back to lobby
//    all functions from this module starts with gtn_
//  v1 base code
//  v2 functions to setup the page
//  v3 determine which player is the user
//  v4 tweak codes to fit each player
//  v5 save user's number
//  v6 save user's guesses
//  v7 compare user's guesses and other player's number
//  v8 implement the win/loss
//  v9 write to database and move user
//  v10 move user back to lobby
/*****************************************************/

/*************************************************************/
// var and CONST to find out which game needs to be run
/*************************************************************/

const P1 = document.getElementById("gtn_p1");
const P2 = document.getElementById("gtn_p2");

const PP1 = document.getElementById("gtn_ppImg1");
const PP2 = document.getElementById("gtn_ppImg2");

const FORM1 = document.getElementById("gtn_form1");
const FORM2 = document.getElementById("gtn_form2");

const SUB1 = document.getElementById("gtn_submit1");
const SUB2 = document.getElementById("gtn_submit2");

const LABEL1 = document.getElementById("gtn_label1");
const LABEL2 = document.getElementById("gtn_label2");

const INPUT1 = document.getElementById("gtn_quantity1");
const INPUT2 = document.getElementById("gtn_quantity2");

const GUESS1 = document.getElementById("gtn_guess_quantity1");
const GUESS2 = document.getElementById("gtn_guess_quantity2"); 

const GLABEL1 = document.getElementById("gtn_guess_label1");
const GLABEL2 = document.getElementById("gtn_guess_label2");

const GFORM1 = document.getElementById("gtn_guess_form1");
const GFORM2 = document.getElementById("gtn_guess_form2");

const GSUB1 = document.getElementById("gtn_guess_submit1");
const GSUB2 = document.getElementById("gtn_guess_submit2");

const RESULT = document.getElementById("gtn_result");
const T1 = document.getElementById('timer1');
const T2 = document.getElementById('timer2');

var input;
var sub;
var me;
var uid;
var guess;
var form;
var gsub;
var otherGuess;
var gform;
var myInput;
var myNumber;
var guessing;
var timeLeft;
var timerId;

/*************************************************************/
//gtn_page_setPage()
//called by button from gtn_page
//change html when read is done
/*************************************************************/
function gtn_page_setPage (){
  P1.textContent = "Hi, " + activeGame.p1gameName;
  P2.textContent = "Hi, " + activeGame.p2gameName;

  LABEL1.textContent = "Quantity (between 1 and " + activeGame.range + ") :";
  LABEL2.textContent = "Quantity (between 1 and " + activeGame.range + ") :";
  GLABEL1.textContent = "Quantity (between 1 and " + activeGame.range + ") :";
  GLABEL2.textContent = "Quantity (between 1 and " + activeGame.range + ") :";

  INPUT1.setAttribute("max", activeGame.range);
  INPUT2.setAttribute("max", activeGame.range);
  GUESS1.setAttribute("max", activeGame.range);
  GUESS2.setAttribute("max", activeGame.range);

  if(userDetails.uid == uid){
    FORM1.style.display = "none";
    GFORM1.style.display = "none";
    input = INPUT2;
    sub = SUB2;
    guess = GUESS2;
    gsub = GSUB2;
    form = "gtn_form2"; 
    gform = "gtn_guess_form2";
    guess.disabled = true;
    gsub.disabled = true;
    fb_readOn(ACTIVE, uid, activeGame, gtn_game_procFunct, "p1guess");
  }
  else{
    FORM2.style.display = "none";
    GFORM2.style.display = "none";
    input = INPUT1;
    sub = SUB1;
    guess = GUESS1;
    gsub = GSUB1;
    form = "gtn_form1";
    gform = "gtn_guess_form1";
    guess.disabled = true;
    gsub.disabled = true;
    fb_readOn(ACTIVE, uid, activeGame, gtn_game_procFunct, "p2guess");
  }

  //time the users input
  //only get 5 mins
  //so if they disconnect, the other user only need to wait 5 mins
  timeLeft = 300;
  timerId = setInterval(countdown, 1000);
}

/*************************************************************/
//gtn_join_procFunct(_procData, _data, _error)
//called by fb_readOn
//to process readOn value for join
/*************************************************************/
function gtn_game_procFunct(_pData, _data, _error){
  if (_pData == null) {
    readStatus = "no record";
    lg_console("fb_procReadOn callback null", "red");
  }
  else if (_pData == "error") {
    readStatus = "failure";
    console.log(_error);
    lg_console("fb_procReadOn callback error", "red");
  }
  else {
    readStatus = "OK";
    lg_console("fb_procReadOn callback ok", "green");
    //if statement is for the turns
    if (_pData == 'n' || _pData == 'y'){
      console.log(otherGuess);
      otherGuess = _pData;
      if(otherGuess == 'y' && myInput == 'y'){
        guess.disabled = false;
        gsub.disabled = false;
        timeLeft = 30;
        timerId = setInterval(countdown, 1000);
      }
      
    }
    else if (_pData == myNumber){
      gtn_lose();
    }
    else if(_pData == "w"){
      // disable guessing input
      guess.disabled = true;
      gsub.disabled = true;
      clearTimeout(timerId);
      //since winner get the news after loser writes
      let gtnLose = gameScores.gtnLose;
      let gtnWin = (gameScores.gtnWin-0) + 1;
      int_gtnWrite(gtnWin, gtnLose);
      console.log(gameScores);
      //winner will be the one to delete activeGame record
      gtn_dbDelRec(uid, ACTIVE);
      //tell user they win
      result.style.display = "block";
      RESULT.textContent = "You Win";
      //moves user to lobby
    }
    else if(otherGuess !== _pData){
      console.log(otherGuess);
      guess.disabled = false;
      gsub.disabled = false;
      otherGuess = _pData;

      guessing = false;
      clearTimeout(timerId);
      //Timer
      timeLeft = 30;
      timerId = setInterval(countdown, 1000);
      
    }
     
    
  }
}

/*************************************************************/
//gtn_dbDelRec(_key, _path)
//to delete record
//called by the winner of the game
/*************************************************************/
function gtn_dbDelRec(_key, _path){
  console.log("/" + _path + "/" + _key);
  let record = firebase.database().ref("/" + _path + "/" + _key);
  record.remove();
}

/*************************************************************/
//gtn_countdown()
//timer for the game
//if they've guessed, timer is reset
// if timer is 0, they lose
/*************************************************************/
function countdown() {
  if (timeLeft == 0) {
    clearTimeout(timerId);
     gtn_lose();
  } else if(guessing == true){
    clearTimeout(timerId);
  } else {
    T1.innerHTML = timeLeft + ' seconds remaining';
    T2.innerHTML = timeLeft + ' seconds remaining';
    timeLeft--;
  }
}

/**************************************************************/
// gtn_lose()
// Input event; called by function
// write to firebase 
// update own score
//  tell user they've lost
// Input: 
// Return: move user to lobby page
/**************************************************************/
function gtn_lose(){
  console.log("they win");
  clearTimeout(timerId);
  if(userDetails.uid == uid){
    activeGame.p2guess = "w";
    guess.disabled = true;
    gsub.disabled = true;
    if (activeGame.p2lose == 'n/a'){
      activeGame.p2lose = 1;
    }
    else{
     activeGame.p2lose = activeGame.p2lose + 1;
    }
    if (activeGame.p1win == 'n/a'){
      activeGame.p1win = 1;
    }
    else{
     activeGame.p1win = activeGame.p1win + 1;
    }
    console.log(activeGame);
    fb_writeRec(ACTIVE, uid, activeGame);
    let gtnWin = gameScores.gtnWin;
    //moves activeGame record to gameScores since activeGame'll be deleted
    let gtnLose = (gameScores.gtnLose-0) + 1;
    int_gtnWrite(gtnWin, gtnLose);
    console.log(gameScores);
    // tell user they lose
    result.style.display = "block";
    RESULT.textContent = "You Lose";
    // moves user to lobby
  }
  else{
    activeGame.p1guess = "w";
    guess.disabled = true;
    gsub.disabled = true;
    if (activeGame.p1lose == 'n/a'){
      activeGame.p1lose = 1;
    }
    else{
     activeGame.p1lose = activeGame.p1lose + 1;
    }
    if (activeGame.p2win == 'n/a'){
      activeGame.p2win = 1;
    }
    else{
     activeGame.p2win = activeGame.p2win + 1;
    }
    console.log(activeGame);
    fb_writeRec(ACTIVE, uid, activeGame);
    let gtnWin = gameScores.gtnWin;
    //moves activeGame record to gameScores since activeGame'll be deleted
    let gtnLose = (gameScores.gtnLose-0) + 1;
    int_gtnWrite(gtnWin, gtnLose);
    console.log(gameScores);
    // tell user they lose
    result.style.display = "block";
    RESULT.textContent = "You Lose";
    // moves user to lobby
  }
}

/**************************************************************/
// gtn_number()
// Input event; called by form in html
// stop form submission
// get data for the game
// write to firebase 
// to let other player know that a number is picked
// Input:   number from html form
// Return: disable form
/**************************************************************/
function gtn_number(){
  //get data from the input 
  //disable input and keep the data
  myNumber = gtn_getFormItemValue(form, 0);

  if (document.getElementById(form).checkValidity()) {
    console.log(myNumber);

    input.disabled = true;
    sub.disabled = true;

    //clear timer since user has input and they aren't offline
    clearTimeout(timerId);

    if (otherGuess == "y"){
      activeGame.p1guess = 'y';
      activeGame.p2guess = 'y';
      console.log(activeGame);
      guess.disabled = false;
      gsub.disabled = false;
      timeLeft = 30;
      timerId = setInterval(countdown, 1000);
      fb_writeRec(ACTIVE, uid, activeGame);
    }
    else if(otherGuess == "n"){
      if(userDetails.uid == uid){
        activeGame.p2guess = 'y';
        console.log(activeGame);
        myInput = 'y';
        fb_writeRec(ACTIVE, uid, activeGame);
      }
      else{
        activeGame.p1guess = 'y';
        console.log(activeGame);
        myInput = 'y';
        fb_writeRec(ACTIVE, uid, activeGame);
      }
    } 
    
  }
  
}

/**************************************************************/
// gtn_getFormItemValue(_elementId, _item)
// Called by reg_regDetailsEntered
// Returns the value of the form's item
// Input:  element id & form item number
// Return: form item's value
/**************************************************************/
function gtn_getFormItemValue(_elementId, _item) {
  return document.getElementById(_elementId).elements.item(_item).value;
}

/**************************************************************/
// gtn_number()
// Input event; called by form in html
// stop form submission
// get data for the game
// write to firebase 
// to let other player know that a number is picked
// Input:   number from html form
// Return: disable form
/**************************************************************/
function gtn_guess_number(){
  //get data from the input 
  let myGuess = gtn_getFormItemValue(gform, 0);
  console.log(myGuess);
  guessing = true;

  if (document.getElementById(gform).checkValidity()) {

    //disable guess form since user has guessed
    guess.disabled = true;
    gsub.disabled = true;
    
    //write guess to firebase
    if(userDetails.uid == uid){
      activeGame.p1guess = otherGuess;
      activeGame.p2guess = myGuess;
      console.log(activeGame);
      fb_writeRec(ACTIVE, uid, activeGame);
    }
    else{
      activeGame.p2guess = otherGuess;
      activeGame.p1guess = myGuess;
      console.log(activeGame);
      fb_writeRec(ACTIVE, uid, activeGame);
    }
    
    
  }

}

/**************************************************************/
//  END OE APP
/**************************************************************/