const express = require("express");

const Todo = require("../models/todos");
const isAuthenticated = require("../middlewares/isAuthenticated");

const router = express.Router();

router.get("/todos", (req, res) => {
  todoArray = []
  Todo.find({}, (err, todos) => {
    if (todos) {
      todos.forEach(function (todo) {
        const { todoText, author, done, _id } = todo;
        const dict = {text : todoText, author : author, done: done, _id : _id}
        todoArray.push(dict)
      });
      res.json({array: todoArray})
    } else {
      res.send(`no todos yet`);
    }
  });
});

router.post("/todos/add", isAuthenticated, async (req, res) => {
  const { todoText, author } = req.body;
  const done = false;

  if (todoText && author) {
    try {
      //author is req.session.username
      await Todo.create({ todoText, author, done });
      res.send("todo created succesfully");
    } catch {
      res.send("failure occurs when creating the todo");
    }
  } else {
    res.send("trying to create blank todo");
  }
});

router.post("/todos/complete", isAuthenticated, async (req, res) => {
  const { _id } = req.body;
  const update = {done : true};
  console.log (_id);
  try {
    await Todo.findOneAndUpdate(
      { _id },
      update,
      { useFindAndModify: true }
    );
    res.send("successfully marked todo as completed");
  } catch {
    res.send("failure occurs when marking todo as completed");
  }
});

module.exports = router;
