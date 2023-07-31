/*****************************************************/
//  Written by Wina, Term 2 2022
//  interface.js
//    changing page code to program
//    modal codes too
//    firebase functions
//    Google login
//    all functions from this module starts with int_
//    except setup, draw and modal codes
//  v1 base code
//  v2 enter buttons to change pages
//  v3 modal codes
//  v4 back buttons
//  v5 fb_functions
//  v6 leaderboard
//  v7 tailored to fit the switching pages in 2023
//  v8 add in the gtn game in 2023
/*****************************************************/

/*************************************************************/
// INITIALIZING
/*************************************************************/

/*************************************************************/
// Var to find out which game needs to be run
/*************************************************************/
var bbClick = false;
var tttClick = false;

const LEAD1 = document.getElementById("lead1");
const LEAD2 = document.getElementById("lead2");
const LEAD3 = document.getElementById("lead3");
const LEAD4 = document.getElementById("lead4");
const LEAD5 = document.getElementById("lead5");
const LEAD6 = document.getElementById("lead6");
const LEAD7 = document.getElementById("lead7");
const LEAD8 = document.getElementById("lead8");
const LEAD9 = document.getElementById("lead9");
const LEAD10 = document.getElementById("lead10");

/*************************************************************/
// Database variables
/*************************************************************/
const DETAILS = "userDetails";      //<=============== INSERT YOUR FIREBASE PATH NAME HERE
const LOBBY = "gameLobby";
const ACTIVE = "activeGame";
const SCORES = "gameScores";
const AUTH = "userAuth";

var loginStatus = ' ';
var readStatus  = ' ';
var writeStatus = ' ';

var gameLobby = {
  p1gameName : 'n/a',
  join : 'n',
  range : 'n/a',
  wins : 'n/a',
  losses : 'n/a'
};

var activeGame = {
  p1gameName : 'n/a',
  p1uid : 'n/a',
  p1guess : 'n',
  p1win : 'n/a',
  p1lose : 'n/a',
  range : 'n/a',
  p2gameName : 'n/a',
  p2uid : 'n/a',
  p2guess : 'n',
  p2win : 'n/a',
  p2lose : 'n/a'
};

var gameScores = {
  bbScore  : 'n/a',
  tttPlayer1Win : 'n/a',
  tttPlayer2Win : 'n/a',
  tttTie : 'n/a',
  gameName : 'n/a',
  gtnWin : 'n/a',
  gtnLose : 'n/a',
  
};

var userAuth = {
  role : 'n/a',
};

var userDetails = {
  uid:      'n/a',
  email:    'n/a',
  name:     'n/a',
  photoURL: 'n/a',
  phone : 'n/a',
  gender : 'n/a',
  age : 'n/a',
  streetNum : 'n/a',
  street : 'n/a',
  suburb : 'n/a',
  city : 'n/a',
  post : 'n/a',
};

var dbArray = [];

/*****************************************************/
// setup()
// called ONCE by P5.js at the start
// calls the game setup funtions
/*****************************************************/
function setup() {
  console.log("setup");
  fb_initialise(); 

  // changes the string from the sessionStorage
  // (SS only stores strings) to booleans
  bbClick = JSON.parse(sessionStorage.getItem("bbClick"));  
  tttClick = JSON.parse(sessionStorage.getItem("tttClick"));
  
  createCanvas(0, 0);
  if (bbClick){
    bb_setup();
  }
  else if (tttClick){
    ttt_setup();
  }
}

/*****************************************************/
// draw()
// called 60 times per second by P5.js
// calls the game draw functions
/*****************************************************/
function draw() {
  background(220);
  
  if (bbClick){
    bb_draw();
  }
  else if (tttClick){    
    ttt_draw();
  }
}

/*************************************************************/
// FB FUNCTIONS
/*************************************************************/

/*****************************************************/
// int_login()
// Input event; called when user clicks START button
// Logs user into firebase using Google login
// Input: 
// Return: 
/*****************************************************/
function int_login() {
  fb_login(userDetails);
}

