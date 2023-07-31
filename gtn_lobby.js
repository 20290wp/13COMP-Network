/*****************************************************/
//  Written by Wina, Term 2 2023
//  gtn_lobby.js
//    changing page from lobby to game/landing page
//    allow user to browse the game lobbies
//    allow user to create their own game
//    allow user to join a game
//    all functions from this module starts with gtn_lobby_
//  v1 base code
//  v2 functions to setup the page
//  v3 add in a new game feature
//  v4 add in the lobby table
//  v5 join button active
//  v6 make sure the records writing/reading/deleting work
/*****************************************************/

const GREET = document.getElementById("gtn_lobby_greet");

const PP = document.getElementById("ppImg");

var act = true;

var lobbyArray = [];

/*************************************************************/
//gtn_lobby_setNamePhoto()
//called by button from gtn_lobby_page
//change html when data is recovered from SS
/*************************************************************/
function gtn_lobby_setNamePhoto (){
  PP.src = userDetails.photoURL;
  GREET.textContent = "Hi, " + gameScores.gameName;
}

/*************************************************************/
//gtn_lobby_newGame()
//called by button from gtn_lobby_page
//get data from user about the game range
//write the range to firebase
/*************************************************************/
function gtn_lobby_newGame(){
  console.log('gtn_lobby_newGame');
  let answer = prompt("Please enter the range of the game :", "10");
  if(answer == null || answer ==  " "){
    alert("Cancelled");
  }
  else {
    gameLobby.range = answer;
    gameLobby.p1gameName = gameScores.gameName;
    gameLobby.wins = gameScores.gtnWin;
    gameLobby.losses = gameScores.gtnLose;
    fb_writeRec(LOBBY, userDetails.uid, gameLobby);

    document.getElementById("loaderFoot").style.display="block";
    document.getElementById("gameButton").disabled = true;
    //players waiting for another player cannot join a game
    //reset the table to make sure the join button is unabled
    act = false;
    if (document.getElementById("t_game").rows.length > 0) {
      html_reset();
    }
    
    fb_readOn(LOBBY, userDetails.uid, gameLobby, gtn_join_procFunct, "join"); //ADD NEW LINE OF CODE 
    //wait for player
  }
}

/*************************************************************/
//gtn_join_procFunct(_procData, _data, _error)
//called by fb_readOn
//to process readOn value for join
/*************************************************************/
function gtn_join_procFunct(_pData, _data, _error){
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
    if(_pData !== 'n'){
      sessionStorage.setItem("gtnUid", _pData);
      //delete record since it's now moved to the activeGame record
      gtn_lobby_dbDelRec(userDetails.uid, LOBBY);
      //moves the page to the game page
      int_gameEnter(); 
    }
  }
}

/*************************************************************/
//gtn_lobby_cancel()
//called by button from html
//give back all theh disabled features
//stop read on
//delete record since new game is cancelled
/*************************************************************/
function gtn_lobby_cancel(){
  console.log('gtn_lobby_cancel');
  
  document.getElementById("loaderFoot").style.display="none";
  document.getElementById("gameButton").disabled = false;
  
  // del record since new game is cancelled
  gtn_lobby_dbDelRec(userDetails.uid, LOBBY);
  act = true;
  fb_stopReadOn(LOBBY, userDetails.uid);
}

/**************************************************************/
// gtn_lobby_dbDelRec()
// Input event; called by gtn_lobby_cancel()
// Delete record since new game is cancelled
// The lobby is erased from the records
// Input:   
// Return:
/**************************************************************/
function gtn_lobby_dbDelRec(_key, _path){
  console.log("/" + _path + "/" + _key);
  let record = firebase.database().ref("/" + _path + "/" + _key);
  record.remove();
}

/**************************************************************/
// gtn_lobby_game()
// Input event; called when admin game button clicked
// Display games screen
// Input:   
// Return:
/**************************************************************/
function gtn_lobby_game(){
  console.log('gtn_lobby_game: ');

  fb_readAllSnapshot(LOBBY, gtn_lobby_processGAMEReadAll);
}


/******************************************************/
// html_getData()
// Called by html GET DATA button
// Call fb_ readAll to read all firebase records in the path
// Input:  n/a
// Output: n/a
/******************************************************/
function html_getData() {
  console.log("html_getData: ");
  html_reset();
  
  fb_readAllSnapshot(LOBBY, gtn_lobby_procFunct);
}

/**************************************************************/
// gtn_lobby_procFunct(_result, _dbRec)
// Called by db_readAll to handle result of read ALL GAME records request.
// Save data & update display with record info
// Input:  read status "OK", data record just read. 
//         NOTE: this is the raw data, EG snapshot, NOT snapshot.val()
// Return:
/**************************************************************/
function gtn_lobby_procFunct(_result, _dbRec) {
  console.log('gtn_lobby_procFunct: ', 'result = ' + _result);

  var childKey;
  var childData;
  var lobbyArray = [];
  
  // Note: if read was successful, 1st input parameter must = "OK"
  if (_result == 'OK') {                                     
    _dbRec.forEach(function(childSnapshot) {
      childKey = childSnapshot.key;
      childData = childSnapshot.val();

      // ENSURE THE FEILDS YOU PUSH INTO THE ARRAY OF OBJECTS
      //  MATCH YOUR FIREBASE RECORDS FOR THE PATH
      lobbyArray.push({
        uid         :  childKey,
        p1gameName  :  childData.p1gameName,
        range       :  childData.range,
        join        :  childData.join,
        wins        :  childData.wins,
        losses      :  childData.losses,
      });
    });

    // build & display user data
    // MAKE SURE THE FOLOWING PARAMETERS ARE CORRECT. PARAMETER:         //<=======
    //  4 = HTML ID OF DIV TO HIDE OR LEAVE EMPTY                        //<=======
    //  5 = HTML ID OF DIV TO HIDE OR LEAVE EMPTY                        //<=======
    //  6 = HTML ID OF DIV TO SHOW OR LEAVE EMPTY                        //<=======
    //  7 = COLUMMN NUMBER WHICH CONTAINS THE DATABASE KEY.              //<=======
    //  8 = DATABASE PATH THE RECORDS WERE READ FROM.                    //<=======
    html_build("tb_userDetails", lobbyArray, act);
  }
}

