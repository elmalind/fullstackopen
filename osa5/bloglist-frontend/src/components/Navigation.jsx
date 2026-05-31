import { Link } from "react-router-dom";
import styled from "styled-components";

const Bar = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
  padding: 12px 16px;
  border-bottom: 1px solid #d7dde5;
  background: #ffffff;
  box-shadow: 0 2px 12px rgba(30, 41, 59, 0.06);
`;

const LinkGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const NavLink = styled(Link)`
  color: #1d4ed8;
  font-weight: 700;
  text-decoration: none;

  &:hover {
    color: #1e40af;
    text-decoration: underline;
  }
`;

const UserArea = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #334155;
`;

const LogoutButton = styled.button`
  padding: 7px 11px;
  border: 1px solid #b8c1cc;
  border-radius: 6px;
  background: #ffffff;
  color: #172033;
  font: inherit;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #f8fafc;
  }
`;

const Navigation = ({ user, onLogout }) => (
  <Bar>
    <LinkGroup>
      <NavLink to="/">blogs</NavLink>
      {user === null ? (
        <NavLink to="/login">login</NavLink>
      ) : (
        <NavLink to="/create">create new blog</NavLink>
      )}
    </LinkGroup>
    {user !== null && (
      <UserArea>
        <span>{user.name} logged in</span>
        <LogoutButton onClick={onLogout}>logout</LogoutButton>
      </UserArea>
    )}
  </Bar>
);

export default Navigation;
