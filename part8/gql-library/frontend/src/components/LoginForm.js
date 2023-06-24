import { useState, useEffect } from "react";
import { useMutation, useApolloClient } from "@apollo/client";
import { LOGIN } from "../queries";

const LoginForm = ({ token, setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const client = useApolloClient();

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      console.log(error);
    },
  });

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem("library-user-token", token);
    }
  }, [result.data]); // eslint-disable-line

  const submit = async (e) => {
    e.preventDefault();
    await login({ variables: { username, password } });
  };

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  return (
    <>
      {token ? (
        <button onClick={logout}>logout</button>
      ) : (
        <form onSubmit={submit}>
          username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}></input>
          password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          <button type="submit">login</button>
        </form>
      )}
    </>
  );
};

export default LoginForm;
