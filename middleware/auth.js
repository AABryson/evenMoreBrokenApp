/** Middleware for handling req authorization for routes. */



//##############################################################
//#AUTHORIZATION##########################

const jwt = require('jsonwebtoken');

//#???????????????????This doesn't appear to be used.
const { SECRET_KEY } = require('../config');

/** Authorization Middleware: Requires user is logged in. */

function requireLogin(req, res, next) {
  try {
    if (req.curr_username) {
      return next();
    } else {
      return next({ status: 401, message: 'Unauthorized' });
    }
  } catch (err) {
    return next(err);
  }
}

/** Authorization Middleware: Requires user is logged in and is staff. */

//#????????????????????????
function requireAdmin(req, res, next) {
  try {
    //BUG 3: This should also verify whether the user is logged in.  Currently, it only checks to see if user has isAdmin property
    //may not be a bug since when used on patch route has requireAdmin and requireLogin; also when used on delete route has autUser
    if (req.curr_admin) {
      return next();
    } else {
      return next({ status: 401, message: 'Unauthorized' });
    }
  } catch (err) {
    return next(err);
  }
}

/** Authentication Middleware: put user on request
 *
 * If there is a token, verify it, get payload (username/admin),
 * and store the username/admin on the request, so other middleware/routes
 * can use it.
 *
 * It's fine if there's no token---if not, don't set anything on the
 * request.
 *
 * If the token is invalid, an error will be raised.
 *
 **/

function authUser(req, res, next) {
  try {
    const token = req.body._token || req.query._token;
    //BUG 2
//#This should verify the token.  The fact that it doesn't explains why SECRET_KEY is not used in the code.
    if (token) {
      //Fixes BUG #2...
      //add: payload = jwt.verify(token, SECRET_KEY)  --should return the decoded payload
      
      let payload = jwt.decode(token);
      //####################################################################################
      //#Sets the decoded payload object on req.curr_username and req.curr_admin
      req.curr_username = payload.username;
      req.curr_admin = payload.admin;
    }
    return next();
  } catch (err) {
    err.status = 401;
    return next(err);
  }
} // end

module.exports = {
  requireLogin,
  requireAdmin,
  authUser
};
