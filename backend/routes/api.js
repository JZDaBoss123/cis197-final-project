const express = require("express");
const Todo = require("../models/todos");
const isAuthenticated = require("../middlewares/isAuthenticated");

const accountSid = "ACed5c638cdc16064ccf9be937ac79952a";
const authToken = "602913d9377908baf78292956482d412";
const client = require("twilio")(accountSid, authToken);

const router = express.Router();

router.post("/todos/send", (req, res) => {
  const { number } = req.body;
  ret = "";
  Todo.find({}, (err, todos) => {
    if (todos) {
      todos.forEach(function (todo) {
        const { todoText, author, done, _id } = todo;
        ret += `${todoText}: ${done}\n`;
      });
      res.json({ string: ret });
      client.messages
        .create({
          body: ret,
          from: "+15128725856",
          to: number,
        })
        .then((message) => console.log(message.sid));
    } else {
      res.send(`no todos yet`);
    }
  });
});

router.get("/todos", (req, res) => {
  todoArray = [];
  Todo.find({}, (err, todos) => {
    if (todos) {
      todos.forEach(function (todo) {
        const { todoText, author, done, _id } = todo;
        const dict = { text: todoText, author: author, done: done, _id: _id };
        todoArray.push(dict);
      });
      res.json({ array: todoArray });
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
  const update = { done: true };
  try {
    await Todo.findOneAndUpdate({ _id }, update, { useFindAndModify: true });
    res.send("successfully marked todo as completed");
  } catch {
    res.send("failure occurs when marking todo as completed");
  }
});

router.post("/todos/incomplete", isAuthenticated, async (req, res) => {
  const { _id } = req.body;
  const update = { done: false };
  try {
    await Todo.findOneAndUpdate({ _id }, update, { useFindAndModify: true });
    res.send("successfully marked todo as incomplete");
  } catch {
    res.send("failure occurs when marking todo as incomplete");
  }
});

router.post("/todos/delete", isAuthenticated, async (req, res) => {
  const { _id } = req.body;
  try {
    await Todo.findOneAndRemove({ _id }, { useFindAndModify: true });
    res.send("successfully deleted todo as completed");
  } catch {
    res.send("failure occurs when deleting todo");
  }
});

module.exports = router;
