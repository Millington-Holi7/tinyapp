const {getUserByEmail} = require('./helpers.js');
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bcrypt = require("bcryptjs");
const cookieSession = require('cookie-session')
app.use(cookieSession({
  name: 'session',
  keys: ["one", "two", "three"],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "tttt",
  },
};

const users = {
  aJ48lW: {
    id: "aJ48lW",
    email: "user@example.com",
    password: "$2a$10$7fNh4p70DtZ9vGatFb4jhet6xUz.FSinudwfjTDMY2OHcnZfXYHyW",//love
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "$2a$10$WMC01.YqhqiTuyW0Cdctvut234qs5ukMevFwcsphiU8yLcBRTy5Ke", //dishwasher-funk
  },
}

app.get("/urls", (req, res) => {
  const currentUser = users[req.session.user_id]
  if (!currentUser) {
    return res.status(404).send(`<html><body><h1>To see URL's, please login or register</h1></body></html>`);
  }

  const urlsForUser = urlsForUser2(currentUser.id) // new object with all the URls that have matching user ID's
  const templateVars = { urls: urlsForUser, user: currentUser }
  return res.render("urls_index", templateVars)
});

app.get("/urls/new", (req, res) => {
  const currentUser = users[req.session.user_id]
  const templateVars = { user: currentUser }

  if (!currentUser) {
    res.redirect("./login");
  }
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const { id } = req.params; // Extracting the id from the route parameter
  const longURL = urlDatabase[id].longURL;//Attempt to retrieve the longURL using the id
  if (!longURL) { // Check if the longURL does not exist for the given id  
    return res.status(404).send("The short URL does not exist.");
  }
  const currentUser = users[req.session.user_id];
  const templateVars = { id: id, longURL: longURL, user: currentUser };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => { //redirect to the URL inputted

  const shortURLId = req.params.id; // Extract the :id from the request URL
  const urlObject = urlDatabase[shortURLId]; // Assuming urlsDatabase is where you store your URLs

  if (!urlObject) {
    // The short URL ID does not exist in the database, send an error message
    res.status(404).send('<html><body><h1>The requested short URL does not exist.</h1></body></html>');
  } else {
    const longURL = urlObject.longURL;
    res.redirect(longURL);
  }
});

app.get("/register", (req, res) => {
  if (req.session.user_id) {
    // If user is already logged in, redirect to /urls or another relevant page
    const currentUser = users[req.session.user_id]
    if (currentUser) {
      return res.redirect("/urls");
    }
  }
  const currentUser = users[req.session.user_id]
  const templateVars = { user: currentUser }
  res.render("register", templateVars);
})

app.get("/login", (req, res) => {
  const currentUser = users[req.session.user_id];
  // If there's a currentUser, redirect them away from the login page
  if (currentUser) {
    return res.redirect("./urls");
  }
  // If there's no currentUser, then proceed to render the login page
  const templateVars = { user: null }; // Since there's no currentUser, set user to null
  res.render("./login", templateVars);
});

app.post("/urls", (req, res) => {
  const currentUser = users[req.session.user_id]
  if (!currentUser) {
    // User is not logged in, so we send an HTML response with an error message
    res.status(401).send('<html><body><h1>You need to be logged in to shorten URLs!</h1></body></html>');
  } else {
    let id = generateRandomString();
    urlDatabase[id] = { longURL: req.body.longURL, userID: currentUser.id };
    return res.redirect(`/urls/${id}`) //Redirect to another page 
  }
})

app.post("/urls/:id/delete", (req, res) => {
  const currentUser = users[req.session.user_id];
  const id = req.params.id;
  const urlUserId = urlDatabase[id];

  if (currentUser.id !== urlUserId.userID) {
    return res.status(401).send('<html><body><h1>Only the creator can delete this link!</h1></body></html>');
  }
  delete urlDatabase[id];
  return res.redirect(`/urls`);
})

app.post("/urls/:id", (req, res) => {
  const currentUser = users[req.session.user_id];
  const id = req.params.id;
  const urlUserId = urlDatabase[id];

  if (currentUser.id !== urlUserId.userID) {
    return res.status(401).send('<html><body><h1>Only the creator can edit this link!</h1></body></html>');
  }
  urlUserId.longURL = req.body.longURL;
  return res.redirect(`/urls`)
})

app.post("/login", (req, res) => { //user login form .
  const { email, password } = req.body
  const user = getUserByEmail(email,users);
  if (user) {
    if (bcrypt.compareSync(password, user.password)) {
      req.session.user_id = user.id;
      return res.redirect(`/urls`);
    } else {
      return res.status(400).send("Password doesn't match.");
    }
  }
  return res.status(400).send("Email not found.");

})

app.post("/logout", (req, res) => { //user logout button
  req.session = null;
  return res.redirect(`/login`);
})

app.post("/register", (req, res) => {
  const { email, password } = req.body;

  // Validation: Check if email or password is empty
  if (!email || !password) {
    return res.status(400).send("Email and password cannot be blank.");
  }

  // Validation: Check if email already exists
  if (getUserByEmail(email,users)) {
    res.status(400).send("Email already in use.");
  }

  // Everything is fine; proceed with user creation
  const id = generateRandomString();
  const hash = bcryptPassword(password)
  users[id] = { id, email, password: hash };
  req.session.user_id = id;
  // Redirect to '/urls' after successful registration
  res.redirect("/urls");
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
})

function generateRandomString() { // generate random short URL
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const urlsForUser2 = function (userId) {
  const output = {};
  for (const shortId in urlDatabase) {
    const urlObject = urlDatabase[shortId];
    if (urlObject.userID === userId) {
      output[shortId] = urlDatabase[shortId]
    }
  }
  return output;
}

const bcryptPassword = function (password) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}
//console.log(bcryptPassword('love'));