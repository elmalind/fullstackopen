import { useState } from "react";
import blogService from "../services/blogs";

const Blog = ({ blog, onUpdate }) => {
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

  const handleLike = async () => {
    const updatedBlog = {
      user: typeof blog.user === "string" ? blog.user : blog.user.id,
      likes: (blog.likes || 0) + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    };

    const returnedBlog = await blogService.update(blog.id, updatedBlog);
    onUpdate(returnedBlog);
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
            likes: {blog.likes || 0}
            <button onClick={handleLike}>like</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
