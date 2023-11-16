import { useState, useEffect } from "react";
import { LOGIN } from "../queries";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ setToken, notify }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      notify(error.graphQLErrors[0].message, "error");
      console.log(error.graphQLErrors[0].message);
    },
  });

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      console.log("setting token...", token);
      setToken(token);
      localStorage.setItem("library-user-token", token);
      navigate("/");
      notify("Login successful", "info");
    }
  }, [result.data]);

  const submit = (e) => {
    e.preventDefault();
    login({ variables: { username, password } });
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div>
          username <br />
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password <br />
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