/*****************************************************/
// int_readAll()
// Input event; called when user clicks READ ALL button
// Read all firebase records
// Input:
// Return:
/*****************************************************/
function int_readAll(_path) {
  // CALL YOUR READ ALL FUNCTION        <=================
  fb_readAll(_path, dbArray, fb_procRec);
}

/*****************************************************/
// int_readRec()
// Input event; called when user clicks READ A RECORD button
// Read a specific firebase record
// Input:
// Return:
/*****************************************************/
function int_readRec() {
  // CALL YOUR READ A RECORD FUNCTION    <=================
  fb_readRec(SCORES, userDetails.uid, gameScores, fb_procUserDetails);
}

/*****************************************************/
// int_writeRec(_update)
// Input event; called when user clicks WRITE A RECORD button
// Write a record to firebase
// Input:
// Return:
/*****************************************************/
function int_writeRec(_bbUpdate, _tttP1Update, _tttP2Update, _tttTUpdate) {
  if (userDetails.uid != '') {
    gameScores.bbScore = _bbUpdate;
    gameScores.tttPlayer1Win = _tttP1Update;
    gameScores.tttPlayer2Win = _tttP2Update;
    gameScores.tttTie = _tttTUpdate;
    
    // CALL YOUR WRITE A RECORD FUNCTION    <=================
    fb_writeRec(SCORES, userDetails.uid, gameScores);
  }
  else {
    dbScore     = '';
    writeStatus = '';
    loginStatus = 'not logged in';
  }
}

function int_gtnWrite(_gtnWinUpdate, _gtnLoseUpdate){
  if (userDetails.uid != '') {
    gameScores.gtnWin = _gtnWinUpdate;
    gameScores.gtnLose = _gtnLoseUpdate;
    
    // CALL YOUR WRITE A RECORD FUNCTION    <=================
    fb_writeRec(SCORES, userDetails.uid, gameScores);
  }
  else {
    dbScore     = '';
    writeStatus = '';
    loginStatus = 'not logged in';
  }
}

/*************************************************************/
// ENTER BUTTONS TO CHANGE PAGES
/*************************************************************/

/*************************************************************/
//int_pressEnter()
//called by enter button from html
//function to switch the pages from start to landing page
//logs in user
/*************************************************************/
function int_pressEnter(){
  int_login();

  setTimeout(function(){
    if(readStatus == 'MOVE'){
      int_landEnter();
    }  
  }, 1000);

  
}

/*************************************************************/
//int_landEnter()
//called by enter button from html
//function to switch the pages to landing page
/*************************************************************/
function int_landEnter(){
  console.log('landEnter');
  window.location="landing_page.html";
}

/*************************************************************/
//int_bbEnter()
//called by enter button from html
//function to switch the pages from landing to bbGame page
/*************************************************************/
function int_bbEnter(){
  console.log('bbEnter');
  int_readRec();

  bbClick = true;
  console.log(gameScores);
  
  sessionStorage.setItem("bbClick", bbClick);  
  console.log(bbClick);

  window.location="bb_page.html";
}

/*************************************************************/
//int_tttEnter()
//called by enter button from html
//function to switch the pages from landing to tttGame page
/*************************************************************/
function int_tttEnter(){
  console.log('tttEnter');
  int_readRec();

  tttClick = true;
  console.log(gameScores);

  sessionStorage.setItem("tttClick", tttClick);
  console.log(tttClick);

  window.location="ttt_page.html";
}

/*************************************************************/
//int_cEnter()
//called by enter button from html
//function to switch the pages from landing to cGame page
/*************************************************************/
function int_cEnter(){
  console.log('cEnter');
  window.location="c_page.html";
}

/*************************************************************/
//int_gtnEnter()
//called by enter button from html
//function to switch the pages from landing to gtnLobby page
/*************************************************************/
function int_gtnEnter(){
  console.log('gtnEnter');
  window.location="gtn_lobby_page.html";
}

/*************************************************************/
//int_gameEnter()
//called by enter button from html
//function to switch the pages from gtnLobby to gtnGame page
/*************************************************************/
function int_gameEnter(){
  console.log('gameEnter');
  window.location="gtn_page.html"
}

