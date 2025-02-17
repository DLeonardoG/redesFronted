import React, { useState } from 'react';
import {AsideMain } from './subComponents/asideMain';
import { useUser } from '../UserContext';
import { ProfileBanner } from './profile/ProfileBanner'
import { ProfilePosts } from './profile/ProfilePosts'



export const Profile = () => {

  const { usuario } = useUser();

  return (

    <div className=''>
      <div className='h-screen bg-gray-100'>
        <AsideMain usuario={usuario} />
        <ProfileBanner usuario={usuario} />
        <ProfilePosts usuario={usuario} />
      </div>
    </div>
  )
}
