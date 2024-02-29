const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

const urlDetabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
app.get("/urls", (req, res) => {
  const templateVars = {urls: urlDetabase}
  res.render("urls_index", templateVars)
})
app.get("/", (req, res) => { //if this ("/") is inputted
  res.send("Hello!"); // show this
});

app.get("/urls.json", (req, res) => {
  res.json(urlDetabase)
});

app.get("/Hello", (req, res) => {
  res.send("<html><body>Hello <b>World<b></body></html>\n")
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
})