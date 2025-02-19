import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import AxiosConfiguration from '../AxiosConfiguration';

export const SignIn = () => {
    const [formData, setFormData] = useState({
        name: "",
        lastname: "",
        email: "",
        password: "",
        repeatPassword: "",
        username: "",
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: "" }); r
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let newErrors = {};

        if (formData.password !== formData.repeatPassword) {
            newErrors.password = "Passwords do not match";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const usuario = {
            name: formData.name,
            lastname: formData.lastname,
            email: formData.email,
            password: formData.password,
            username: formData.username,
        };

        try {
            const response = await AxiosConfiguration.post("/register", usuario);
            console.log("Usuario creado con éxito:", response.data);
            alert("User created successfully!");
            navigate("/login");
        } catch (error) {
            if (error.response) {
                console.log("Error al registrar usuario:", error.response.data);
                const errorMessage = error.response.data;
                if (errorMessage.includes("Username already exists")) {
                    newErrors.username = "Username is already taken";
                }
                if (errorMessage.includes("Email already exists")) {
                    newErrors.email = "Email is already in use";
                }
                setErrors(newErrors);
            } else {
                console.error("Error de conexión:", error.message);
                alert("An error occurred. Please try again later.");
            }
        }
    };

    return (
        <div className='min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900 via-slate-900 to-black'>
            
            <aside className='hidden md:flex w-1/1 fixed left-0 h-screen justify-center items-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] 
                        from-indigo-900 via-slate-900 to-black border-r border-purple-500/20'
                        style={{
                            backgroundImage: "url('../Alpha/src/assets/61691.png')",
                        }}
                        >
                <div className='text-center space-y-4'>
                </div>
             
            </aside>

            <main className='w-full md:ml-[0%] min-h-screen flex flex-col justify-center items-center px-4 py-8 bg-black/40 backdrop-blur-sm'>
                <div className='w-full max-w-md space-y-8'>
                    <h2 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 animate-gradient bg-[length:200%_auto]">
                        Join the Galaxy
                    </h2>

                    <form className='space-y-6' onSubmit={handleSubmit}>
                        <div className='flex gap-4'>
                            <div className='flex-1'>
                                <input 
                                    name='name' 
                                    type="text" 
                                    placeholder="Name" 
                                    className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 text-white placeholder-purple-300/50 transition-all"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>
                            <div className='flex-1'>
                                <input 
                                    name='lastname' 
                                    type="text" 
                                    placeholder="Lastname" 
                                    className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 text-white placeholder-purple-300/50 transition-all"
                                    value={formData.lastname}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>
                        </div>

                        <div>
                            <input 
                                name='email' 
                                type="email" 
                                placeholder="Email" 
                                className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 text-white placeholder-purple-300/50 transition-all"
                                value={formData.email}
                                onChange={handleChange}
                                required 
                            />
                            {errors.email && <p className='text-red-400 text-sm mt-1'>{errors.email}</p>}
                        </div>

                        <div>
                            <input 
                                name='username' 
                                type="text" 
                                placeholder="Username" 
                                className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 text-white placeholder-purple-300/50 transition-all"
                                value={formData.username}
                                onChange={handleChange}
                                required 
                            />
                            {errors.username && <p className='text-red-400 text-sm mt-1'>{errors.username}</p>}
                        </div>

                        <div>
                            <input 
                                name='password' 
                                type="password" 
                                placeholder="Password" 
                                className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 text-white placeholder-purple-300/50 transition-all"
                                value={formData.password}
                                onChange={handleChange}
                                required 
                            />
                        </div>

                        <div>
                            <input 
                                name='repeatPassword' 
                                type="password" 
                                placeholder="Repeat Password" 
                                className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 text-white placeholder-purple-300/50 transition-all"
                                value={formData.repeatPassword}
                                onChange={handleChange}
                                required 
                            />
                            {errors.password && <p className='text-red-400 text-sm mt-1'>{errors.password}</p>}
                        </div>

                        <button 
                            type="submit" 
                            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25"
                        >
                            Launch into Space
                        </button>
                    </form>

                    <p className="text-center text-purple-300/80">
                        Already have a spaceship?{' '}
                        <button 
                            onClick={() => navigate("/login")}
                            className="text-purple-400 hover:text-purple-300 font-semibold hover:underline transition-colors"
                        >
                            Dock here
                        </button>
                    </p>
                </div>
            </main>
        </div>
    );
};
