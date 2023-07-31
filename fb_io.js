/*****************************************************/
// Written by Wina, Term 2 2022
// fb_io.js
//  all functions from this module starts with fb_
//  v1 base code
//  v2 copied code from firebase mini skill
//  v3 tailored it to fit
//  v4 tailored to fit the switching pages 
//     and addition of gtn game in 2023
/*****************************************************/

/*****************************************************/
// fb_initialise()
// Called by setup
// Initialize firebase
// Input:  n/a
// Return: n/a
/*****************************************************/
function fb_initialise() {
  console.log('fb_initialise: ');
  var firebaseConfig = {
    apiKey: "AIzaSyDETszZWIKxFQdedcKGd-Uy1YKNgeDaNi4",
    authDomain: "comp-2022-wina-prasetyo.firebaseapp.com",
    databaseURL: "https://comp-2022-wina-prasetyo-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "comp-2022-wina-prasetyo",
    storageBucket: "comp-2022-wina-prasetyo.appspot.com",
    messagingSenderId: "932775384607",
    appId: "1:932775384607:web:ec04d10daf04d1a916272a",
    measurementId: "G-722MKT4WR5"
  };


  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  console.log(firebase);

  database = firebase.database();
}

/*****************************************************/
// fb_login(_dataRec)
// Called by setup
// Login to Firebase
// Input:  n/a
// Return: n/a
/*****************************************************/
function fb_login(_dataRec) {
  console.log('fb_login: ');
  firebase.auth().onAuthStateChanged(newLogin);

  function newLogin(user) {
    if (user) {
      // user is signed in, so save Google login details
      _dataRec.uid = user.uid;
      _dataRec.email = user.email;
      _dataRec.name = user.displayName;
      _dataRec.photoURL = user.photoURL;

      sessionStorage.setItem("uid", user.uid);
      sessionStorage.setItem("email", user.email);
      sessionStorage.setItem("name", user.displayName);
      sessionStorage.setItem("photoURL", user.photoURL);

      // fb_procLogin

      fb_readRec(DETAILS, user.uid, _dataRec, fb_procUserDetails);
      fb_readRec(AUTH, user.uid, userAuth, fb_procUserDetails);
      fb_readRec(SCORES, user.uid, gameScores, fb_procUserDetails);
      // fb_readOn(DETAILS, user.uid, _dataRec, fb_procReadOn); //ADD NEW LINE OF CODE 

  

      loginStatus = 'logged in';
      console.log('fb_login: status = ' + loginStatus);
      
    }
    else {
      // user NOT logged in, so redirect to Google login
      loginStatus = 'logged out';
      console.log('fb_login: status = ' + loginStatus);

      var provider = new firebase.auth.GoogleAuthProvider();
      //firebase.auth().signInWithRedirect(provider); // Another method
      firebase.auth().signInWithPopup(provider).then(function(result) {
        _dataRec.uid = user.uid;
        _dataRec.email = user.email;
        _dataRec.name = user.displayName;
        _dataRec.photoURL = user.photoURL;

        // fb_procLogin

        fb_readRec(DETAILS, user.uid, _dataRec, fb_procUserDetails);
        fb_readRec(AUTH, user.uid, userAuth, fb_procUserDetails);
        fb_readRec(SCORES, user.uid, gameScores, fb_procUserDetails);
        // fb_readOn(DETAILS, user.uid, _dataRec, fb_procReadOn); //ADD NEW LINE OF CODE

        loginStatus = 'logged in via popup';
        _procFunc(loginStatus, result.user, _save); //????
        console.log('fb_login: status = ' + loginStatus);
      })
        // Catch errors
        .catch(function(error) {
          if (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            loginStatus = 'error: ' + error.code;
            console.error('fb_login: error code = ' + errorCode + '    ' + errorMessage);
          }
        });
    }
  }
}

