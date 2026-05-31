import { useState } from "react";
import blogService from "../services/blogs";

const Blog = ({ blog, user, onUpdate, onRemove }) => {
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

  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      onRemove(blog);
    }
  };

  const blogUserId = typeof blog.user === "string" ? blog.user : blog.user?.id;
  const blogUserName =
    typeof blog.user === "string" ? blog.user : blog.user?.name;
  const isOwner =
    (blogUserId && user.id && blogUserId === user.id) ||
    (typeof blog.user !== "string" && blog.user?.username === user.username);

  return (
    <div style={blogStyle} data-testid="blog">
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
          {blogUserName && <div>added by {blogUserName}</div>}
          {isOwner && <button onClick={handleRemove}>delete</button>}
        </div>
      )}
    </div>
  );
};

export default Blog;
