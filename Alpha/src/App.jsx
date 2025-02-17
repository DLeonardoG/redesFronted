import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router";
import { Login } from "./Components/Login";
import { SignIn } from "./Components/SignIn";
import { Home } from "./Components/Home";
import { UserProvider } from "./UserContext";


export const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};
