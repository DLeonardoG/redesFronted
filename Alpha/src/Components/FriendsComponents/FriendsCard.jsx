import { useEffect, useState } from "react";
import AxiosConfiguration from "../../AxiosConfiguration";
import { useUser } from "../../UserContext";

export const FriendsCard = ({ usuario }) => {
  const { usuario: loggedUser, actualizarUsuario } = useUser();
  const [userInfo, setUserInfo] = useState(null);
  const [isFollowing, setIsFollowing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await AxiosConfiguration.get(`/users/${usuario.id}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setUserInfo(response.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, [usuario.id]);

  useEffect(() => {
    setIsFollowing(loggedUser?.followingIds?.includes(usuario.id) || false);
  }, [loggedUser, usuario.id]);

  const handleFollow = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      alert("No se encontró token de autenticación. Por favor, inicia sesión de nuevo.");
      return;
    }

    setIsLoading(true);
    try {
      if (isFollowing) {
        await AxiosConfiguration.delete(
          `/follows/unfollow?followerId=${usuario.id}&followingId=${loggedUser.id}`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        setIsFollowing(false);
        actualizarUsuario({
          ...loggedUser,
          followingIds: loggedUser.followingIds.filter((id) => id !== usuario.id),
        });
        alert("¡Has dejado de seguir al usuario!");
      } else {
        await AxiosConfiguration.post(
          "/follows",
          {
            usernameFollowedId: loggedUser.id,
            usernameFollowingId: usuario.id,
            date: new Date().toISOString(),
          },
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        setIsFollowing(true);
        actualizarUsuario({
          ...loggedUser,
          followingIds: Array.from(new Set([...loggedUser.followingIds, usuario.id])),
        });
        alert("¡Usuario seguido con éxito!");
      }
    } catch (error) {
      console.error("Error al seguir/dejar de seguir:", error);
      alert("Hubo un error. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!userInfo) {
    return <p className="text-white text-center p-4">Cargando...</p>;
  }

  // Construir la URL de la imagen de perfil
  const profileImagePath = userInfo.photo;

  return (
    <div className="bg-[#1e2939] rounded-2xl shadow-lg p-6 w-full max-w-md mx-auto mb-6 transition-transform transform hover:scale-105 hover:shadow-2xl">
      <div className="flex flex-col items-center">
        <img
          src={profileImagePath || "https://cdn-icons-png.flaticon.com/512/4519/4519678.png"}
          alt={userInfo.username}
          className="w-24 h-24 rounded-full object-cover border-4 border-gray-500 shadow-md transition-all hover:border-gray-400"
        />
        <h2 className="text-white text-xl font-bold mt-4">{userInfo.name}</h2>
        <p className="text-gray-300 text-sm">@{userInfo.username}</p>
      </div>

      <div className="mt-4 flex justify-center">
        <button
          onClick={handleFollow}
          disabled={isLoading}
          className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
            isFollowing
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          } ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : isFollowing ? (
            "Unfollow"
          ) : (
            "Follow"
          )}
        </button>
      </div>
    </div>
  );
};