/*****************************************************/
// fb_writeRec(_path, _key, _data)
// Write a specific record & key to the DB
// Input:  path to write to, the key, data to write
// Return: 
/*****************************************************/
function fb_writeRec(_path, _key, _data) {
  console.log('fb_WriteRec: path= ' + _path + '  key= ' + _key +
    '  data= ' + _data);


  writeStatus = "waiting";
  firebase.database().ref(_path + "/" + _key).set(_data,
    function(error) {
      if (error) {
        writeStatus = "failure";
        console.log(error);
      }
      else {
        writeStatus = "OK";
      }
    })
}

/*****************************************************/
// fb_readAll(_path, _data, _procFunct)
// Read all DB records for the path
// Input:  path to read from and where to save it 
//           & function to process it
// Return:
/*****************************************************/
function fb_readAll(_path, _data, _procFunct) {
  console.log('fb_readAll: path= ' + _path);

  readStatus = "waiting";
  firebase.database().ref(_path).once('value', gotRecord, readErr);

  function gotRecord(snapshot) {
    let dbData = snapshot.val();
    let error = "no";
    _procFunct(dbData, _data, error, _path);
  }

  function readErr(error) {
    let dbData = "error";
    _procFunct(dbData, _data, error, _path);
  }

}

/*****************************************************/
// fb_readAllSnapshot(_path, _procFunc)
// Read all DB records for the path, customised for admin manager. Passes entire snapshot instead of individual values
// Input:  path to read from and the processor callback
// Return: N/A
/*****************************************************/
function fb_readAllSnapshot(_path, _procFunc) {
  console.log('fb_readAllSnapshot: path= ' + _path);

  readStatus = "waiting";
  firebase.database().ref(_path).once("value").then((snapshot) => {
    const val = snapshot.val();

    if (val === null) {
      // Report reads from invalid directories
      readStatus = "No record";

      _procFunc("FAIL", undefined);
    } else {
      readStatus = "Successful";

      _procFunc("OK", snapshot);
    }
  }).catch((error) => {
    readStatus = "fail";
    console.log(error);
  });
}

/*****************************************************/
// fb_readRec(_path, _key, _data, _procFunct)
// Read a specific DB record
// Input:  path & key of record to read, where to save it 
//          & what data to process
// Return:  
/*****************************************************/
function fb_readRec(_path, _key, _data, _procFunct) {
  console.log('fb_readRec: path= ' + _path + '  key= ' + _key);

  readStatus = "waiting";
  firebase.database().ref(_path + "/" + _key).once('value', gotRecord, readErr);

  function gotRecord(snapshot) {
    let dbData = snapshot.val();
    let error = "no";
    _procFunct(dbData, _data, error);
  }

  function readErr(error) {
    let dbData = "error";
    _procFunct(dbData, _data, error);
  }
}


/*****************************************************/
// function fb_stopReadOn(_path, _key)
// called by players in game lobby, and game
// to stop readOn()
// stop checking a certain data
// Input : 
// Output : 
/*****************************************************/
function fb_stopReadOn(_path, _key) {
  console.log('fb_stopReadOn: path= ' + _path + '  key= ' + _key);

  firebase.database().ref(_path + "/" + _key).off;
                                                                
}

/*****************************************************/
// fb_readOn(_path, _key, _data, _procFunct) 
// Check any changes on the database 
// Input:  path & key of record to read, where to save it 
//          & what data to process 
// Return: 
/*****************************************************/
function fb_readOn(_path, _key, _data, _procFunct, _rec) {
  console.log('fb_readOn: path= ' + _path + '  key= ' + _key);
  readStatus = "waiting";
  firebase.database().ref(_path + "/" + _key + "/" + _rec).on('value', gotRecord, readErr);

  function gotRecord(snapshot) {
    let dbData = snapshot.val();
    let error = "no";
    _procFunct(dbData, _data, error);
  }

  function readErr(error) {
    let dbData = "error";
    _procFunct(dbData, _data, error);
  }

}

