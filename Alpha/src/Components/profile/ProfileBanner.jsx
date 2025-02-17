import React, { useState } from "react";
import { useNavigate } from "react-router";
import { CreateModal } from "../subComponents/createModal";
import { ProfilePhotoUpdate } from "./ProfilePhotoUpdate";
import { useUser } from "../../UserContext";
import { LogOutButton } from './LogOutIcon'
import { ProfileEditForm } from "./ProfileEditForm";


export const ProfileBanner = () => {
  const navigate = useNavigate();
  const { usuario } = useUser();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    

  if (!usuario) return null; 

  const handleOpenModal = () => setIsCreateModalOpen(true);
  const handleCloseModal = () => setIsCreateModalOpen(false);

  const handleNoti = () => {
    setIsNotificationOpen(true);
  };

  const handleNotiClose = () => {
    setIsNotificationOpen(false);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div
        className="w-full hidden h-40 sm:flex sm:h-30 md:h-34 lg:h-35 bg-gray-700 bg-cover bg-center"
        style={{ backgroundImage: `url(${usuario.banner})` }}
      ></div>

        <div></div>
              <div className='absolute right-4 lg:hidden'>
              <LogOutButton/>
              </div>
      <div className="w-full gap-7 max-w-4xl bg-gray-100 rounded-lg shadow-md -mt-16 p-6 flex flex-col items-center">
        <ProfilePhotoUpdate />

        <div className="text-center mt-4">
          <h3 className="text-2xl font-bold text-gray-900">
            {usuario.name} {usuario.lastname}
          </h3>
          <p className="text-gray-500 text-lg">@{usuario.username}</p>
        </div>

        <div className="flex justify-around w-full max-w-md mt-6 text-center">
          <div className="flex flex-col text-gray-700">
            <span className="text-xl font-semibold">
              {usuario.publications.length}
            </span>
            <span className="text-sm text-gray-500">Posts</span>
          </div>
          <div className="flex flex-col text-gray-700">
            <span className="text-xl font-semibold">
              {usuario.followersIds.length}
            </span>
            <span className="text-sm text-gray-500">Followers</span>
          </div>
          <div className="flex flex-col text-gray-700">
            <span className="text-xl font-semibold">
              {usuario.followingIds.length}
            </span>
            <span className="text-sm text-gray-500">Following</span>
          </div>
        </div>

        <p className="text-gray-700 text-sm text-center mt-4 max-w-2xl">
          {usuario.bio || "Hola, soy un ser humano que le importa."}
        </p>

        <div className="flex gap-4 mt-6">
          <button
            onClick={handleNoti}
            className="bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600 transition duration-300"
          >
            Edit Profile
          </button>
          <button
            onClick={handleOpenModal}
            className="bg-green-500 text-white py-2 px-6 rounded-full hover:bg-green-600 transition duration-300"
          >
            Add Post
          </button>
        </div>
      </div>

      {isCreateModalOpen && (
        <CreateModal onClose={handleCloseModal} usuario={usuario} />
      )}
              {isNotificationOpen && (
        <ProfileEditForm usuario={usuario} onClose={handleNotiClose}/>
      )}
    </div>
  );
};
