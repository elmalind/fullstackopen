import styled from "styled-components";

export const FormPanel = styled.div`
  max-width: 420px;
  margin-top: 24px;
  padding: 24px;
  border: 1px solid #d7dde5;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 8px 24px rgba(30, 41, 59, 0.08);
`;

export const FormTitle = styled.h2`
  margin: 0 0 20px;
  color: #172033;
  font-size: 1.5rem;
`;

export const StyledForm = styled.form`
  display: grid;
  gap: 16px;
`;

export const Field = styled.div`
  display: grid;
  gap: 6px;
`;

export const Label = styled.label`
  color: #334155;
  font-size: 0.95rem;
  font-weight: 600;
`;

export const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  border: 1px solid #b8c1cc;
  border-radius: 6px;
  color: #172033;
  font: inherit;

  &:focus {
    outline: 3px solid #dbeafe;
    border-color: #2563eb;
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 4px;
`;

export const Button = styled.button`
  padding: 10px 14px;
  border: 1px solid
    ${({ $variant }) => ($variant === "secondary" ? "#b8c1cc" : "#1d4ed8")};
  border-radius: 6px;
  background: ${({ $variant }) =>
    $variant === "secondary" ? "#ffffff" : "#2563eb"};
  color: ${({ $variant }) => ($variant === "secondary" ? "#172033" : "#ffffff")};
  font: inherit;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: ${({ $variant }) =>
      $variant === "secondary" ? "#f8fafc" : "#1d4ed8"};
  }
`;
