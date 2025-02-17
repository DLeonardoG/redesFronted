import React, { useState } from 'react';
import {AsideMain } from './subComponents/asideMain';
import '../styles.css';
import { useUser } from '../UserContext';


export const OtherProfile = () => {

  const { usuario } = useUser();

  return (

    <div className=''>
      <div className='h-screen bg-gray-100 hidden lg:grid lg:grid-cols-[1fr_4fr_1fr]'>
        <AsideMain usuario={usuario} />
        <div className='flex flex-col w-full overflow-y-auto'>
            <ProfileBanner usuario={usuario} />
            <ProfilePosts usuario={usuario} />
        </div>
      </div>
    </div>
  )
}