/******************************************************/
// html_build()
// Called by html build button
// Calls function to build html table
// Input:  n/a
// Output: n/a
/******************************************************/
function html_build(_tableBodyId, _array, _action) {
  console.log("html_build: ");

  html_buildTableFunc(_tableBodyId, _array, _action);
}

/******************************************************/
// html_reset()
// Called by html reset button
// resets html table & buttons
// Input:  n/a
// Output: n/a
/******************************************************/
function html_reset() {
  console.log("html_reset: ");
  
  document.getElementById("tb_userDetails").innerHTML = '';
  lobbyArray = [];
}

/******************************************************/
// html_buildTableFunc(_tableBodyID, _array)
// Called by html_build()
// Build html table rows from an array of objects
// Input:  html id of table body, array of objects
//  EG  [{name:   'bobby',
//        wins:    4,
//        draws:   1,
//        losses:  0,
//        UID:     zE45Thkj9#se4ThkP},
//       {name:   'car man',
//        wins:    9,
//        draws:   0,
//        losses:  0,
//        UID:     g7K456hledrj#gkij}]
// Output: n/a
/******************************************************/
function html_buildTableFunc(_tableBodyID, _array, _action){
console.log("html_buildTableFunc: ");
  console.table(_array);

  // Get all the info on the table
  var html_table = document.getElementById(_tableBodyID);

  //makes buttons disabled when action is false
  if(_action == true){
    // Loop thu array; build row & add it to table
    for (i = 0; i < _array.length; i++) {
      // Back ticks define a temperate literal
      if(_array[i].join == 'y'){
      //hide lobbies that are going on??
        var row = `<tr style="display : none;">  
                    <td>${_array[i].p1gameName}</td>
                    <td class="w3-center">${_array[i].wins}</td>
                    <td class="w3-center">${_array[i].losses}</td>
                    <td class="w3-center">${_array[i].range}</td>
                    <td>${_array[i].uid}</td>
                    <td><button class="b_join">Join</button></td>
                  </tr>`
        html_table.innerHTML += row;
      }
      else {
        var row = `<tr>  
                      <td>${_array[i].p1gameName}</td>
                      <td class="w3-center">${_array[i].wins}</td>
                      <td class="w3-center">${_array[i].losses}</td>
                      <td class="w3-center">${_array[i].range}</td>
                      <td>${_array[i].uid}</td>
                      <td><button class="b_join">Join</button></td>
                    </tr>`
          html_table.innerHTML += row;
      }
      
    }
  }
  else{
    // Loop thu array; build row & add it to table
    for (i = 0; i < _array.length; i++) {
    // Back ticks define a temperate literal
      var row = `<tr>  
                <td>${_array[i].p1gameName}</td>
                <td class="w3-center">${_array[i].wins}</td>
                <td class="w3-center">${_array[i].losses}</td>
                <td class="w3-center">${_array[i].range}</td>
                <td>${_array[i].uid}</td>
                <td><button class="b_join" disabled>Join</button></td>
              </tr>`
      html_table.innerHTML += row;
    }
  }

  
  
  /*--------------------------------------------------*/
  // jQuery ready()
  // Only runs when jQuery determines page is "ready"
  // Adds to all rows inside tb_userDetails an onclick
  //  function to get the current row's UID entry.
  /*--------------------------------------------------*/
  $(document).ready(function(){
      // code to read selected table row cell data (values).
      $("#tb_userDetails").on('click','.b_join',function(){
           // get the current row
           var currentRow=$(this).closest("tr"); 
           // get current row's 1st TD value
           var col5 = currentRow.find("td:eq(5)").text();
           console.log("html_buildTableFunc: uid = " + col5);

          //get data from the table
          activeGame.p1uid = currentRow.find("td:eq(4)").text();
          activeGame.p1gameName = currentRow.find("td:eq(0)").text();
          activeGame.range = currentRow.find("td:eq(3)").text();
          activeGame.p1win = currentRow.find("td:eq(1)").text();
          activeGame.p1lose = currentRow.find("td:eq(2)").text();
          activeGame.p2win = gameScores.gtnWin;
          activeGame.p2lose = gameScores.gtnLose;
          activeGame.p2gameName = gameScores.gameName;
          activeGame.p2uid = userDetails.uid;
          gameLobby.join = userDetails.uid;

          console.log(activeGame);
          //writes to active game
          fb_writeRec(ACTIVE, userDetails.uid, activeGame);
          fb_writeRec(LOBBY, activeGame.p1uid, gameLobby);
        
          sessionStorage.setItem("gtnUid", userDetails.uid);
        
          //change to gtn game page
          int_gameEnter();        
      });
  });
}
/**************************************************************/
//  END OE APP
/**************************************************************/