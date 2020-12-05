import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from "react-router-dom";

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
  const [logged, setLogged] = useState(false);
  const [user, setUser] = useState("");
  const [questions, setQuestions] = useState([]);
  const [asking, setAsking] = useState(false);
  const [qText, setText] = useState("");
  let history = useHistory();

  useEffect(async () => {
    const response = await axios.post("/account/isLogged");
    const {
      data: { in: status, user: username },
    } = response;
    setLogged(status);
    setUser(username);
    const intervalID = setInterval(async () => {
      const res = await axios.get("/api/questions");
      const {
        data: { array },
      } = res;
      setQuestions(array);
    }, 2000);
    return () => clearInterval(intervalID);
  }, []);

  const logout = async () => {
    try {
      await axios.post("/account/logout");
      history.push("/login");
    } catch (e) {
      alert(e);
    }
  };

  const askQ = async () => {
    try {
      await axios.post("/api/questions/add", {
        questionText: qText,
        author: user,
      });
      setAsking(false);
    } catch (e) {
      alert(e);
    }
  };

  if (logged) {
    if (asking) {
      return (
        <div>
          <h2>Home</h2>
          <h3>Welcome {user}</h3>
          <button onClick={() => logout()}> Log Out </button>
          <h3> Questions: </h3>
          <Wrapper>
            <h3>Text: </h3>
            <input onChange={(e) => setText(e.target.value)} />
            <button onClick={() => askQ()}> Submit </button>
            <button onClick={() => setAsking(false)}> Cancel </button>
          </Wrapper>
          <ul>
            {questions.map((item) => (
              <Posts item={item} />
            ))}
          </ul>
        </div>
      );
    } else {
      return (
        <div>
          <h2>Home</h2>
          <h3>Welcome {user}</h3>
          <button onClick={() => logout()}> Log Out </button>
          <h3> Questions: </h3>
          <Wrapper>
            <button onClick={() => setAsking(true)}> Ask a question! </button>
          </Wrapper>
          <ul>
            {questions.map((item) => (
              <Posts item={item} />
            ))}
          </ul>
        </div>
      );
    }
  } else {
    return (
      <div>
        <h2>Home</h2>
        <Link to="/login">Log In</Link>
        <h3> Questions: </h3>
        <ul>
          {questions.map((item) => (
            <PostsView item={item} />
          ))}
        </ul>
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
      history.push("/");
    } catch (e) {
      alert(e);
    }
  };

  return (
    <>
      <ul>
        <li>
          <Link to="/login">Log In</Link>
        </li>
      </ul>
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
      <ul>
        <li>
          <Link to="/signup">Sign Up</Link>
        </li>
      </ul>
      <h2>Username</h2>
      <input onChange={(e) => setUsername(e.target.value)} />
      <br />
      <h2>Password</h2>
      <input onChange={(e) => setPassword(e.target.value)} />
      <button onClick={() => signup()}> Submit </button>
    </>
  );
}