/*****************************************************/
// function fb_procReadOn(_procData, _data, _error) 
// called by fb_readOnl() 
// to log in information 
// process the user data 
// Input : UserDetails to parameter 
// Output : Change in data & console log 
/*****************************************************/
function fb_procReadOn(_procData, _data, _error) {
  if (_procData == null) {
    readStatus = "no record";
    lg_console("fb_procReadOn callback null", "red");
  }
  else if (_procData == "error") {
    readStatus = "failure";
    console.log(_error);
    lg_console("fb_procReadOn callback error", "red");
  }
  else {
    readStatus = "OK";
    lg_console("fb_procReadOn callback ok", "green");
    console.log(_procData);
  }
}

/*****************************************************/
// function fb_procUserDetails(_procData, _data, _error)
// called by fb_readRec() in int_readRec()
// to read every record in the world
// process the user data
// Input : UserDetails to parameter
// Output : Change in data
/*****************************************************/
function fb_procUserDetails(_procData, _data, _error) {
  if (_procData == null) {
    readStatus = "no record";
    //show registration page so user can resgister
    int_regEnter();
    return;

    // reg_setNameAndEmail();
  }
  else if (_procData == "error") {
    readStatus = "failure";
    console.log(_error);
  }
  else {
    readStatus = "MOVE";
    if (_data == gameScores) {
      _data.bbScore = _procData.bbScore;
      _data.tttPlayer1Win = _procData.tttPlayer1Win;
      _data.tttPlayer2Win = _procData.tttPlayer2Win;
      _data.tttTie = _procData.tttTie;
      _data.gameName = _procData.gameName;
      _data.gtnLose = _procData.gtnLose;
      _data.gtnWin = _procData.gtnWin;

      sessionStorage.setItem("bbScore", _data.bbScore);
      sessionStorage.setItem("tttPlayer1Win", _data.tttPlayer1Win);
      sessionStorage.setItem("tttPlayer2Win", _data.tttPlayer2Win);
      sessionStorage.setItem("tttTie", _data.tttTie);
      sessionStorage.setItem("gameName", _data.gameName);
      sessionStorage.setItem("gtnLose", _data.gtnLose);
      sessionStorage.setItem("gtnWin", _data.gtnWin);
    }
    else if (_data == userDetails) {
      _data.uid = _procData.uid;
      _data.name = _procData.name;
      _data.email = _procData.email;
      _data.photoURL = _procData.photoURL;
      _data.age = _procData.age;
      _data.phone = _procData.phone;
      _data.gender = _procData.gender;
      _data.streetNum = _procData.streetNum;
      _data.street = _procData.street;
      _data.suburb = _procData.suburb;
      _data.city = _procData.city;
      _data.post = _procData.post;
      
      sessionStorage.setItem("uid", _data.uid);
      sessionStorage.setItem("name", _data.name);
      sessionStorage.setItem("email", _data.email);
      sessionStorage.setItem("photoURL", _data.photoURL);
      sessionStorage.setItem("age", _data.age);
      sessionStorage.setItem("phone", _data.phone);
      sessionStorage.setItem("gender", _data.gender);
      sessionStorage.setItem("streetNum", _data.streetNum);
      sessionStorage.setItem("street", _data.street);
      sessionStorage.setItem("suburb", _data.suburb);
      sessionStorage.setItem("city", _data.city);
      sessionStorage.setItem("post", _data.post);
    }
    else if (_data == userAuth) {
      _data.role = _procData.role;
      console.log(_data.role);
      sessionStorage.setItem("auth", _data.role);
      // int_adVisibility(); //Commented out as this is needed in the landing page instead
    }
    
  }
}

