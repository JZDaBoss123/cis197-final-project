const { Schema, model } = require('mongoose')

const todoSchema = new Schema({
  todoText: String,
  author: String,
  done: Boolean
})

module.exports = model('Todo', todoSchema)