/*************************************************************/
//int_adVisibility()
//called by login
//function to show/hide admin button
//determined by the userAuth record
/*************************************************************/
function int_adVisibility(_role){
  const ABTN = document.getElementById("ad_button");
  if (_role === 'user'){
    ABTN.style.display = "none";
  }
  else if (_role === 'admin'){
    ABTN.style.display = "block";
  }
}

/*************************************************************/
//int_adminEnter()
//called by enter button from html
//function to switch the pages from landing to admin page
/*************************************************************/
function int_adminEnter(){
  console.log('adminEnter');
  window.location="ad_page.html";
}

/*************************************************************/
//int_leadEnter()
//called by enter button from html
//function to switch the pages from landing to leaderboard page
/*************************************************************/
function int_leadEnter(){
  console.log('leadEnter');
  
  window.location="lead_page.html";
}

/*************************************************************/
//int_regEnter()
//called by procRec from readRec
//function to switch the pages from other page to reg page
/*************************************************************/
function int_regEnter(){
  console.log('regEnter');
  window.location="reg_page.html";
}


/*************************************************************/
//int_getData()
//called by onLoad
//get data from session storage
/*************************************************************/
function int_getData(_page){
  
  userAuth.role = sessionStorage.getItem("auth");
  
  userDetails.uid = sessionStorage.getItem("uid");
  userDetails.email = sessionStorage.getItem("email");
  userDetails.name = sessionStorage.getItem("name");
  userDetails.photoURL = sessionStorage.getItem("photoURL");
  userDetails.age = sessionStorage.getItem("age");
  userDetails.phone = sessionStorage.getItem("phone");
  userDetails.gender = sessionStorage.getItem("gender");
  userDetails.streetNum = sessionStorage.getItem("streetNum");
  userDetails.street = sessionStorage.getItem("street");
  userDetails.suburb = sessionStorage.getItem("suburb");
  userDetails.city = sessionStorage.getItem("city");
  userDetails.post = sessionStorage.getItem("post");

  gameScores.bbScore = sessionStorage.getItem("bbScore");
  gameScores.tttPlayer1Win = sessionStorage.getItem("tttPlayer1Win");
  gameScores.tttPlayer2Win = sessionStorage.getItem("tttPlayer2Win");
  gameScores.tttTie = sessionStorage.getItem("tttTie");
  gameScores.gameName = sessionStorage.getItem("gameName");
  gameScores.gtnLose = sessionStorage.getItem("gtnLose");
  gameScores.gtnWin = sessionStorage.getItem("gtnWin");
  
  if(_page == "landing_page"){
    int_adVisibility(userAuth.role);
  }
  else if(_page == "reg_page"){
    reg_setNameAndEmail();
  }
  else if(_page == "lead_page"){
    int_readAll(SCORES);
  }
  else if(_page == "gtn_lobby_page"){
    gtn_lobby_setNamePhoto();
  }
  else if(_page == "gtn_page"){
    uid = sessionStorage.getItem("gtnUid");
    fb_readRec(ACTIVE, uid, activeGame, fb_procGameRec);
    fb_readRec(SCORES, userDetails.uid, gameScores, fb_procGameScores);
    console.log(activeGame);
  }

  
  console.log(userAuth);
  console.log(userDetails);
  console.log(gameScores);
}

/*************************************************************/
// BACK BUTTON
/*************************************************************/

/*************************************************************/
//int_back()
//called by button from html
//function to switch the pages from other to landing page
//resets the game when it is pressed
//resets the leaderboard when it is pressed
/*************************************************************/
function int_back(){
  console.log('Back');
  // window.location="landing_page.html";

  

  // bb_back();
  // ttt_back();

  dbArray = [];

  bbClick = false;
  sessionStorage.setItem("bbClick", bbClick);  
  
  tttClick = false;
  sessionStorage.setItem("tttClick", tttClick);

  fb_readRec(DETAILS, userDetails.uid, userDetails, fb_procBack);
  fb_readRec(AUTH, userDetails.uid, userAuth, fb_procBack);
  fb_readRec(SCORES, userDetails.uid, gameScores, fb_procBack);
  
  LEAD1.innerText = '1. ';
  LEAD2.innerText = '2. ';
  LEAD3.innerText = '3. ';
  LEAD4.innerText = '4. ';
  LEAD5.innerText = '5. ';
  LEAD6.innerText = '6. ';
  LEAD7.innerText = '7. ';
  LEAD8.innerText = '8. ';
  LEAD9.innerText = '9. ';
  LEAD10.innerText = '10. ';

  
}

