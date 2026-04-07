import React from "react";
import styled from "styled-components";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import LogoutIcon from "@mui/icons-material/Logout";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Nav = styled.nav`
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.06);
`;

const Inner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 800;
  color: #9000ff;
  letter-spacing: -0.3px;
  cursor: pointer;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const UserName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`;

const LogoutBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fca5a5;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  font-family: "Inter", sans-serif;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #fee2e2;
  }
`;

const Navbar = () => {
  const { currentUser, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Nav>
      <Inner>
        <Brand onClick={() => navigate("/dashboard")}>
          <FitnessCenterIcon style={{ fontSize: 28 }} />
          FitnessTrack
        </Brand>
        <Right>
          {currentUser && (
            <>
              <UserName>Hi, {currentUser.name?.split(" ")[0]} 👋</UserName>
              <LogoutBtn onClick={handleLogout}>
                <LogoutIcon style={{ fontSize: 16 }} />
                Logout
              </LogoutBtn>
            </>
          )}
        </Right>
      </Inner>
    </Nav>
  );
};

export default Navbar;
