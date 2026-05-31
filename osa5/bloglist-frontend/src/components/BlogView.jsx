import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import blogService from "../services/blogs";
import { Button, ButtonRow } from "./FormStyles";

const BlogPanel = styled.article`
  max-width: 680px;
  margin-top: 24px;
  padding: 28px;
  border: 1px solid #d7dde5;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 8px 24px rgba(30, 41, 59, 0.08);
`;

const Title = styled.h2`
  margin: 0 0 18px;
  color: #172033;
  font-size: 1.75rem;
`;

const DetailList = styled.div`
  display: grid;
  gap: 14px;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #334155;
`;

const Label = styled.span`
  min-width: 72px;
  color: #64748b;
  font-weight: 700;
`;

const BlogLink = styled.a`
  color: #1d4ed8;
  font-weight: 600;
  overflow-wrap: anywhere;

  &:hover {
    color: #1e40af;
  }
`;

const LikeCount = styled.span`
  color: #172033;
  font-weight: 700;
`;

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
    <BlogPanel>
      <Title>
        {blog.title} by {blog.author}
      </Title>
      <DetailList>
        <DetailRow>
          <Label>url</Label>
          <BlogLink href={blog.url}>{blog.url}</BlogLink>
        </DetailRow>
        <DetailRow>
          <Label>likes</Label>
          <LikeCount>likes {blog.likes || 0}</LikeCount>
          {user !== null && <Button onClick={handleLike}>like</Button>}
        </DetailRow>
        {blogUserName && (
          <DetailRow>
            <Label>added by</Label>
            <span>added by {blogUserName}</span>
          </DetailRow>
        )}
        {isOwner && (
          <ButtonRow>
            <Button $variant="secondary" onClick={handleRemove}>
              delete
            </Button>
          </ButtonRow>
        )}
      </DetailList>
    </BlogPanel>
  );
};

export default BlogView;
