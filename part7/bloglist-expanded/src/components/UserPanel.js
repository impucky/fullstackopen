import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNotify } from "../context/NotificationContext";
import UserContext from "../context/UserContext";
import loginService from "../services/login";

const UserPanel = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useContext(UserContext);
  const navigate = useNavigate();
  const notifyWith = useNotify();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      setUser(user);
      window.localStorage.setItem("blogListUser", JSON.stringify(user));
      loginService.setToken(user.token);
      setUsername("");
      setPassword("");
      notifyWith(["Successfully logged in", "success"]);
    } catch (err) {
      if (err.response.status === 401) {
        return notifyWith(["Invalid username or password", "error"]);
      } else return notifyWith(["Server error", "error"]);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("blogListUser");
    setUser(null);
    notifyWith(["Successfully logged out", "success"]);
    navigate("/");
  };

  return user ? (
    <div className="login">
      <div>
        <Link to="/">blogs</Link> <Link to="/users">users</Link>
      </div>
      <div>
        <span>Logged in as {user.username} </span>
        <button onClick={handleLogout} className="button red">
          Logout
        </button>
      </div>
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
