import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Link,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Blog from "./components/Blog";
import BlogView from "./components/BlogView";
import Notification from "./components/Notification";
import BlogForm from "./components/BlogForm";
import blogService from "./services/blogs";
import loginService from "./services/login";

const Navigation = ({ user, onLogout }) => {
  const padding = {
    paddingRight: 5,
  };

  return (
    <div>
      <Link style={padding} to="/">
        blogs
      </Link>
      {user === null ? (
        <Link style={padding} to="/login">
          login
        </Link>
      ) : (
        <>
          <Link style={padding} to="/create">
            create new blog
          </Link>
          {user.name} logged in
          <button onClick={onLogout}>logout</button>
        </>
      )}
    </div>
  );
};

const LoginForm = ({
  username,
  password,
  onUsernameChange,
  onPasswordChange,
  onLogin,
}) => (
  <div>
    <h2>Log in to application</h2>
    <form onSubmit={onLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={onUsernameChange}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={onPasswordChange}
        />
      </div>
      <button type="submit">login</button>
    </form>
  </div>
);

const BlogList = ({ blogs }) => (
  <div>
    <h2>blogs</h2>
    {[...blogs]
      .sort((a, b) => (b.likes || 0) - (a.likes || 0))
      .map((blog) => <Blog key={blog.id} blog={blog} />)}
  </div>
);

const CreateBlogView = ({ user, onAddBlog }) => {
  const navigate = useNavigate();

  if (user === null) {
    return <Navigate replace to="/login" />;
  }

  return (
    <div>
      <h2>create new blog</h2>
      <BlogForm onAddBlog={onAddBlog} onCancel={() => navigate("/")} />
    </div>
  );
};

const AppContent = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const [notificationType, setNotificationType] = useState(null);
  const navigate = useNavigate();

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
      navigate("/");
    } catch {
      showNotification("wrong username/password", "error");
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    blogService.setToken(null);
    setUser(null);
    navigate("/");
  };

  const updateBlog = (updatedBlog) => {
    setBlogs((blogs) =>
      blogs.map((blog) =>
        blog.id === updatedBlog.id ? { ...updatedBlog, user: blog.user } : blog,
      ),
    );
  };

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject);

      setBlogs(
        blogs.concat({
          ...returnedBlog,
          user: {
            id: user.id || returnedBlog.user,
            username: user.username,
            name: user.name,
          },
        }),
      );
      showNotification(
        `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
        "success",
      );
      navigate("/");
    } catch (error) {
      if (error.response?.status === 401) {
        window.localStorage.removeItem("loggedBlogappUser");
        blogService.setToken(null);
        setUser(null);
        navigate("/login");
        showNotification("session expired, please log in again", "error");
      } else {
        showNotification("creating blog failed", "error");
      }

      throw error;
    }
  };

  const removeBlog = async (blog) => {
    try {
      await blogService.remove(blog.id);
      setBlogs((blogs) => blogs.filter((listedBlog) => listedBlog.id !== blog.id));
      showNotification(`removed blog ${blog.title} by ${blog.author}`, "success");
    } catch {
      showNotification(`removing blog ${blog.title} failed`, "error");
    }
  };

  return (
    <div>
      <Navigation user={user} onLogout={handleLogout} />
      <Notification message={notification} type={notificationType} />
      <Routes>
        <Route
          path="/"
          element={
            <BlogList blogs={blogs} />
          }
        />
        <Route
          path="/create"
          element={<CreateBlogView user={user} onAddBlog={addBlog} />}
        />
        <Route
          path="/blogs/:id"
          element={
            <BlogView
              blogs={blogs}
              user={user}
              onUpdate={updateBlog}
              onRemove={removeBlog}
            />
          }
        />
        <Route
          path="/login"
          element={
            user === null ? (
              <LoginForm
                username={username}
                password={password}
                onUsernameChange={({ target }) => setUsername(target.value)}
                onPasswordChange={({ target }) => setPassword(target.value)}
                onLogin={handleLogin}
              />
            ) : (
              <Navigate replace to="/" />
            )
          }
        />
      </Routes>
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
