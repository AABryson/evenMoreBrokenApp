/** User related routes. */

const User = require('../models/user');
const express = require('express');
const router = new express.Router();
const ExpressError = require('../helpers/expressError');
const { authUser, requireLogin, requireAdmin } = require('../middleware/auth');

/** GET /
 *
 * Get list of users. Only logged-in users should be able to use this.
 *
 * It should return only *basic* info:
 *    {users: [{username, first_name, last_name}, ...]}
 *
 */

//?????????????????????????????????????????????????
//##########################This uses authUser which doesn't have jwt.verify(); also requireLogin uses if(req.curr_username).  but authentication, which logs user in, returns username.  However, authUser does store curr_username on request object
//If only logged in user should be able to use this, why does it also have authUser???????????????????????????????????????????  I think it is because authUser adds curr_username property to request object.  and logged in user checks if req object contains curr_username
router.get('/', authUser, requireLogin, async function(req, res, next) {
  try {
    let users = await User.getAll();
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
}); // end

/** GET /[username]
 *
 * Get details on a user. Only logged-in users should be able to use this.
 *
 * It should return:
 *     {user: {username, first_name, last_name, phone, email}}
 *
 * If user cannot be found, return a 404 err.
 *
 */

//###################Again, authUser is supposed to verify token but doesn't have jwt.verify()
//###########!!!!!!!!!!!!!!!!Besides authUser problem, I think this is okay.
router.get('/:username', authUser, requireLogin, async function(
  req,
  res,
  next
) {
  try {
//# get model returns user which stores result.rows[0]
    let user = await User.get(req.params.username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[username]
 *
 * Update user. Only the user themselves or any admin user can use this.
 *
 * It should accept:
 *  {first_name, last_name, phone, email}
 *
 * It should return:
 *  {user: all-data-about-user}
 *
 * It user cannot be found, return a 404 err. If they try to change
 * other fields (including non-existent ones), an error should be raised.
 *
 */

//#haven't finished this one since uses sqlforpartialupdate
//not sure why this has authUser and requireLogin. perhaps run authUser first and adds to req.curr_username and then requirelogin looks for req.curr_userName
router.patch('/:username', authUser, requireLogin, requireAdmin, async function(
  req,
  res,
  next
) {
  try {
//#######################revealing bit
    if (!req.curr_admin && req.curr_username !== req.params.username) {
      throw new ExpressError('Only  that user or admin can edit a user.', 401);
    }

    // get fields to change; remove token so we don't try to change it
    //## so is req.body an object which is then spread into columns?
    let fields = { ...req.body };
    delete fields._token;

    let user = await User.update(req.params.username, fields);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
}); // end

/** DELETE /[username]
 *
 * Delete a user. Only an admin user should be able to use this.
 *
 * It should return:
 *   {message: "deleted"}
 *
 * If user cannot be found, return a 404 err.
 */


//#############!!!!!!!!!!!!!!!!!!looks okay
//#it doesn't say above they should provide a valid token?????
router.delete('/:username', authUser, requireAdmin, async function(
  req,
  res,
  next
) {
  try {
    User.delete(req.params.username);
    return res.json({ message: 'deleted' });
  } catch (err) {
    return next(err);
  }
}); // end

module.exports = router;
