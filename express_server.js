const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser')
app.use(cookieParser());

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
}

app.get("/urls", (req, res) => {
  const currentUser = users[req.cookies["user_id"]]
  const templateVars = { urls: urlDatabase, user: currentUser }
  res.render("urls_index", templateVars)
});

app.get("/urls/new", (req, res) => {
  const currentUser = users[req.cookies["user_id"]]
  const templateVars = { user: currentUser }
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const { id } = req.params; // Extracting the id from the route parameter
  const longURL = urlDatabase[id];//Attempt to retrieve the longURL using the id
  if (!longURL) { // Check if the longURL does not exist for the given id  
    return res.status(404).send("The short URL does not exist.");
  }
  const currentUser = users[req.cookies["user_id"]]
  const templateVars = { id: id, longURL: longURL, user: currentUser }
  res.render("urls_show", templateVars)
});

app.get("/u/:id", (req, res) => { //redirect to the URL inputted
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
})
app.get("/register", (req, res) => {
  if (req.cookies["user_id"]) {
    // If user is already logged in, redirect to /urls or another relevant page
    return res.redirect("/urls");
  }
  // The rest of your existing code follows
  const currentUser = users[req.cookies["user_id"]]
  const templateVars = { user: currentUser }
  res.render("register", templateVars);
})

app.post("/urls", (req, res) => {
  let id = generateRandomString();
  urlDatabase[id] = req.body.longURL;
  return res.redirect(`/urls/${id}`) //Redirect to another page 
})

app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id];
  return res.redirect(`/urls`);
})

app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  urlDatabase[id] = req.body.longURL;
  return res.redirect(`/urls`)
})

app.post("/login", (req, res) => { //username login form 
  const { email } = req.body
  const emailExists = Object.values(users).some(user => user.email === email);
  if (emailExists) {
    // res.cookie('user.email', req.body.email);
    return res.redirect(`/urls`);
  } else {
    return res.redirect(`/register`);
  }
})

app.post("/logout", (req, res) => { //username login form 
  res.clearCookie('user');
  return res.redirect(`/urls`);
})
app.post("/register", (req, res) => {
  const { email, password } = req.body;

  // Validation: Check if email or password is empty
  if (!email || !password) {
    return res.status(400).send("Email and password cannot be blank.");
  }

  // Validation: Check if email already exists
  const emailExists = Object.values(users).some(user => user.email === email);
  if (emailExists) {
    return res.status(400).send("Email already in use.");
  }

  // Everything is fine; proceed with user creation
  const id = generateRandomString();
  users[id] = { id, email, password }; // Password should be hashed in a real app

  // Set only the user_id in cookie
  res.cookie('user_id', id);

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

