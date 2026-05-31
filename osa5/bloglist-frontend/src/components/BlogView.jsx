import { useNavigate, useParams } from "react-router-dom";
import blogService from "../services/blogs";

const BlogView = ({ blogs, user, onUpdate, onRemove }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const blog = blogs.find((blog) => blog.id === id);

  if (!blog) {
    return <div>blog not found</div>;
  }

  const handleLike = async () => {
    if (user === null) {
      return;
    }

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

  const handleRemove = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      await onRemove(blog);
      navigate("/");
    }
  };

  const blogUserId = typeof blog.user === "string" ? blog.user : blog.user?.id;
  const blogUserName =
    typeof blog.user === "string" ? blog.user : blog.user?.name;
  const isOwner =
    user !== null &&
    ((blogUserId && user.id && blogUserId === user.id) ||
      (typeof blog.user !== "string" && blog.user?.username === user.username));

  return (
    <div>
      <h2>
        {blog.title} by {blog.author}
      </h2>
      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>
      <div>
        likes {blog.likes || 0}
        {user !== null && <button onClick={handleLike}>like</button>}
      </div>
      {blogUserName && <div>added by {blogUserName}</div>}
      {isOwner && <button onClick={handleRemove}>delete</button>}
    </div>
  );
};

export default BlogView;
