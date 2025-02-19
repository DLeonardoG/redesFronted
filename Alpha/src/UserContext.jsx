import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(() => {
    const userFromStorage = localStorage.getItem("usuario");
    return userFromStorage ? JSON.parse(userFromStorage) : null;
  });

  const actualizarUsuario = (usuarioData) => {
    setUsuario(usuarioData);
    localStorage.setItem("usuario", JSON.stringify(usuarioData));
  };

  // Al montar el componente, refrescamos la información del usuario y actualizamos el token
  useEffect(() => {
    const refreshUserData = async () => {
      if (usuario && usuario.email) {
        const token = localStorage.getItem("authToken"); // Obtenemos el token guardado
        try {
          // Enviamos el email en el body de la petición como texto plano
          const response = await axios.post(
            'http://localhost:8083/api/refreshUser',
            usuario.email, // Enviamos el email en el cuerpo
            {
              headers: {
                "Content-Type": "text/plain",
                Authorization: `Bearer ${token}`
              }
            }
          );
          
          // Se asume que el backend puede devolver un nuevo token junto con los datos actualizados
          const { 
            id, name, lastname, email, username, photo, bio, 
            publications, followersIds, followingIds, token: newToken 
          } = response.data;
          
          // Actualizamos el token en localStorage si se devuelve uno nuevo
          if (newToken) {
            localStorage.setItem("authToken", newToken);
          }
          
          // Actualizamos los datos del usuario en el contexto (y en localStorage)
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
        } catch (error) {
          if (error.response && error.response.status === 401) {
            console.error('Error: Usuario o contraseña incorrectos.');
          } else {
            console.error('Error de conexión:', error);
          }
        }
      }
    };
    

    refreshUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Se ejecuta solo al montar el componente

  // Listener para actualizar el contexto si localStorage cambia (por ejemplo, en otra pestaña)
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "usuario") {
        setUsuario(event.newValue ? JSON.parse(event.newValue) : null);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <UserContext.Provider value={{ usuario, actualizarUsuario }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
