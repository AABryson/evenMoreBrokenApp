const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

//#!!!!!!!!!!!!!!!!looks okay except for very bottom
/** return signed JWT for payload {username, admin}. */

//#this is from beforeEach in test:  ["u3", "fn3", "ln3", "email3", "phone3", await _pwd("pwd3"), true]
function createToken(username, admin=false) {
//#so username:username and admin : admin=false; unless they pass in true which will set admin=true
  let payload = {username, admin};
//#just seems to return actual token; doesn't send back, at this point, as part of response.body
  return jwt.sign(payload, SECRET_KEY);
}

//#shouldn't this be exported in object????
module.exports = createToken;