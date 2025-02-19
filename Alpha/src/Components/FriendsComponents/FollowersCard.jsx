import { useEffect, useState } from "react";
import AxiosConfiguration from "../../AxiosConfiguration";
import { useUser } from "../../UserContext";

export const FollowersCard = ({ followerId }) => {
  const { usuario: loggedUser, actualizarUsuario } = useUser();
  const [userInfo, setUserInfo] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await AxiosConfiguration.get(`/users/${followerId}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setUserInfo(response.data);
      } catch (error) {
        console.error("Error fetching follower info:", error);
      }
    };

    fetchUserInfo();
  }, [followerId]);

  useEffect(() => {
    setIsFollowing(loggedUser?.followingIds?.includes(followerId));
  }, [loggedUser, followerId]);

  const handleFollow = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      alert("¡Necesitas iniciar sesión!");
      return;
    }

    setIsLoading(true);

    try {
      if (isFollowing) {
        await AxiosConfiguration.delete(
          `/follows/unfollow?followerId=${loggedUser.id}&followingId=${followerId.id}`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );

        actualizarUsuario({
          ...loggedUser,
          followingIds: loggedUser.followingIds.filter((id) => id !== followerId),
        });
      } else {
        await AxiosConfiguration.post(
          "/follows",
          {
            usernameFollowedId: followerId,
            usernameFollowingId: loggedUser.id,
            date: new Date().toISOString(),
          },
          { headers: { Authorization: `Bearer ${authToken}` } }
        );

        actualizarUsuario({
          ...loggedUser,
          followingIds: [...loggedUser.followingIds, followerId],
        });
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error al gestionar seguimiento:", error);
      alert("Error en la operación");
    } finally {
      setIsLoading(false);
    }
  };

  if (!userInfo)
    return <div className="text-white p-4">Cargando...</div>;

  const profileImagePath = userInfo.photo;

  return (
    <div className="bg-[#1e2939] rounded-2xl shadow-lg p-5 w-full max-w-md mx-auto mb-6 hover:shadow-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={profileImagePath || "/default-profile.png"}
            alt={userInfo.username}
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-600 hover:border-gray-400 transition-colors"
          />
          <div>
            <p className="text-white font-bold text-xl">{userInfo.name}</p>
            <p className="text-gray-300 text-sm">@{userInfo.username}</p>
          </div>
        </div>

        <button
          onClick={handleFollow}
          className={`${
            isFollowing ? "bg-red-500" : "bg-blue-500"
          } text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 hover:shadow-md flex items-center justify-center`}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-4 border-t-4 border-white border-solid rounded-full animate-spin"></div>
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
