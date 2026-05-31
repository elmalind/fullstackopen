import styled from "styled-components";

const Notice = styled.div`
  margin: 0 0 18px;
  padding: 12px 16px;
  border: 1px solid
    ${({ $type }) => ($type === "error" ? "#f5b5b5" : "#a7d8b1")};
  border-left: 5px solid
    ${({ $type }) => ($type === "error" ? "#dc2626" : "#16a34a")};
  border-radius: 8px;
  background: ${({ $type }) => ($type === "error" ? "#fff1f2" : "#f0fdf4")};
  color: ${({ $type }) => ($type === "error" ? "#991b1b" : "#166534")};
  font-weight: 700;
`;

const Notification = ({ message, type }) => {
  if (message === null) {
    return null;
  }

  return <Notice $type={type}>{message}</Notice>;
};

export default Notification;
