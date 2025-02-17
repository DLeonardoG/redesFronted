import React, { useState } from "react";
import { useNavigate } from "react-router";
import { NavButton } from '../subComponents/asideMain';

export const LogOutButton = ({classes}) => {

    const navigate = useNavigate();
    
    const handleLogout = () => {
        localStorage.removeItem("usuario");
        localStorage.removeItem("authToken");
        navigate("/login");
      };

  return (
    <button
      onClick={handleLogout}
      className="flex flex-col items-center justify-center bg-transparent border-none cursor-pointer text-white transition duration-300 p-2 hover:bg-[#ffffff18]"
    >
      <img src="https://cdn-icons-png.flaticon.com/256/4436/4436646.png" alt="Log out" width="25px" height="25px" />
    </button>
  );
}