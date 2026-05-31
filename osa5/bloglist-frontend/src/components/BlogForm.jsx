import { useState } from "react";

const BlogForm = ({ onAddBlog, onCancel }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const blogObject = {
      title,
      author,
      url,
    };

    await onAddBlog(blogObject);

    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="blog-title">title</label>
        <input
          id="blog-title"
          type="text"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        <label htmlFor="blog-author">author</label>
        <input
          id="blog-author"
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        <label htmlFor="blog-url">url</label>
        <input
          id="blog-url"
          type="text"
          value={url}
          name="Url"
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type="submit">create</button>
      <button type="button" onClick={onCancel}>
        cancel
      </button>
    </form>
  );
};

export default BlogForm;
