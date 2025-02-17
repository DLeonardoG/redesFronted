import React, { useEffect, useState } from "react";
import { useUser } from "../UserContext";
import AxiosConfiguration from "../AxiosConfiguration";
import { useParams } from "react-router";
import {AsideMain } from './subComponents/asideMain';
import { ProfilePosts } from './profile/ProfilePosts'
import { OtherProfileBanner } from './OtherProfileComponents/OtherProfileBanner'


export const OtherProfile = () => {
  const {usuario} = useUser();
  const { id } = useParams();
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const token = localStorage.getItem('authToken');

    AxiosConfiguration.get(`users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setSelectedUser(response.data); 
      })
      .catch((error) => {
        console.error('Error obteniendo el perfil del usuario:', error);
        setError(error);
      })
      .finally(() => {
        setLoading(false); 
      });
  }, [id]);

  if (loading) {
    return <p>Cargando perfil...</p>;
  }

  if (error) {
    return <p>Error al cargar el perfil.</p>;
  }

  if (!selectedUser) {
    return <p>Usuario no encontrado.</p>;
  }

  return (

    <>
        <div className=''>
          <div className='h-screen bg-gray-100'>
            <AsideMain usuario={usuario} />
            <OtherProfileBanner usuario={selectedUser}/>
            <ProfilePosts usuario={selectedUser} />
          </div>
        </div>
    </>
  );
};