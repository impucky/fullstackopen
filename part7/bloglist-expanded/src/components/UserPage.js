import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import userService from "../services/users";

const UserPage = () => {
  const [user, setUser] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    userService.getAll(id).then((users) => setUser(users.find((u) => u.id === id)));
  }, []);

  return (
    user && (
      <>
        <h2>{user.name}</h2>
        {user.blogs.length > 0 ? <h3>Added blogs:</h3> : <p>No blogs added yet</p>}
        {user.blogs.map((blog) => (
          <div key={blog.id} className="blog">
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </div>
        ))}
      </>
    )
  );
};

export default UserPage;
