import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Authentication from "./pages/Authentication";
import Dashboard from "./pages/Dashboard";
import { useUser } from "./context/UserContext";
import { UserProvider } from "./context/UserContext";

const theme = createTheme({
  palette: {
    primary: { main: "#9000ff" },
    secondary: { main: "#ff4d4d" },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
});

const AppRoutes = () => {
  const { currentUser } = useUser();
  return (
    <Routes>
      <Route
        path="/"
        element={
          currentUser ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/login"
        element={
          currentUser ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Authentication />
          )
        }
      />
      <Route
        path="/dashboard"
        element={currentUser ? <Dashboard /> : <Navigate to="/login" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <UserProvider>
          <AppRoutes />
        </UserProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
