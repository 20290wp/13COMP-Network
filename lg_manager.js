/*********************************************************************/
// lg_manager.js
//
// Stand alone module
// v1 Log to console if lg_logIt is true
// v2 Change debug from true to false by key
// v3 Add session storage
/*********************************************************************/

MODULENAME = "lg_manager.js";

var lg_logIt = true;
console.log(lg_logIt);

//p_debug.textContent = lg_logIt;

// call the function to log in the information
lg_console(MODULENAME + '\n----------', 'blue');


/*********************************************************************/
// lg_console(_text, _colour)
//
// Log information if lg_logIt is true
/*********************************************************************/
function lg_console(_text, _colour) {
  if (lg_logIt == true) {
    console.log("%c" + _text, "color:" + _colour);
  }
}