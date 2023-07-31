/*****************************************************/
//  Written by Wina, Term 2 2022
//  bb_game.js
//  Program to Pop the ball
//    all functions from this module starts with bb_
//  v1 base program
//  v2 copied game from mini skills
//  v3 link the game to the HTML
//  v4 integrate the high score from firebase
//  v5 write score to firebase 
//  v6 tweaked to fit the switching pages in 2023
/*****************************************************/

/*************************************************************/
// VARIABLES, CONSTANTS, ARRAYS, ETC.
/*************************************************************/

// array to hold the balls
var circles = [];

//var to figure out if the game is started or not
var buttonText = "start";
var start = false;

//boolean to make the balls start when the start button is pressed
var startBoolean = false;

//variables and constants for the timer
var counter = 1;
var interval;
const TIMER = document.getElementById("bbTime");
const BTN = document.getElementById("bbBtn");

//var and const to the hit and miss counter
const MISS = document.getElementById("bbMiss");
const HITS = document.getElementById("bbHits");
const UPDATE = document.getElementById("bbUpdate");
var currentHit = 1;
var missNum = 1;

//boolean to make sure the circle is hit
var circleHit = false;

/*****************************************************/
// bb_setup()
// called by setup() in interface.js
/*****************************************************/
function bb_setup() {
  console.log("bbSetup");

  var bbElmnt = document.getElementById("bbCanvas");
  bb_canvas = createCanvas(bbElmnt.offsetWidth, 
                           bbElmnt.offsetHeight); 
  bb_canvas.parent("bbCanvas");

  console.log("Height/Width : " + bbElmnt.offsetHeight +
              "/" + bbElmnt.offsetWidth + " xpos/ypos : " +
              bbElmnt.offsetLeft+ "/" + bbElmnt.offsetTop);

  //create an observer to change the size of the bb_canvas
  const observer = new ResizeObserver(() => {
      resizeCanvas(bbElmnt.offsetWidth, bbElmnt.offsetHeight); 
  });

  //observe size changes to the element
  observer.observe(bbElmnt); 

  bbElmnt.style.padding = 0;
}

/*****************************************************/
// bb_draw()
// called by draw() in interface.js
// start the ball's functions
// updates the lowest time
/*****************************************************/
function bb_draw() {
  background(220);
  UPDATE.textContent = "Lowest Time : " + gameScores.bbScore;

  if (startBoolean == true){
    bb_ballFunct();
  }
}

/*************************************************************/
//bb_gameStart()
//called by BTN
//starts the timer, game and hit&miss counts when pressed
//stops the TIMER and restarts it when pressed
//also restarts the game, and hit&miss counts when stop is pressed
/*************************************************************/
function bb_gameStart() {
  //reset the HTMLs
  HITS.textContent = "Hits : 0";
  MISS.textContent = "Miss : 0";  
  TIMER.textContent = "Time : 0";
  
	if (start == false) {
    //loops BTN's function
		start = true;
		//time = 0;
		console.log("bbStart");
		if (buttonText == "start") {
      //starts the timer and changes BTN's style
			interval = setInterval(bb_timeIt, 1000);
      BTN.innerText = "STOP";
      BTN.style.backgroundColor = "red";
      BTN.style.color = "white";

      buttonText = "stop";

      //starts the circles' functions
      startBoolean = true;
  
      //check if the ball is hit
      bb_canvas.mousePressed(bb_checkHit);

      //draws the circles
			bb_balls();
		}
	} else {
    //loops BTN's functions
		start = false;
    console.log("bbStop");
		if (buttonText == "stop") {
      //resets all the buttons
      BTN.innerText = "START";
      BTN.style.backgroundColor = "green";
      BTN.style.color = "white";
			buttonText = "start";

      //gets rid of all the balls
			for (var i = 0; i < circles.length; i++){
        circles[i].kill(0, circles.length);
      }

      //resets the timer
      clearInterval(interval);

      //resets the counters
      counter = 1;
      currentHit = 1;
      missNum = 1;

      //reset the HTMLs
      HITS.textContent = "Hits : 0";
      MISS.textContent = "Miss : 0";  
      TIMER.textContent = "Time : 0";
		}
	}
}

/*************************************************************/
//bb_reset()
//called when back button is pressed and when game finishes
//resets the timer, game and hit&miss counts when pressed
/*************************************************************/
function bb_reset(){
  start = false;
  console.log("bbReset");
  
  //resets all the buttons
  BTN.innerText = "START";
  BTN.style.backgroundColor = "green";
  BTN.style.color = "white";
	buttonText = "start";

  //gets rid of all the balls
  for (var i = 0; i < circles.length; i++){
    circles[i].kill(0, circles.length);
  }

  //resets the timer
  clearInterval(interval);

  //resets the counters
  counter = 1;
  currentHit = 1;
  missNum = 1;
}

