import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router';
import { useUser } from '../../UserContext';

export const ProfileEditForm = ({ usuario, onClose }) => {
  const navigate = useNavigate();
  const { actualizarUsuario } = useUser();

  if (!usuario?.id) {
    toast.error("Error: Usuario no válido");
    navigate('/profile');
    return null;
  }

  const [formData, setFormData] = useState({
    name: usuario.name || '',
    lastname: usuario.lastname || '',
    email: usuario.email || '',
    username: usuario.username || '',
    bio: usuario.bio || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userProfileDTO = {
      name: formData.name,
      lastname: formData.lastname,
      email: formData.email,
      username: formData.username,
      bio: formData.bio,
    };

    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const response = await axios.put(
        `http://localhost:8083/api/users/edit/${usuario.id}`,
        userProfileDTO,
        { headers }
      );

      actualizarUsuario({ ...usuario, ...userProfileDTO });

      toast.success("¡Perfil actualizado con éxito!", {
        position: "top-right",
        autoClose: 3000,
      });

      onClose();

    } catch (error) {
      toast.error(`Error al actualizar el perfil: ${error.response?.data?.message || error.message}`, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: '#1F2937',
        borderRadius: '12px',
        boxShadow: '0px 8px 24px rgba(0,0,0,0.2)',
        width: '90%',
        maxWidth: '800px',
        padding: '20px',
        position: 'relative',
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            right: '16px',
            top: '16px',
            background: 'none',
            border: 'none',
            color: '#9CA3AF',
            cursor: 'pointer',
          }}
        >
          &times;
        </button>

        <h2 style={{ color: 'white', marginBottom: '20px', fontWeight: 'bold' }}>
          Editar Perfil
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ flex: '1 1 45%' }}>
              <label style={{ color: '#9CA3AF', display: 'block', marginBottom: '8px' }}>Nombre</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  backgroundColor: '#374151',
                  border: 'none',
                  color: 'white',
                }}
              />
            </div>

            <div style={{ flex: '1 1 45%' }}>
              <label style={{ color: '#9CA3AF', display: 'block', marginBottom: '8px' }}>Apellido</label>
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  backgroundColor: '#374151',
                  border: 'none',
                  color: 'white',
                }}
              />
            </div>

            <div style={{ flex: '1 1 45%' }}>
              <label style={{ color: '#9CA3AF', display: 'block', marginBottom: '8px' }}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  backgroundColor: '#374151',
                  border: 'none',
                  color: 'white',
                }}
              />
            </div>

            <div style={{ flex: '1 1 45%' }}>
              <label style={{ color: '#9CA3AF', display: 'block', marginBottom: '8px' }}>Usuario</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  backgroundColor: '#374151',
                  border: 'none',
                  color: 'white',
                }}
              />
            </div>

            <div style={{ flex: '1 1 100%' }}>
              <label style={{ color: '#9CA3AF', display: 'block', marginBottom: '8px' }}>Biografía</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  backgroundColor: '#374151',
                  border: 'none',
                  color: 'white',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button
              type="submit"
              style={{
                backgroundColor: '#10B981',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              Guardar Cambios
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                border: '1px solid #6B7280',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};