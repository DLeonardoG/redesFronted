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
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center relative" 
             style={{
                 backgroundImage: "url('https://cloudfront-eu-central-1.images.arcpublishing.com/prisa/56MB6LL63JBP3H6A6EAHV23T2Q.jpg')",
             }}>
        
            <div className="absolute inset-0 bg-black/50"></div>
            
           
            <div className="w-full max-w-md p-8 space-y-8 relative z-10">
               
                <div className="text-center">
                    <h2 className="mt-6 text-4xl font-bold text-white">Welcome Back</h2>
                    <p className="mt-2 text-sm text-gray-300">Sign in to your account</p>
                </div>
                
            
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="sr-only">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="w-full px-4 py-3 border bg-gray-900/50 border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-white"
                                placeholder="Email address"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="w-full px-4 py-3 border bg-gray-900/50 border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-white"
                                placeholder="Password"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
                
                <div className="text-center">
                    <p className="text-sm text-gray-300">
                        Don't have an account?{' '}
                        <button
                            onClick={() => navigate('../signin')}
                            className="font-medium text-blue-400 hover:text-blue-300 transition duration-200"
                        >
                            Sign up for free
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};