import React, { useState } from "react";
import axios from "axios";
import s from "styled-components";

const Incomplete = s.p`
    text-align: center;
    background-color: green;
`;

const Complete = s.p`
    text-align: center;
    background-color: grey;
`;

const Posts = (props) => {
  const { item } = props;
  const { text, author, done, _id } = item;

  const markComplete = async () => {
    try {
      await axios.post("/api/todos/complete", { _id });
    } catch (e) {
      alert(e);
    }
  };

  const markIncomplete = async () => {
    try {
      await axios.post("/api/todos/incomplete", { _id });
    } catch (e) {
      alert(e);
    }
  };

  const deleteTodo = async () => {
    try {
      await axios.post("/api/todos/delete", { _id });
    } catch (e) {
      alert(e);
    }
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
