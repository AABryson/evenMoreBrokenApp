-BUG #1: 'seed' in package.json dropped the databases before creating them.

-BUG #2: The authUser function in auth.js doesn't contain the jwt.verify() function to verify the token.

-BUG #3: the 'requireAdmin' function in auth.js in middleware should verify that the user is logged in.  It only verifies admin property and not user.

-BUG #4: The 'authenticate' method in user.js in the models folder fails to delete the password in the 'return user' line which looks like a security risk.

BUG #5: The method 'getAll' in user.js in models passess username and password but doesn't require either.

