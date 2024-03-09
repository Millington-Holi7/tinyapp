//get user by checking the emails in the database and returns a user object. If no email provided, it returns undefined.
const getUserByEmail = function(email, database) {

  for (const userId in database) {
    if (database[userId].email === email) {
      return database[userId];
    }
  }
  return undefined;
}

//returns the URL objects that have the same userId as the one that is signed in.
const urlsForUser2 = function (userId,urlDatabase) {
  const output = {};
  for (const shortId in urlDatabase) {
    const urlObject = urlDatabase[shortId];
    if (urlObject.userID === userId) {
      output[shortId] = urlDatabase[shortId]
    }
  }
  return output;
}

module.exports = {getUserByEmail, urlsForUser2}