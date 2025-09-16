const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  return users.some((user) => user.username === username);
}


const authenticatedUser = (username, password) => { //returns boolean
  // Check if username and password match any user in the records.
  return users.some((user) => user.username === username && user.password === password);
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(404).send({ message: "Error logging in with username and password" });
  }
  else if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      { data: username },
      "access",
      { expiresIn: 60 * 60 },
    );
    req.session.authorization = accessToken;
    return res.status(200).send({ message: "User successfully logged in" });
  }
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const review = req.body;
  const username = req.user.data;
  const isbn = req.params.isbn;
  if (books[isbn]) {
    books[isbn].reviews[username] = review.review;
    return res.status(200).send({ message: "Review added/updated successfully." });
  }
  else {
    return res.status(404).send({ message: "Unable to find book!" });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.user.data;
  const isbn = req.params.isbn;
  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).send({ message: "Review is deleted successfully." });
  }
  else {
    return res.status(404).send({ message: "Unable to find book!" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
