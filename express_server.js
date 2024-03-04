const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase }
  res.render("urls_index", templateVars)
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const { id } = req.params; // Extracting the id from the route parameter
  const longURL = urlDatabase[id];//Attempt to retrieve the longURL using the id
  if (!longURL) { // Check if the longURL does not exist for the given id  
    return res.status(404).send("The short URL does not exist.");
  }
  const templateVars = { id: id, longURL: longURL }
  res.render("urls_show", templateVars)
});

app.get("/u/:id", (req, res) => { //redirect to the URL inputted
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
})

app.post("/urls", (req, res) => {
  console.log(req.body); //Log the POST request body to the console
  let id = generateRandomString();
  urlDatabase[id] = req.body.longURL;
  return res.redirect(`/urls/${id}`) //Redirect to another page 
})

app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id];
  return res.redirect(`/urls`);
})

app.post("/urls/:id/edit", (req, res) => {
  const id = req.params.id;
  urlDatabase[id] = req.body.longURL;
  return res.redirect(`/urls`)
})

app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  return res.redirect(`/urls/${id}`)
})

app.post("/login", (req, res) => {
  res.cookie('username', req.body);
  return res.redirect(`/urls`);

})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
})

function generateRandomString() {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

