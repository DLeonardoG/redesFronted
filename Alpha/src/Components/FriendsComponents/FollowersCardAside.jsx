import React, { useEffect, useState } from 'react';
import AxiosConfiguration from '../../AxiosConfiguration';
import { Button, CircularProgress, useMediaQuery } from '@mui/material';
import { useUser } from '../../UserContext';

export const FollowersCardAside = ({ followerId }) => {
  const { usuario: loggedUser, actualizarUsuario } = useUser();
  const [userInfo, setUserInfo] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useMediaQuery('(max-width: 640px)');

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
          `/follows/unfollow?followerId=${loggedUser.id}&followingId=${followerId}`,
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
    return <div className="text-white p-2 sm:p-4">Cargando...</div>;

  const profileImagePath = userInfo.photo?.startsWith("http")
    ? userInfo.photo
    : `http://localhost:8083/api/publications/images/${userInfo.photo}`;

  return (
    <div className="bg-[#1e2939] rounded-xl shadow-md p-3 sm:p-4 w-full max-w-full sm:max-w-xs mx-auto mb-3 sm:mb-4 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <img
            src={profileImagePath || "/default-profile.png"}
            alt={userInfo.username}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-gray-600 hover:border-gray-400 transition-colors flex-shrink-0"
          />
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm sm:text-base truncate">
              {userInfo.name}
            </p>
            <p className="text-gray-300 text-xs sm:text-sm truncate">
              @{userInfo.username}
            </p>
          </div>
        </div>

        <Button
          onClick={handleFollow}
          variant="contained"
          color={isFollowing ? "error" : "primary"}
          disabled={isLoading}
          sx={{
            textTransform: "none",
            fontSize: isMobile ? '0.6rem' : '0.75rem',
            borderRadius: "8px",
            px: isMobile ? 1 : 1.5,
            py: 0.5,
            minWidth: isMobile ? '75px' : '85px',
            boxShadow: "none",
            transition: "all 0.3s ease",
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            },
          }}
        >
          {isLoading ? (
            <CircularProgress 
              size={isMobile ? 16 : 18} 
              color="inherit" 
              sx={{ mx: 'auto' }}
            />
          ) : isFollowing ? (
            'Dejar de seguir'
          ) : (
            'Seguir'
          )}
        </Button>
      </div>
    </div>
  );
};