/*****************************************************/
// function fb_procBack(_procData, _data, _error)
// called by fb_readRec()
// to read game record
// process the user data
// Input : UserDetails to parameter
// Output : Change in data
/*****************************************************/
function fb_procBack(_procData, _data, _error) {
  if (_procData == null) {
    readStatus = "no record";
    //show registration page so user can resgister
    int_regEnter();
    return;

    // reg_setNameAndEmail();
  }
  else if (_procData == "error") {
    readStatus = "failure";
    console.log(_error);
  }
  else {
    readStatus = "OK";
    if (_data == gameScores) {
      _data.bbScore = _procData.bbScore;
      _data.tttPlayer1Win = _procData.tttPlayer1Win;
      _data.tttPlayer2Win = _procData.tttPlayer2Win;
      _data.tttTie = _procData.tttTie;
      _data.gameName = _procData.gameName;
      _data.gtnLose = _procData.gtnLose;
      _data.gtnWin = _procData.gtnWin;

      sessionStorage.setItem("bbScore", _data.bbScore);
      sessionStorage.setItem("tttPlayer1Win", _data.tttPlayer1Win);
      sessionStorage.setItem("tttPlayer2Win", _data.tttPlayer2Win);
      sessionStorage.setItem("tttTie", _data.tttTie);
      sessionStorage.setItem("gameName", _data.gameName);
      sessionStorage.setItem("gtnLose", _data.gtnLose);
      sessionStorage.setItem("gtnWin", _data.gtnWin);
      
    }
    else if (_data == userDetails) {
      _data.uid = _procData.uid;
      _data.name = _procData.name;
      _data.email = _procData.email;
      _data.photoURL = _procData.photoURL;
      _data.age = _procData.age;
      _data.phone = _procData.phone;
      _data.gender = _procData.gender;
      _data.streetNum = _procData.streetNum;
      _data.street = _procData.street;
      _data.suburb = _procData.suburb;
      _data.city = _procData.city;
      _data.post = _procData.post;
      
      sessionStorage.setItem("uid", _data.uid);
      sessionStorage.setItem("name", _data.name);
      sessionStorage.setItem("email", _data.email);
      sessionStorage.setItem("photoURL", _data.photoURL);
      sessionStorage.setItem("age", _data.age);
      sessionStorage.setItem("phone", _data.phone);
      sessionStorage.setItem("gender", _data.gender);
      sessionStorage.setItem("streetNum", _data.streetNum);
      sessionStorage.setItem("street", _data.street);
      sessionStorage.setItem("suburb", _data.suburb);
      sessionStorage.setItem("city", _data.city);
      sessionStorage.setItem("post", _data.post);
      
    }
    else if (_data == userAuth) {
      _data.role = _procData.role;
      console.log(_data.role);
      sessionStorage.setItem("auth", _data.role);
      // int_adVisibility(); //Commented out as this is needed in the landing page instead
      
      
    }
    int_landEnter();
    
  }
}

/*****************************************************/
// function fb_procGameSores(_procData, _data, _error)
// called by fb_readRec()
// to read gameScores
// process the user data
// Input : UserDetails to parameter
// Output : Change in data
/*****************************************************/
function fb_procGameScores(_procData, _data, _error) {
  if (_procData == null) {
    readStatus = "no record";
    //show registration page so user can resgister
    int_regEnter();

    // reg_setNameAndEmail();
  }
  else if (_procData == "error") {
    readStatus = "failure";
    console.log(_error);
  }
  else {
    readStatus = "OK";
    if (_data == gameScores) {
      _data.bbScore = _procData.bbScore;
      _data.tttPlayer1Win = _procData.tttPlayer1Win;
      _data.tttPlayer2Win = _procData.tttPlayer2Win;
      _data.tttTie = _procData.tttTie;
      _data.gameName = _procData.gameName;
      _data.gtnLose = _procData.gtnLose;
      _data.gtnWin = _procData.gtnWin;

      sessionStorage.setItem("bbScore", _data.bbScore);
      sessionStorage.setItem("tttPlayer1Win", _data.tttPlayer1Win);
      sessionStorage.setItem("tttPlayer2Win", _data.tttPlayer2Win);
      sessionStorage.setItem("tttTie", _data.tttTie);
      sessionStorage.setItem("gameName", _data.gameName);
      sessionStorage.setItem("gtnLose", _data.gtnLose);
      sessionStorage.setItem("gtnWin", _data.gtnWin);
      
    }
  }
}

