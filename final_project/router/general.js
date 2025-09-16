const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  try {
    const { username, password } = req.body;
    if (username && password) {
      if (!users.some(user => user.username === username)) {
        users.push({ username: username, password: password });
        return res.status(200).send({ message: "User successfully registered. Now you can login" });
      } else {
        return res.status(409).send({ message: "Username already exists." });
      }
    }
    else {
      return res.status(406).send({ message: "Unable to register user." });
    }
  }
  catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error registering user." });
  }
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  let data = JSON.stringify(books, null, 4);
  return res.status(200).send(data);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  }
});

// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  const author = req.params.author;
  let results = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());

  if (results.length > 0) {
    return res.status(200).send(JSON.stringify(results, null, 4));
  }
  return res.status(405).json({ message: "Author not found" });
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {

  const title = req.params.title;
  let results = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());

  if (results.length > 0) {
    return res.status(200).send(JSON.stringify(results, null, 4));
  }
  return res.status(405).json({ message: "Title not found" });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  if (!books[req.params.isbn]) {
    return res.status(405).json({ message: "Book not found" });
  }
  return res.status(200).send(JSON.stringify(books[req.params.isbn].reviews, null, 4));
});

module.exports.general = public_users;
