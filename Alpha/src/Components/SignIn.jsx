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
        <div className='bg-gradient-to-r from-black via-gray-900 to-black bg-[length:200%_200%] h-screen flex justify-center items-center'>
            <aside className='hidden md:flex bg-gradient-to-b from-gray-900 via-gray-800 to-gray-600 animate-gradient w-1/2 justify-center items-center h-screen border border-black/10'>
                <h1 className='text-white text-4xl'>Ledrian</h1>
            </aside>
            <main className='w-screen md:w-1/2 flex justify-around items-center h-screen flex-col bg-white'>
                <h2 className="text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 mb-6">
                    Sign in
                </h2>

                <form className='sign_form w-full flex flex-col items-center gap-5' onSubmit={handleSubmit}>
                    <div className='flex gap-5 w-4/5'>
                        <div className='w-1/2'>
                            <input name='name' type="text" placeholder="Name" className="border border-gray-300 p-2 rounded-lg w-full" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className='w-1/2'>
                            <input name='lastname' type="text" placeholder="Lastname" className="border border-gray-300 p-2 rounded-lg w-full" value={formData.lastname} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className='w-4/5'>
                        <input name='email' type="email" placeholder="Email" className="border border-gray-300 p-2 rounded-lg w-full" value={formData.email} onChange={handleChange} required />
                        {errors.email && <p className='text-red-500 text-sm'>{errors.email}</p>}
                    </div>
                    <div className='w-4/5'>
                        <input name='username' type="text" placeholder="Username" className="border border-gray-300 p-2 rounded-lg w-full" value={formData.username} onChange={handleChange} required />
                        {errors.username && <p className='text-red-500 text-sm'>{errors.username}</p>}
                    </div>
                    <div className='w-4/5'>
                        <input name='password' type="password" placeholder="Password" className="border border-gray-300 p-2 rounded-lg w-full" value={formData.password} onChange={handleChange} required />
                    </div>
                    <div className='w-4/5'>
                        <input name='repeatPassword' type="password" placeholder="Repeat Password" className="border border-gray-300 p-2 rounded-lg w-full" value={formData.repeatPassword} onChange={handleChange} required />
                        {errors.password && <p className='text-red-500 text-sm'>{errors.password}</p>}
                    </div>
                    <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg w-4/5">Register</button>
                </form>

                <p className="mt-4">Do you already have an account? <a href="#" className="text-blue-500 hover:underline" onClick={() => navigate("/login")}>Go login</a></p>
            </main>
        </div>
    );
};
