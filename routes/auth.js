/** Auth-related routes. */

const User = require('../models/user');
const express = require('express');
const router = express.Router();
const createTokenForUser = require('../helpers/createToken');


/** Register user; return token.
 *
 *  Accepts {username, first_name, last_name, email, phone, password}.
 *
 *  Returns {token: jwt-token-string}.
 *
 */

//###############!!!!!!!!!!!!!!!!!!!!Looks okay
router.post('/register', async function(req, res, next) {
  try {
    const { username, password, first_name, last_name, email, phone } = req.body;
//#register method executes bcrypt.hash().  then inserts user info into database
//#?????????the query returns - RETURNING username, password, first_name, last_name, email, phone`. there is no admin; however, admin = false is default;???but if exclude password, not returned?????; are defaults always returned on object?
    let user = await User.register({username, password, first_name, last_name, email, phone});
    /**delete createTokenForUser since belongs in the login route */
    //#is the above my comment.  I think it is #################################################################
    const token = createTokenForUser(username, user.admin);
    return res.status(201).json({ token });
  } catch (err) {
    return next(err);
  }
}); // end

/** Log in user; return token.
 *
 *  Accepts {username, password}.
 *
 *  Returns {token: jwt-token-string}.
 *
 *  If incorrect username/password given, should raise 401.
 *
 */


//##########!!!!!!!!!!!!!!!!This looks correct
router.post('/login', async function(req, res, next) {
  try {
    const { username, password } = req.body;
//#authenticate - verify user is registered
//if (user && (await bcrypt.compare(password, user.password))) {
  // returns user = result.rows which includes admin; throws error 401
    let user = User.authenticate(username, password);
//#so for regular login, user.admin is false.
    const token = createTokenForUser(username, user.admin);
//from createToken.js: let payload = {username, admin};
//#above method returns -return jwt.sign(payload, SECRET_KEY);
//contains the encoded payload and secret key; the token string
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
}); // end

module.exports = router;
