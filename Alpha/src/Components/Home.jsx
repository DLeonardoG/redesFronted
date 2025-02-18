import React, { useState } from 'react';
import {AsideMain } from './subComponents/asideMain';
import '../styles.css';
import { useUser } from '../UserContext';
import { FeedPosts } from './subComponents/feedPosts'



export const Home = () => {
    const {usuario} = useUser();
    console.log(usuario);
    return (
        <div className='text-3xl text-blue-100'>
            <AsideMain usuario={usuario} />
            <FeedPosts usuario={usuario} />
        </div>
    )
}