/*************************************************************/
// LEADERBOARD BUTTONS
/*************************************************************/

/*************************************************************/
//int_bbLead()
//called by button from html
//function to give value to the leaderboard
//shows the bb leaderboard when button is pressed
/*************************************************************/
function int_bbLead(){
  document.getElementById("b_leadBB").style.backgroundColor   = "purple";
  document.getElementById("b_leadBB").style.color             = "white";
  document.getElementById("b_leadTTT").style.backgroundColor = "white";
  document.getElementById("b_leadGTN").style.backgroundColor = "white"; 
  document.getElementById("b_leadTTT").style.color             = "black";
  document.getElementById("b_leadGTN").style.color             = "black";
  
  function compare(a,b) { return a.bbScore - b.bbScore;}

  dbArray.sort(compare);
  
  console.table(dbArray);

  LEAD1.innerText = '1. ' + dbArray[0].gameName + " : " + dbArray[0].bbScore + " sec";
  LEAD2.innerText = '2. ' + dbArray[1].gameName + " : " + dbArray[1].bbScore + " sec";
  LEAD3.innerText = '3. ' + dbArray[2].gameName + " : " + dbArray[2].bbScore + " sec";
  // LEAD4.innerText = '4. ' + dbArray[3].gameName + " : " + dbArray[3].bbScore + " sec";
  // LEAD5.innerText = '5. ' + dbArray[4].gameName + " : " + dbArray[4].bbScore + " sec";
  // LEAD6.innerText = '6. ' + dbArray[5].gameName + " : " + dbArray[5].bbScore + " sec";
  // LEAD7.innerText = '7. ' + dbArray[6].gameName + " : " + dbArray[6].bbScore + " sec";
  // LEAD8.innerText = '8. ' + dbArray[7].gameName + " : " + dbArray[7].bbScore + " sec";
  // LEAD9.innerText = '9. ' + dbArray[8].gameName + " : " + dbArray[8].bbScore + " sec";
  // LEAD10.innerText = '10. ' + dbArray[9].gameName + " : " + dbArray[9].bbScore + " sec";
}

/*************************************************************/
//int_tttLead()
//called by button from html
//function to give value to the leaderboard
//shows the ttt leaderboard when button is pressed
/*************************************************************/
function int_tttLead(){
  document.getElementById("b_leadBB").style.backgroundColor   = "white";
  document.getElementById("b_leadTTT").style.backgroundColor = "purple";
  document.getElementById("b_leadTTT").style.color             = "white";
  document.getElementById("b_leadGTN").style.backgroundColor = "white"; 
  document.getElementById("b_leadBB").style.color             = "black";
  document.getElementById("b_leadGTN").style.color             = "black";
  
  function compare(a,b) { return b.tttPlayer1Win - a.tttPlayer1Win;}

  dbArray.sort(compare);
  
  console.table(dbArray);
  
  LEAD1.innerText = '1. ' + dbArray[0].gameName + " : " +  dbArray[0].tttPlayer1Win + " wins";
  LEAD2.innerText = '2. ' + dbArray[1].gameName + " : " +  dbArray[1].tttPlayer1Win + " wins";
  LEAD3.innerText = '3. ' + dbArray[2].gameName + " : " +  dbArray[2].tttPlayer1Win + " wins";
  // LEAD4.innerText = '4. ' + dbArray[3].gameName + " : " +  dbArray[3].tttPlayer1Win + " wins";
  // LEAD5.innerText = '5. ' + dbArray[4].gameName + " : " +  dbArray[4].tttPlayer1Win + " wins";
  // LEAD6.innerText = '6. ' + dbArray[5].gameName + " : " +  dbArray[5].tttPlayer1Win + " wins";
  // LEAD7.innerText = '7. ' + dbArray[6].gameName + " : " +  dbArray[6].tttPlayer1Win + " wins";
  // LEAD8.innerText = '8. ' + dbArray[7].gameName + " : " +  dbArray[7].tttPlayer1Win + " wins";
  // LEAD9.innerText = '9. ' + dbArray[8].gameName + " : " +  dbArray[8].tttPlayer1Win + " wins";
  // LEAD10.innerText = '10. ' + dbArray[9].gameName + " : " +  dbArray[9].tttPlayer1Win + " wins";
}