/*************************************************************/
//bb_back()
//called when back button is pressed 
//resets the timer, game and hit&miss counts when pressed
//makes sure functions from this module is not run
/*************************************************************/
function bb_back(){
  start = false;
  console.log("bbBack");
  
  //resets all the buttons
  BTN.innerText = "START";
  BTN.style.backgroundColor = "green";
  BTN.style.color = "white";
	buttonText = "start";

  //gets rid of all the balls
  for (var i = 0; i < circles.length; i++){
    circles[i].kill(0, circles.length);
  }

  //resets the timer
  clearInterval(interval);

  //resets the counters
  counter = 1;
  currentHit = 1;
  missNum = 1;

  bbClick = false;
  sessionStorage.setItem("bbClick", bbClick);
}



/*************************************************************/
//bb_timeIt()
//called by bb_gameStart()
//changes the timer html and adds the counter
/*************************************************************/
function bb_timeIt(){
  TIMER.textContent = "Time : " + counter;
  counter++;
}

/*****************************************************/
//bb_balls()
//called by : bb_gameStart()
//function to produce the balls
/*****************************************************/
function bb_balls(){
  /***********************************************************/
  //loop to produce the circles
  /***********************************************************/
  for(var i = 0; i < 10; i++){
    /**********************************************************/
    //circles' properties
    //called by for loop
    /**********************************************************/
    circles[i] = {
      x : width/2,
      y : height/2,
      speedX : random(-2, 2),
      speedY : random(-2, 2),
      diameter : 100,
      r : random(255),
      g : random(255),
      b : random(255),
      move : function (){
        /*******************************************************/
        //add velocity the ellipses
        /*******************************************************/
        this.x = this.x + this.speedX;
        this.y = this.y + this.speedY;
      },
      check : function (){
        /*******************************************************/
        //make the circles bounce off the canvas
        /*******************************************************/
        //right and left
        if ( this.x + this.diameter/2 >= width ) {
  	      this.x = width - this.diameter/2;
          this.speedX = -this.speedX;
        }
        else if ( this.x - this.diameter/2 <= 0 ) {
  	      this.x = this.diameter/2;
          this.speedX = -this.speedX;
        }

        // up and down
        if ( this.y + this.diameter/2 >= height ) {
  	      this.y = height - this.diameter/2;
          this.speedY = -this.speedY;
        }
        else if ( this.y - this.diameter/2 <= 0 ) {
  	      this.y = this.diameter/2;
          this.speedY = -this.speedY;
        }
      },
      display : function (){
        /*******************************************************/
        //draw the ellipse
        /*******************************************************/
        fill(this.r, this.g, this.b);
        noStroke();
        ellipse(this.x, this.y, this.diameter);
      },
      kill : function (_num, _quan){
        circles.splice(_num, _quan);
      },
    }
  }
}

/*************************************************************/
//bb_ballFunct()
//called by : bb_draw(), if ();
//to carry out all the balls' functions
/*************************************************************/
function bb_ballFunct(){
  /***********************************************************/
  //loop for circles' functions
  /***********************************************************/
  for (var i = 0; i < circles.length; i++){
    circles[i].move();
    circles[i].check();
    circles[i].display();
  }
}

/*************************************************************/
//bb_checkHit()
//called by : canvas.mousePressed
//function to check whether the ball is clicked or not
//gets rid of the ball after it is clicked
//adds to the number of hits and misses
//stops the timer when all the balls are gone
//resets the game when it finishes
//updates the time to record
/*************************************************************/
function bb_checkHit() {
  var hitNum = currentHit;
  for (var i = 0; i < circles.length; i++){
    //checks if any of the circles is hit
    var d = dist(circles[i].x, circles[i].y, mouseX, mouseY);
    if (d < circles[i].diameter / 2) {
      circleHit = true;
    }
    else if (d > circles[i].diameter / 2){
      circleHit = false; 
    }
    
    //splice the ball if it is hit
    //also adds to the hit count
    if (circleHit == true){
      circles[i].kill(i, 1);
      HITS.textContent = "Hits : " + currentHit;
      currentHit++;
    }

    //stops the time when all the balls are gone
    //resets the game immediately
    //updates the lowest time taken to complete the game
    //if the time is smaller than the previous time
    //updates the time if time in record is 'n/a'
    //keeps the ttt values the same!
    if (circles.length == 0){
      let bbScore = counter - 1;
      let tttPlayer1Win = gameScores.tttPlayer1Win;
      let tttPlayer2Win = gameScores.tttPlayer2Win;
      let tttTie = gameScores.tttTie;
      
      if(counter <= gameScores.bbScore){
        int_writeRec(bbScore, tttPlayer1Win, tttPlayer2Win, tttTie);
      }
      else if (gameScores.bbScore == 'n/a'){
        int_writeRec(bbScore, tttPlayer1Win, tttPlayer2Win, tttTie);
      }
      clearInterval(interval);
      counter = 1;
      console.log("bbFinish");
      bb_reset();
      
    }
  }

  //adds to miss count
  if (currentHit === hitNum && circleHit == false){
    MISS.textContent = "Miss : " + missNum;
    missNum++;
  }
}
/*****************************************************/
//   END OF CODE
/*****************************************************/