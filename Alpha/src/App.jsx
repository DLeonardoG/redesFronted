import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router";
import { Login } from "./Components/Login";
import { SignIn } from "./Components/SignIn";
import { Home } from "./Components/Home";
import { UserProvider } from "./UserContext";
import { OtherProfile } from "./Components/OtherProfile";
import { Profile } from "./Components/Profile";
import { Friends } from "./Components/Friends";




export const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/friends" element={<Friends />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/user/:id" element={<OtherProfile />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};