/*****************************************************/
// function fb_procGameRec(_procData, _data, _error)
// called by fb_readRec()
// to read game record
// process the user data
// Input : UserDetails to parameter
// Output : Change in data
/*****************************************************/
function fb_procGameRec(_procData, _data, _error) {
  if (_procData == null) {
    readStatus = "no record";
  }
  else if (_procData == "error") {
    readStatus = "failure";
    console.log(_error);
  }
  else {
    readStatus = "OK";
      _data.p1gameName = _procData.p1gameName;
      _data.p1uid = _procData.p1uid;
      _data.p1guess = _procData.p1guess;
      _data.range = _procData.range;
      _data.p2gameName = _procData.p2gameName;
      _data.p2uid = _procData.p2uid;
      _data.p2guess = _procData.p2guess;
    
  }

  gtn_page_setPage();
}

/*****************************************************/
// function fb_procGtnRec(_procData, _data, _error)
// called by fb_readRec()
// to read gtn record
// process the user data
// Input : UserDetails to parameter
// Output : Change in data
/*****************************************************/
function fb_procGtnRec(_procData, _data, _error){
  if (_procData == null) {
    readStatus = "no record";
  }
  else if (_procData == "error") {
    readStatus = "failure";
    console.log(_error);
  }
  else {
    readStatus = "OK";
      _data.p1gameName = _procData.p1gameName;
      _data.p1uid = _procData.p1uid;
      _data.p1guess = _procData.p1guess;
      _data.range = _procData.range;
      _data.p2gameName = _procData.p2gameName;
      _data.p2uid = _procData.p2uid;
      _data.p2guess = _procData.p2guess;
  }
}

/*****************************************************/
// function fb_procRec(_procData, _data, _error, _path)
// called by fb_readAll() in int_readAll()
// to read all record in the world
// process the key and its data
// processes the _path to
// figure out which data to push
// Input : dbData to parameter
// Output : Change in data
/*****************************************************/
function fb_procRec(_procData, _data, _error, _path) {

  if (_procData == null) {
    readStatus = "no record";
  }
  else if (_procData == "error") {
    readStatus = "failure";
    console.log(_error);
  }
  else {
    readStatus = "OK";
    let dbKeys = Object.keys(_procData);

    for (i = 0; i < dbKeys.length; i++) {
      let key = dbKeys[i];
      let procData = _procData[key];

      if (_path == SCORES) {
        dbArray.push({
          bbScore: procData.bbScore,
          tttPlayer1Win: procData.tttPlayer1Win,
          tttPlayer2Win: procData.tttPlayer2Win,
          tttTie: procData.tttTie,
          gameName: procData.gameName,
          gtnWin : procData.gtnWin,
          gtnLose : procData.gtnLose
        });
      }
      else if(_path == LOBBY){
        dbArray.push ({
          p1gameName : procData.p1gameName,
          join : procData.join,
          range : procData.range,
          wins : procData.wins,
          losses : procData.losses
        });
      }
      else if (_path == DETAILS) {
        dbArray.push({
          uid: procData.uid,
          name: procData.name,
          email: procData.email,
          photoURL: procData.photoURL,
          age: procData.age,
          phone: procData.phone,
          gender: procData.gender,
          streetNum: procData.streetNum,
          street: procData.street,
          suburb: procData.suburb,
          city: procData.city,
          post: procData.post,

        });
      }

    }
  }
}
/*****************************************************/
//    END OF MODULE
/*****************************************************/