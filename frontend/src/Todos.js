import React, { useState } from "react";
import axios from "axios";
import s from "styled-components";

const Incomplete = s.p`
    text-align: center;
    background-color: grey;
`;

const Complete = s.p`
    text-align: center;
    background-color: green;
`;

const Posts = (props) => {
  const { item, socket } = props;
  const { text, author, done, _id } = item;


  const markComplete = async () => {
    try {
      await axios.post("/api/todos/complete", { _id });
    } catch (e) {
      alert(e);
    }
    socket.emit('change', 'marked complete')
  };

  const markIncomplete = async () => {
    try {
      await axios.post("/api/todos/incomplete", { _id });
    } catch (e) {
      alert(e);
    }
    socket.emit('change', 'marked incomplete')
  };

  const deleteTodo = async () => {
    try {
      await axios.post("/api/todos/delete", { _id });
    } catch (e) {
      alert(e);
    }
    socket.emit('change', 'deleted')
  };

  if (done) {
    return (
      <>
        <Complete>
        <div onClick={() => markIncomplete()}>
            <p>{text} by {author}</p>
            <button onClick = {() => deleteTodo()}> DELETE </button>
          </div>
        </Complete>
      </>
    );
  } else {
    return (
      <>
        <Incomplete>
          <div onClick={() => markComplete()}>
            <p>{text} by {author}</p>
          </div>
        </Incomplete>
      </>
    );
  }
};

export default Posts;
