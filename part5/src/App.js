import { useState, useEffect } from "react";
import "./index.css";

import Blog from "./components/Blog";
import UserPanel from "./components/UserPanel";
import NewBlogForm from "./components/NewBlogForm";
import Message from "./components/Message";

import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState({
    content: "",
    type: "",
  });

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUser = window.localStorage.getItem("blogListUser");
    if (loggedUser) {
      const user = JSON.parse(loggedUser);
      setUser(user);
      loginService.setToken(user.token);
    }
  }, []);

  const showMessage = (content, type) => {
    setMessage({ content, type });
    setTimeout(() => {
      setMessage({ content, type: "" });
    }, 3000);
  };

  const updateBlogs = (createdBlog) => {
    setBlogs(blogs.concat(createdBlog));
    showMessage(`Created blog "${createdBlog.title}"`, "success");
  };

  return (
    <>
      <Message {...message} />
      <UserPanel setUser={setUser} showMessage={showMessage} user={user} />
      <main>
        {user && <NewBlogForm updateBlogs={updateBlogs} />}
        <h1>Blogs</h1>
        {user && blogs.map((blog) => <Blog key={blog.id} blog={blog} />)}
      </main>
    </>
  );
};

export default App;
