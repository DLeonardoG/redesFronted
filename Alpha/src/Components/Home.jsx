import React, { useState } from 'react';
import {AsideMain } from './subComponents/asideMain';
import '../styles.css';
import { useUser } from '../UserContext';


export const Home = () => {
    const {usuario} = useUser();
    console.log(usuario);
    return (
        <div className='text-3xl text-blue-100'>
            <AsideMain usuario={usuario} />
            
            <h1>Bienvenido {usuario.name}</h1>
        </div>
    )
}