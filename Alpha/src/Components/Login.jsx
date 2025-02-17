import React, { useState } from 'react';
import '../styles.css';
import { useNavigate } from 'react-router';
import { useUser } from '../UserContext';
import AxiosConfiguration from '../AxiosConfiguration';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { actualizarUsuario } = useUser();

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
    
        AxiosConfiguration.post('login', null, {
            params: { email, password },
        })
            .then((response) => {
                const { token, id, name, lastname, email, username, photo, bio, publications, followersIds, followingIds} = response.data;
    
                console.log('Login successful:', response.data);
    
                localStorage.clear();
    
                localStorage.setItem('authToken', token);
    
                actualizarUsuario({
                    id,
                    name,
                    lastname,
                    email,
                    username,
                    photo,
                    bio,
                    publications,
                    followersIds, 
                    followingIds
                });
    
                alert('Welcome!');
                navigate('/home');
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    alert('Error: Usuario o contraseña incorrectos.');
                } else {
                    console.error('Error de conexión:', error);
                    alert('Hubo un problema al intentar conectarse con el servidor.');
                }
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email') {
            setEmail(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-700 to-black bg-[length:200%_200%]"></div>
            <div className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-lg max-w-sm w-full text-white relative z-10">
                <h1 className="text-2xl font-bold text-center">Login</h1>
                <form className="flex flex-col space-y-4 gap-4 pt-6" onSubmit={handleSubmit}>
                    <input
                        onChange={handleChange}
                        name="email"
                        type="text"
                        placeholder="email"
                        className="px-4 py-2 rounded-lg bg-white/20 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white/50"
                        required
                    />
                    <input
                        onChange={handleChange}
                        name="password"
                        type="password"
                        placeholder="password"
                        className="px-4 py-2 rounded-lg bg-white/20 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white/50"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-white-mt-8/30 hover:bg-white/40 transition p-2 rounded-lg font-semibold"
                    >
                        Login
                    </button>
                </form>
                <p className="text-center mt-6">
                    Don't have an account?{' '}
                    <a
                        href=""
                        onClick={() => navigate('../signin')}
                        className="text-white font-semibold underline"
                    >
                        Sign up. It's free
                    </a>
                </p>
            </div>
        </div>
    );
};