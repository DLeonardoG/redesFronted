import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(() => {
      const userFromStorage = localStorage.getItem('usuario');
      return userFromStorage ? JSON.parse(userFromStorage) : null;
    });

    const actualizarUsuario = (usuarioData) => {
        setUsuario(usuarioData);
        localStorage.setItem('usuario', JSON.stringify(usuarioData));
      };
    
      useEffect(() => {
        const storedUser = localStorage.getItem('usuario');
        if (storedUser) {
          setUsuario(JSON.parse(storedUser));
        }
      }, []);
    
      return (
        <UserContext.Provider value={{ usuario, actualizarUsuario }}>
          {children}
        </UserContext.Provider>
      );
    };
    
    export const useUser = () => useContext(UserContext);
    