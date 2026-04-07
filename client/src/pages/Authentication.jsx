import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { UserLogin, UserRegister } from "../utils/api";
import { useUser } from "../context/UserContext";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  padding: 20px;
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 20px;
  padding: 48px 40px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  margin-bottom: 32px;
  color: #9000ff;
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.5px;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #1a1a2e;
  text-align: center;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #6b7280;
  text-align: center;
  margin-bottom: 28px;
`;

const InputWrapper = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  font-family: "Inter", sans-serif;
  outline: none;
  transition: border-color 0.2s;
  &:focus {
    border-color: #9000ff;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 13px;
  background: linear-gradient(90deg, #9000ff, #c050ff);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  font-family: "Inter", sans-serif;
  cursor: pointer;
  margin-top: 8px;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  &:hover {
    opacity: 0.9;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Toggle = styled.p`
  text-align: center;
  font-size: 13px;
  color: #6b7280;
  margin-top: 20px;
  span {
    color: #9000ff;
    font-weight: 600;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMsg = styled.p`
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fca5a5;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
  margin-bottom: 16px;
`;

const Authentication = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isSignup) {
      if (!form.name.trim()) return setError("Name is required.");
      if (form.password !== form.confirmPassword)
        return setError("Passwords do not match.");
      if (form.password.length < 6)
        return setError("Password must be at least 6 characters.");
    }

    setLoading(true);
    try {
      let res;
      if (isSignup) {
        res = await UserRegister({
          name: form.name,
          email: form.email,
          password: form.password,
        });
      } else {
        res = await UserLogin({ email: form.email, password: form.password });
      }
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Logo>
          <FitnessCenterIcon style={{ fontSize: 32 }} />
          FitnessTrack
        </Logo>
        <Title>{isSignup ? "Create Account" : "Welcome Back!"}</Title>
        <Subtitle>
          {isSignup
            ? "Start your fitness journey today"
            : "Sign in to continue your progress"}
        </Subtitle>

        {error && <ErrorMsg>{error}</ErrorMsg>}

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <InputWrapper>
              <Label>Full Name</Label>
              <Input
                type="text"
                name="name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                required
              />
            </InputWrapper>
          )}
          <InputWrapper>
            <Label>Email Address</Label>
            <Input
              type="email"
              name="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </InputWrapper>
          <InputWrapper>
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </InputWrapper>
          {isSignup && (
            <InputWrapper>
              <Label>Confirm Password</Label>
              <Input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </InputWrapper>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? (
              <CircularProgress size={18} color="inherit" />
            ) : isSignup ? (
              "Create Account"
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <Toggle>
          {isSignup ? "Already have an account? " : "Don't have an account? "}
          <span onClick={() => { setIsSignup(!isSignup); setError(""); }}>
            {isSignup ? "Sign In" : "Sign Up"}
          </span>
        </Toggle>
      </Card>
    </Container>
  );
};

export default Authentication;
