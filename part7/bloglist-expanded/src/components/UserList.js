import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import userService from "../services/users";

const UserList = () => {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    userService.getAll().then((users) => {
      setUsers(users);
    });
  }, []);

  return (
    <div>
      <h2>Users</h2>
      {users &&
        users.map((user) => (
          <div key={user.id}>
            <Link to={`/users/${user.id}`}>{user.name}</Link> - {user.blogs.length}
          </div>
        ))}
    </div>
  );
};

export default UserList;