/*************************************************************/
//int_gtnLead()
//called by button from html
//function to give value to the leaderboard
//shows the ttt leaderboard when button is pressed
/*************************************************************/
function int_gtnLead(){
  document.getElementById("b_leadBB").style.backgroundColor   = "white";
  document.getElementById("b_leadTTT").style.backgroundColor = "white";
  document.getElementById("b_leadBB").style.color             = "black";
  document.getElementById("b_leadTTT").style.color             = "black";
  document.getElementById("b_leadGTN").style.backgroundColor = "purple"; 
  document.getElementById("b_leadGTN").style.color             = "white";

  dbArray.sort((a, b) => {
    if(a.gtnLoss === b.gtnLoss) {
      // If two elements have same gtnLoss, then the one who has larger gtnWin wins
      return b.gtnWin - a.gtnWin;
    } else {
      // If two elements have different gtnLoss, then the one who has less gtnLoss wins
      return a.gtnLoss - b.gtnLoss;
    }
  });
  
  console.table(dbArray);
  
  LEAD1.innerText = '1. ' + dbArray[0].gameName + " : " +  dbArray[0].gtnWin + " wins";
  LEAD2.innerText = '2. ' + dbArray[1].gameName + " : " +  dbArray[1].gtnWin + " wins";
  LEAD3.innerText = '3. ' + dbArray[2].gameName + " : " +  dbArray[2].gtnWin + " wins";
  // LEAD4.innerText = '4. ' + dbArray[3].gameName + " : " +  dbArray[3].gtnWin + " wins";
  // LEAD5.innerText = '5. ' + dbArray[4].gameName + " : " +  dbArray[4].gtnWin + " wins";
  // LEAD6.innerText = '6. ' + dbArray[5].gameName + " : " +  dbArray[5].gtnWin + " wins";
  // LEAD7.innerText = '7. ' + dbArray[6].gameName + " : " +  dbArray[6].gtnWin + " wins";
  // LEAD8.innerText = '8. ' + dbArray[7].gameName + " : " +  dbArray[7].gtnWin + " wins";
  // LEAD9.innerText = '9. ' + dbArray[8].gameName + " : " +  dbArray[8].gtnWin + " wins";
  // LEAD10.innerText = '10. ' + dbArray[9].gameName + " : " +  dbArray[9].gtnWin + " wins";
}

/*************************************************************/
// MODAL CODES
/*************************************************************/
// Get the button that opens the modal
var btn = document.querySelectorAll("button.modal-button");

// All page modals
var modals = document.querySelectorAll('.modal');

// Get the <span> element that closes the modal
var spans = document.getElementsByClassName("close");

// When the user clicks the button, open the modal
for (var i = 0; i < btn.length; i++) {
 btn[i].onclick = function(e) {
    e.preventDefault();
    modal = document.querySelector(e.target.getAttribute("href"));
    modal.style.display = "block";
  }
}

// When the user clicks on <span> (x), close the modal
for (var i = 0; i < spans.length; i++) {
 spans[i].onclick = function() {
    for (var index in modals) {
      if (typeof modals[index].style !== 'undefined') modals[index].style.display = "none";    
    }
  }
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
     for (var index in modals) {
      if (typeof modals[index].style !== 'undefined') modals[index].style.display = "none";    
     }
    }
}

/*************************************************************/
// SLIDESHOW CODES
/*************************************************************/

let slideIndex = 0;
showSlides();

function showSlides() {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}    
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active";
  setTimeout(showSlides, 2000); // Change image every 2 seconds
}

/*****************************************************/
//    END OF PROG
/*****************************************************/