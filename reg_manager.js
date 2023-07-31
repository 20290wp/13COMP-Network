/**************************************************************/
// reg_manager.js
//
// Test registration page
// Written by Mr Bob 2020
// v01 Initial code
// v02 Include reg_getFormItemValue function in reg_manager.js 
// v03 Add reg_prep function
// v04 Add conversion from string to number for numeric feilds
// v05 Cut down version
// v06 Check if form passed html validation
// v07 tailored by Wina 2022
// v08 add in the gtn game in 2023
/**************************************************************/

/**************************************************************/
// reg_setNameAndEmail()
// Input event; called when user doesn't have a record
// Set user's name and email on the paragraph
// Input:   
// Return:
/**************************************************************/
function reg_setNameAndEmail(){
  document.getElementById("p_regName").innerHTML  = userDetails.name;
  document.getElementById("p_regEmail").innerHTML = userDetails.email;
}

/**************************************************************/
// reg_regDetailsEntered()
// Input event; called when user clicks reg_button in HTML
// Write user's details to DB
// Input:   
// Return:
/**************************************************************/
function reg_regDetailsEntered() {
  console.log('reg_regDetailsEntered'); 

  // get data from form and validate it
  gameScores.gameName = reg_getFormItemValue("f_reg", 0);
  userDetails.phone = Number(reg_getFormItemValue("f_reg", 1));
  userDetails.gender = reg_getFormItemValue("f_reg", 2);
  userDetails.age = Number(reg_getFormItemValue("f_reg", 3));
  userDetails.streetNum = Number(reg_getFormItemValue("f_reg", 4));
  userDetails.street = reg_getFormItemValue("f_reg", 5);
  userDetails.suburb = reg_getFormItemValue("f_reg", 6);
  userDetails.city = reg_getFormItemValue("f_reg", 7);
  userDetails.post = Number(reg_getFormItemValue("f_reg", 8));
  userDetails.uid = sessionStorage.getItem("uid");

  // set scores to 0, so that there's data in the record
  gameScores.bbScore = 'n/a';
  gameScores.tttPlayer1Win = 0;
  gameScores.tttPlayer2Win = 0;
  gameScores.tttTie = 0;
  gameScores.gtnLose = 0;
  gameScores.gtnWin = 0;

  // everyone is a user at first, and admin title can be handed out by owner(me)
  userAuth.role = 'user';
  
  console.log("reg_regDetailsEntered: form passed html validation - " +
            document.getElementById('f_reg').checkValidity()); 

  // Only write record to DB if all the fom's input passed html validation
  if (document.getElementById('f_reg').checkValidity()) {
    fb_writeRec(DETAILS, userDetails.uid, userDetails);

    // write to gameScores record too
    // so that form won't pop up when gameScores is called to read the best time
    // (because gameScores is still null as there's no record
    // thus the form will pop up again)
    fb_writeRec(SCORES, userDetails.uid, gameScores);

    // write to userAuth record
    // everyone who registers are users
    // admin is the only one who change the roles
    fb_writeRec(AUTH, userDetails.uid, userAuth);

    // saves all data in sessionStorage so that data can be attained by the onload function
    sessionStorage.setItem("uid", userDetails.uid);
    sessionStorage.setItem("name", userDetails.name);
    sessionStorage.setItem("email", userDetails.email);
    sessionStorage.setItem("photoURL", userDetails.photoURL);
    sessionStorage.setItem("age", userDetails.age);
    sessionStorage.setItem("phone", userDetails.phone);
    sessionStorage.setItem("gender", userDetails.gender);
    sessionStorage.setItem("streetNum", userDetails.streetNum);
    sessionStorage.setItem("street", userDetails.street);
    sessionStorage.setItem("suburb", userDetails.suburb);
    sessionStorage.setItem("city", userDetails.city);
    sessionStorage.setItem("post", userDetails.post);

    sessionStorage.setItem("bbScore", gameScores.bbScore);
    sessionStorage.setItem("tttPlayer1Win", gameScores.tttPlayer1Win);
    sessionStorage.setItem("tttPlayer2Win", gameScores.tttPlayer2Win);
    sessionStorage.setItem("tttTie", gameScores.tttTie);
    sessionStorage.setItem("gameName", gameScores.gameName);
    sessionStorage.setItem("gtnLose", gameScores.gtnLose);
    sessionStorage.setItem("gtnWin", gameScores.gtnWin);
    
    sessionStorage.setItem("auth", userAuth.role);

    //switch to landing page
    setTimeout(function(){
      // int_landEnter();
    }, 1000);
    //determines the admin button visibility
    // int_adVisibility();
  }
}

/**************************************************************/
// reg_getFormItemValue(_elementId, _item)
// Called by reg_regDetailsEntered
// Returns the value of the form's item
// Input:  element id & form item number
// Return: form item's value
/**************************************************************/
function reg_getFormItemValue(_elementId, _item) {
  //console.log('reg_getFormItemValue: _elementId=' + _elementId +
  //	  ',  _item= ' + _item);
    
  return document.getElementById(_elementId).elements.item(_item).value;
}

/**************************************************************/
//    END OF PROG
/**************************************************************/