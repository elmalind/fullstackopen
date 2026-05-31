import { useState } from "react";

const BlogForm = ({ onAddBlog, hideForm }) => {
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
    hideForm();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        title
        <input
          type="text"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author
        <input
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url
        <input
          type="text"
          value={url}
          name="Url"
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type="submit">create</button>
      <button type="button" onClick={hideForm}>
        cancel
      </button>
    </form>
  );
};

export default BlogForm;
