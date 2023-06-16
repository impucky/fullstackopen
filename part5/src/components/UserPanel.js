import { useState } from "react";
import loginService from "../services/login";

const UserPanel = ({ setUser, showMessage, user }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      setUser(user);
      window.localStorage.setItem("blogListUser", JSON.stringify(user));
      loginService.setToken(user.token);
      setUsername("");
      setPassword("");
      showMessage("Successfully logged in", "success");
    } catch (err) {
      if (err.response.status === 401) {
        showMessage("Invalid username or password", "error");
      } else showMessage("Server error", "error");
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("blogListUser");
    setUser(null);
    showMessage("Successfully logged out", "success");
  };

  return user ? (
    <div className="login">
      <span>Logged in as {user.username} </span>
      <button onClick={handleLogout} className="button red">
        Logout
      </button>
    </div>
  ) : (
    <form onSubmit={handleLogin} className="login">
      <div>
        <span>Username </span>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <span>Password </span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="button green">
        Login
      </button>
    </form>
  );
};

export default UserPanel;
