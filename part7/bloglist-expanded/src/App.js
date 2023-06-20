import { Routes, Route, Link, useMatch } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { useQuery } from "react-query";
import "./index.css";

import Blog from "./components/Blog";
import UserPanel from "./components/UserPanel";
import UserList from "./components/UserList";
import UserPage from "./components/UserPage";
import NewBlogForm from "./components/NewBlogForm";
import Notification from "./components/Notification";

import UserContext from "./context/UserContext";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [user, setUser] = useContext(UserContext);
  const [matchedBlog, setMatchedBlog] = useState(null);

  const blogs = useQuery("blogs", blogService.getAll, {
    refetchOnWindowFocus: false,
  });

  const match = useMatch("/blogs/:id");

  useEffect(() => {
    const loggedUser = window.localStorage.getItem("blogListUser");
    if (loggedUser) {
      const user = JSON.parse(loggedUser);
      setUser(user);
      loginService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    if (match && blogs.data) {
      setMatchedBlog(blogs.data.find((blog) => blog.id === match.params.id));
    }
  }, [blogs]);

  return (
    <>
      <Notification />
      <UserPanel setUser={setUser} user={user} />
      <main>
        <Routes>
          <Route
            path="/"
            element={
              user && (
                <>
                  <NewBlogForm />
                  <h1>Blogs</h1>
                  {blogs.data &&
                    blogs.data.map((blog) => (
                      <div key={blog.id} className="blog">
                        <Link to={`blogs/${blog.id}`}>{blog.title}</Link> - <i>{blog.author}</i>
                      </div>
                    ))}
                </>
              )
            }
          />
          <Route path="/users" element={<UserList />} />
          <Route path="/users/:id" element={<UserPage />} />
          <Route path="/blogs/:id" element={<Blog blog={matchedBlog} user={user} />} />
        </Routes>
      </main>
    </>
  );
};

export default App;
