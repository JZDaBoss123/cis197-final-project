const express = require("express");

const Todo = require("../models/todos");
const isAuthenticated = require("../middlewares/isAuthenticated");

const router = express.Router();

router.get("/todos", (req, res) => {
  Todo.find({}, (err, todos) => {
    if (todos) {
      ret = "";
      todos.forEach(function (todo) {
        const { todoText, author } = todo;
        ret += `user ${author} added: ${todoText}\n`;
      });
      res.send(ret);
    } else {
      res.send(`no questions yet`);
    }
  });
});

router.post("/todos/add", isAuthenticated, async (req, res) => {
  const { todoText, author } = req.body;
  const done = false

  try {
    //author is req.session.username
    await Todo.create({ todoText, author, done });
    res.send("question created succesfully");
  } catch {
    res.send("failure occurs when creating the question");
  }
});

router.post("/todos/delete", isAuthenticated, async (req, res) => {
  const { _id } = req.body;
  const done = true;

  try {
    await Question.findOneAndUpdate(
      { _id },
      { done },
      { useFindAndModify: true }
    );
    res.send("successfully marked todo as completed");
  } catch {
    res.send("failure occurs when marking todo as completed");
  }
});

module.exports = router;
