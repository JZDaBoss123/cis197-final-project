import React, { useState } from "react";
import axios from "axios";

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

  if (done) {
    return (
      <>
        <p>hi</p>
      </>
    );
  } else {
    return (
      <>
        <div onClick = {() => markComplete()}>
          <p>{text}</p>
          <ul>
            <li>Added by {author} </li>
          </ul>
        </div>
      </>
    );
  }
};

export default Posts;
