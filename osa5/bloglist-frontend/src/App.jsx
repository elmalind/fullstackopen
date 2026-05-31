import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const [notificationType, setNotificationType] = useState(null);

  const showNotification = (message, type = "success", duration = 5000) => {
    setNotification(message);
    setNotificationType(type);
    setTimeout(() => {
      setNotification(null);
      setNotificationType(null);
    }, duration);
  };

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      showNotification(`Welcome ${user.name}!`, "success");
    } catch {
      showNotification("wrong username/password", "error");
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    blogService.setToken(null);
    setUser(null);
  };

  const updateBlog = (updatedBlog) => {
    setBlogs((blogs) =>
      blogs.map((blog) =>
        blog.id === updatedBlog.id ? { ...updatedBlog, user: blog.user } : blog,
      ),
    );
  };

  const blogFormRef = useRef();

  const addBlog = async (blogObject) => {
    const returnedBlog = await blogService.create(blogObject);

    setBlogs(blogs.concat(returnedBlog));
    showNotification(
      `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
      "success",
    );
    blogFormRef.current.hide();
  };

  if (user === null) {
    return (
      <div>
        <Notification message={notification} type={notificationType} />
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <Notification message={notification} type={notificationType} />
      <h2>blogs</h2>
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm
          onAddBlog={addBlog}
          onCancel={() => blogFormRef.current.hide()}
        />
      </Togglable>
      {blogs
        .sort((a, b) => (b.likes || 0) - (a.likes || 0))
        .map((blog) => (
          <Blog key={blog.id} blog={blog} onUpdate={updateBlog} />
        ))}
    </div>
  );
};

export default App;
