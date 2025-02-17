import React, { useState } from 'react';
import AxiosConfiguration from '../../AxiosConfiguration';

export const CreateModal = ({ onClose, usuario }) => {
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación de la descripción
    if (description.length < 5 || description.length > 500) {
      alert("The caption must be between 5 and 500 characters.");
      return;
    }

    // Validación de la URL de la imagen
    if (!photoUrl || !photoUrl.startsWith('http')) {
      alert("Please enter a valid image URL.");
      return;
    }

    // Crear un objeto FormData para enviar los datos
    const formData = new FormData();
    formData.append('description', description);
    formData.append('photo', photoUrl); // Enviamos la URL como texto
    formData.append('username', usuario.username);
    formData.append('publisherId', usuario.id);

    // Enviar la solicitud al backend
    AxiosConfiguration.post('publications/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    })
      .then((response) => {
        console.log('Post created:', response.data);
        onClose(); // Cerrar el modal después de crear la publicación
      })
      .catch((error) => {
        console.error('Error creating post:', error);
        alert("An error occurred while creating the post.");
      });
  };

  return (
    <div className={`fixed inset-0 ${darkMode ? 'bg-gray-900' : 'bg-black/50'} flex justify-center items-center z-[9999] p-4`}>
      <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl`}>
        <div className='flex justify-between items-center p-4 border-b border-gray-200'>
          <h2 className='text-lg font-semibold'>Create a new post</h2>
          <button onClick={onClose} className={`${darkMode ? 'text-white' : 'text-black'} focus:outline-none`}>
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className='flex flex-col'>
          {/* Campo para la URL de la imagen */}
          <input
            type="text"
            placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            className={`w-full p-4 border-none outline-none text-sm border-b ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-black'}`}
          />
          {/* Campo para la descripción */}
          <textarea
            id='caption-textarea'
            placeholder='Write a caption (5-500 characters)...'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`w-full h-24 p-4 border-none outline-none resize-none text-sm border-b ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-black'}`}
          />
          {/* Botón para publicar */}
          <button
            id='publish-button'
            type='submit'
            disabled={!photoUrl || description.length < 5 || description.length > 500}
            className={`w-full p-3 ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white border-none rounded-b-lg text-sm font-semibold cursor-pointer disabled:bg-blue-300 disabled:cursor-not-allowed`}
          >
            Publish
          </button>
        </form>
        {/* Botón para alternar entre modo oscuro y claro */}
        <div className='flex justify-end p-4'>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'} rounded-full focus:outline-none`}
          >
            {darkMode ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </div>
  );
};