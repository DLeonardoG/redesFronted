import React, { useState } from 'react';
import {AsideMain } from './subComponents/asideMain';
import '../styles.css';
import { useUser } from '../UserContext';


export const Profile = () => {

  const { usuario } = useUser();

  return (

    <div className=''>
      <div className='h-screen bg-gray-100'>
        <AsideMain usuario={usuario} />
        Profile
        {/* <div className='flex flex-col w-full overflow-y-auto'>
            <ProfileBanner usuario={usuario} />
            <ProfilePosts usuario={usuario} />
        </div> */}
      </div>
    </div>
  )
}
