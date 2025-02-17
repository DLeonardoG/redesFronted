import React, { useState, useEffect } from "react";
import { useUser } from "../../UserContext";
import AxiosConfiguration from "../../AxiosConfiguration";

export const OtherProfileBanner = ({ usuario }) => {
  const { usuario: loggedUser, actualizarUsuario } = useUser();
  const [follow, setFollow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  console.log(usuario);

  useEffect(() => {
    if (
      loggedUser &&
      loggedUser.followingIds &&
      loggedUser.followingIds.includes(usuario.id)
    ) {
      setFollow(true);
    } else {
      setFollow(false);
    }
  }, [loggedUser, usuario.id]);

  const handleFollow = () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      alert(
        "No se encontró token de autenticación. Por favor, inicia sesión de nuevo."
      );
      return;
    }

    setIsLoading(true);

    if (follow) {
      AxiosConfiguration.delete(
        `/follows/unfollow?followerId=${usuario.id}&followingId=${loggedUser.id}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      )
        .then((response) => {
          setFollow(false);
          const newFollowingIds = loggedUser.followingIds.filter(
            (id) => id !== usuario.id
          );
          const updatedLoggedUser = {
            ...loggedUser,
            followingIds: newFollowingIds,
          };
          actualizarUsuario(updatedLoggedUser);
          alert("¡Has dejado de seguir al usuario!");
        })
        .catch((error) => {
          console.error("Error unfollowing:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      AxiosConfiguration.post(
        "/follows",
        {
          usernameFollowedId: loggedUser.id,
          usernameFollowingId: usuario.id,
          date: new Date().toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
        .then((response) => {
          setFollow(true);
          const newFollowingIds = Array.from(
            new Set([...loggedUser.followingIds, usuario.id])
          );
          const updatedLoggedUser = {
            ...loggedUser,
            followingIds: newFollowingIds,
          };
          actualizarUsuario(updatedLoggedUser);
          alert("¡Usuario seguido con éxito!");
        })
        .catch((error) => {
          console.error("Error following:", error);
          alert("Hubo un error al seguir al usuario. Inténtalo de nuevo.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  // Asegúrate de que la imagen tenga la URL completa
  const profileImagePath = usuario.photo.startsWith("http")
    ? usuario.photo
    : `http://localhost:8083/api/publications/images/${usuario.photo}`;

  return (
    <div className="w-full flex flex-col items-center">
      <div
        className="w-full hidden h-40 sm:flex sm:h-56 md:h-64 lg:h-50 bg-gray-700 bg-cover bg-center"
        style={{ backgroundImage: `url(${usuario.banner})` }}
      ></div>

      <div className="w-full gap-7 max-w-4xl bg-gray-100 rounded-lg shadow-md -mt-16 p-6 flex flex-col items-center">
        <button className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden">
          <img
            src={profileImagePath}
            alt={`${usuario.name} ${usuario.lastname}`}
            className="w-full h-full object-cover"
          />
        </button>

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
            onClick={handleFollow}
            disabled={isLoading}
            className={`bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600 transition duration-300 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Cargando..." : follow ? "Unfollow" : "Follow"}
          </button>
        </div>
      </div>
    </div>
  );
};
