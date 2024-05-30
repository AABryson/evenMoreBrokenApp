const bcrypt = require('bcrypt');
const db = require('../db');
const ExpressError = require('../helpers/expressError');
const sqlForPartialUpdate = require('../helpers/partialUpdate');
const { BCRYPT_WORK_FACTOR } = require("../config");

class User {

/** Register user with data. Returns new user data. */

  static async register({username, password, first_name, last_name, email, phone}) {
    const duplicateCheck = await db.query(
      `SELECT username 
        FROM users 
        WHERE username = $1`,
      [username]
    );

    if (duplicateCheck.rows[0]) {
      throw new ExpressError(
        `There already exists a user with username '${username}'`,
        400
      );
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      //########################################################
//#########???????????????Should this be returning 'password' as well?  That seems to be a security problem
      `INSERT INTO users 
          (username, password, first_name, last_name, email, phone) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING username, password, first_name, last_name, email, phone`,
      [
        username,
        hashedPassword,
        first_name,
        last_name,
        email,
        phone
      ]
    );

    return result.rows[0];
  }


  /** Is this username + password combo correct?
   *
   * Return all user data if true, throws error if invalid
   *
   * */

//#verify that user is registered; this will be used directly in route; so it is the route where a user's password is first verified - LOGIN; after password is verified, may use requireLogin from auth.js on other routes to verify user is logged in
  static async authenticate(username, password) {
    const result = await db.query(
      `SELECT username,
                password,
                first_name,
                last_name,
                email,
                phone,
                admin
            FROM users 
            WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];

    if (user && (await bcrypt.compare(password, user.password))) {
      //#######################################################################
      //BUG 4
      //Should delete the password property; would lead to 'security issue in application'; although, in docstring, it says return all user data if true
      //add: delete user.password
      return user;
    } else {
      throw new ExpressError('Cannot authenticate', 401);
    }
  }

  /** Returns list of user info:
   *
   * [{username, first_name, last_name, email, phone}, ...]
   *
   * */


  //###########################why does this need password?  'username' and 'password' are not lit up
  //BUG 5:
  static async getAll(username, password) {
    const result = await db.query(
      `SELECT username,
                first_name,
                last_name,
                email,
                phone
            FROM users 
            ORDER BY username`
    );
    return result.rows;
  }

  /** Returns user info: {username, first_name, last_name, email, phone}
   *
   * If user cannot be found, should raise a 404.
   *
   **/


  //###################!!!!!!!!!!!!!!!!!!Fine
  static async get(username) {
    const result = await db.query(
      `SELECT username,
                first_name,
                last_name,
                email,
                phone
         FROM users
         WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];

    if (!user) {
      new ExpressError('No such user', 404);
    }

    return user;
  }

  /** Selectively updates user from given data
   *
   * Returns all data about user.
   *
   * If user cannot be found, should raise a 404.
   *
   **/

  //#haven't finished this one

  static async update(username, data) {
    let { query, values } = sqlForPartialUpdate(
      'users',
      data,
      'username',
      username
    );

    const result = await db.query(query, values);
    const user = result.rows[0];

    if (!user) {
      throw new ExpressError('No such user', 404);
    }

    return user;
  }

  /** Delete user. Returns true.
   *
   * If user cannot be found, should raise a 404.
   *
   **/

  //#####!!!!!!!!!!!!!!!!!!!!!!!!!!Fine
  static async delete(username) {
    const result = await db.query(
      //#need RETURNING so there is something in result.rows[0]
      'DELETE FROM users WHERE username = $1 RETURNING username',
      [username]
    );
    const user = result.rows[0];

    if (!user) {
      throw new ExpressError('No such user', 404);
    }

    return true;
  }
}

module.exports = User;
