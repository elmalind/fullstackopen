import { useState } from "react";
import {
  Button,
  ButtonRow,
  Field,
  Input,
  Label,
  StyledForm,
} from "./FormStyles";

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
    <StyledForm onSubmit={handleSubmit}>
      <Field>
        <Label htmlFor="blog-title">title</Label>
        <Input
          id="blog-title"
          type="text"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
        />
      </Field>
      <Field>
        <Label htmlFor="blog-author">author</Label>
        <Input
          id="blog-author"
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </Field>
      <Field>
        <Label htmlFor="blog-url">url</Label>
        <Input
          id="blog-url"
          type="text"
          value={url}
          name="Url"
          onChange={({ target }) => setUrl(target.value)}
        />
      </Field>
      <ButtonRow>
        <Button type="submit">create</Button>
        <Button type="button" $variant="secondary" onClick={onCancel}>
          cancel
        </Button>
      </ButtonRow>
    </StyledForm>
  );
};

export default BlogForm;
