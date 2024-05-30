-BUG #1: 'seed' in package.json dropped the databases before creating them.

-BUG #2: The authUser function in middleware/auth.js doesn't contain the jwt.verify() function to verify the token.

-BUG #3: the 'requireAdmin' function in middleware/auth.js should verify that the user is logged in.  It only verifies admin property and not user.

-BUG #4: The 'authenticate' method in models/user.js fails to delete the password in the 'return user' line which looks like a security risk.

BUG #5: The method 'getAll' in models/user.js passess username and password but doesn't require either.
