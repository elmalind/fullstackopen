import { useState } from "react";

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{visible ? "hide" : "view"}</button>
      </div>
      {visible && (
        <div>
          <div>url: {blog.url}</div>
          <div>
            likes: {blog.likes}
            <button onClick={() => {}}>like</button>
          </div>
          <div>user: {blog.user?.name || "Unknown"}</div>
        </div>
      )}
    </div>
  );
};

export default Blog;
