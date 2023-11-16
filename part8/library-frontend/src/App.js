import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useApolloClient } from "@apollo/client";

const App = () => {
  const [token, setToken] = useState(null);
  const [message, setMessage] = useState("example message");
  const client = useApolloClient();
  const [messageType, setMessageType] = useState("info");

  useEffect(() => {
    console.log("evaluating token...");
    const possibleToken = localStorage.getItem("library-user-token");
    if (possibleToken) {
      setToken(possibleToken);
    }
  }, [token]);

  const notify = (msg, type = "info") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
    notify("You are now logged out");
  };

  const Notify = ({ message }) => {
    let style = {
      border: "1px solid #c9c9c9",
      padding: 10,
      background: "#eee",
      fontFamily: "'Segoe UI', sans-serif",
      borderRadius: 5,
      margin: "10px 0",
    };

    if (messageType === "error") {
      style.color = "red";
    }
    if (!message) {
      return null;
    }
    return <div style={style}>{message}</div>;
  };

  return (
    <Router>
      <div>
        <div>
          <Link style={{ margin: 5 }} to="/">
            authors
          </Link>
          <Link style={{ margin: 5 }} to="/books">
            books
          </Link>
          {token && (
            <Link style={{ margin: 5 }} to="/addbook">
              add book
            </Link>
          )}
          {!token && (
            <Link style={{ margin: 5 }} to="/login">
              login
            </Link>
          )}
          {token && <button onClick={logout}>logout</button>}
        </div>
        <Notify message={message} />
        <Routes>
          <Route path="/" element={<Authors notify={notify} token={token} />} />
          <Route path="/books" element={<Books />} />
          <Route path="/addbook" element={<NewBook notify={notify} />} />
          <Route
            path="/login"
            element={<LoginForm setToken={setToken} notify={notify} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
