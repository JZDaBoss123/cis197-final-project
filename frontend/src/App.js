import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from "react-router-dom";
import socketIOClient from "socket.io-client";
import Todos from "./Todos";

const socket = socketIOClient.connect();

export default function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Home() {
  //can only view todos once logged in.
  const [logged, setLogged] = useState(false);
  const [user, setUser] = useState("");
  const [todos, setTodos] = useState([]);
  const [adding, setAdding] = useState(false);
  const [todoText, setTodoText] = useState("");
  const [fetch, setFetch] = useState(false);
  const [number, setNumber] = useState("");
  let history = useHistory();

  useEffect(async () => {
    const response = await axios.post("/account/isLogged");
    const {
      data: { in: status, user: username },
    } = response;
    setLogged(status);
    setUser(username);
    const res = await axios.get("/api/todos");
    const {
      data: { array },
    } = res;
    setTodos(array);
  }, [fetch]);

  socket.on("update", (data) => {
    setFetch(!fetch);
  });

  const logout = async () => {
    try {
      await axios.post("/account/logout");
      history.push("/login");
    } catch (e) {
      alert(e);
    }
  };

  const sendMsg = async () => {
      console.log(number)
    try {
      await axios.post("/api/todos/send", {
        number: number,
      });
    } catch (e) {
      alert(e);
    }
  };

  const addTodo = async () => {
    try {
      await axios.post("/api/todos/add", {
        todoText: todoText,
        author: user,
      });
      setAdding(false);
    } catch (e) {
      alert(e);
    }
    socket.emit("change", "added todo");
  };

  if (logged) {
    if (adding) {
      return (
        <div>
          <h2>Home</h2>
          <h3>Welcome {user}</h3>
          <button onClick={() => logout()}> Log Out </button>
          <p> Please enter to-do below: </p>
          <input onChange={(e) => setTodoText(e.target.value)} />
          <button onClick={() => addTodo()}> Submit </button>
          <button onClick={() => setAdding(false)}> Cancel </button>
          <h3> Todos: </h3>
          <ul>
            {todos.map((item) => (
              <Todos item={item} socket={socket} />
            ))}
          </ul>
          <p> Please enter phone number below: </p>
          <input onChange={(e) => setNumber(e.target.value)} />
          <button onClick={() => sendMsg()}> Submit </button>
        </div>
      );
    } else {
      return (
        <>
          <div>
            <h2>Home</h2>
            <h3>Welcome {user}</h3>
            <button onClick={() => logout()}> Log Out </button>
          </div>
          <div>
            <button onClick={() => setAdding(true)}> Add a todo! </button>
          </div>
          <h3> Todos: </h3>
          <ul>
            {todos.map((item) => (
              <Todos item={item} socket={socket} />
            ))}
          </ul>
          <p> Please enter phone number below: </p>
          <input onChange={(e) => setNumber(e.target.value)} />
          <button onClick={() => sendMsg()}> Submit </button>
        </>
      );
    }
  } else {
    return (
      <div>
        <h2>Home</h2>
        <h3>
          You are currently not logged in, please press the button below to log
          in.
        </h3>
        <Link to="/login">Log In</Link>
      </div>
    );
  }
}

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  let history = useHistory();

  const signup = async () => {
    try {
      await axios.post("/account/signup", { username, password });
      history.push("/login");
    } catch (e) {
      alert(e);
    }
  };

  return (
    <>
      <h3>If you already have an account, click below to login.</h3>
      <Link to="/login">Log In</Link>
      <h2>Username</h2>
      <input onChange={(e) => setUsername(e.target.value)} />
      <br />
      <h2>Password</h2>
      <input onChange={(e) => setPassword(e.target.value)} />
      <button onClick={() => signup()}> Submit </button>
    </>
  );
}

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  let history = useHistory();

  const signup = async () => {
    try {
      const response = await axios.post("/account/login", {
        username,
        password,
      });
      const {
        data: { code },
      } = response;
      if (code === "success") {
        history.push("/");
      } else {
        alert("no such user!");
      }
    } catch (e) {
      alert(e);
    }
  };

  return (
    <>
      <h3>If you don't have an account, click below to create an account.</h3>
      <Link to="/signup">Sign Up</Link>
      <h2>Username</h2>
      <input onChange={(e) => setUsername(e.target.value)} />
      <br />
      <h2>Password</h2>
      <input onChange={(e) => setPassword(e.target.value)} />
      <button onClick={() => signup()}> Submit </button>
    </>
  );
}
