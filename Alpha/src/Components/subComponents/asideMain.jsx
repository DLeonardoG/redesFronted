import React, { useState } from "react";
import { useNavigate } from "react-router";
import { CreateModal } from "./createModal";
import { NotificationButton } from '../Nofications/NotificationIcon';


export const NavButton = ({ imagePath, altText, navigateTo, onClick, width = 24, height = 24 }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (navigateTo) {
      navigate(navigateTo);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex flex-col items-center justify-center bg-transparent border-none cursor-pointer text-white transition duration-300 p-2 hover:bg-[#ffffff18]"
    >
      <img src={imagePath} alt={altText} width={width} height={height} />
    </button>
  );
};

export const AsideMain = ({ usuario }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="w-full bg-gray-800 text-gray-200 flex justify-around items-center p-2">
      <NavButton
        imagePath="https://images.vexels.com/media/users/3/223204/isolated/preview/a603755020e70576e1f4a08b012835d4-home-icon-flat-design.png"
        altText="Home Icon"
        navigateTo="/home"
        width={28}
        height={28}
      />
      <NavButton
        imagePath="https://images.emojiterra.com/google/noto-emoji/unicode-16.0/color/1024px/1fac2.png"
        altText="Followers Icon"
        navigateTo="/friends"
        width={28}
        height={28}
      />
      <NavButton
        imagePath="https://static.vecteezy.com/system/resources/thumbnails/018/873/933/small/blue-circle-and-white-plus-add-new-create-symbol-user-interface-theme-3d-icon-rendering-illustration-isolated-png.png"
        altText="Create Icon"
        onClick={handleCreate}
        width={28}
        height={28}
      />
      <NotificationButton usuario={usuario}/>
      <NavButton
        imagePath="https://cdn3d.iconscout.com/3d/premium/thumb/perfil-6335655-5220669.png?f=webp"
        altText="User Photo"
        navigateTo="../profile"
        width={28}
        height={28}
      />

      {isCreateModalOpen && (
        <CreateModal onClose={handleCloseModal} usuario={usuario} />
      )}
    </div>
  );
};