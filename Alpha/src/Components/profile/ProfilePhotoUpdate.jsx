import React, { useState } from "react";
import AxiosConfiguration from "../../AxiosConfiguration"; 
import { useUser } from "../../UserContext";

export const ProfilePhotoUpdate = () => {
  const { usuario, actualizarUsuario } = useUser();
  
  // Estado para manejar la URL de la nueva foto
  const [newPhotoURL, setNewPhotoURL] = useState("");

  const defaultPhotoURL = "https://cdn-icons-png.freepik.com/512/5997/5997002.png";
  const isDefaultPhoto = usuario.photo === defaultPhotoURL;

  const photoURL = isDefaultPhoto 
    ? defaultPhotoURL 
    : usuario.photo;

  const handleInputChange = (e) => {
    setNewPhotoURL(e.target.value);
  };

  const handleSubmit = () => {
    // Verificar que la URL no esté vacía
    if (newPhotoURL) {
      AxiosConfiguration.patch(`/users/${usuario.id}/photo`, { photo: newPhotoURL }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        }
      })
        .then((response) => {
          const updatedPhoto = response.data.photo;
          actualizarUsuario({ ...usuario, photo: updatedPhoto });
        })
        .catch((error) => {
          console.error("Error al actualizar la foto de perfil:", error);
        });
    }
  };

  return (
    <div>
      <img
        src={photoURL} 
        alt="Foto de perfil"
        style={{
          cursor: "pointer",
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          objectFit: "cover"
        }}
      />
      <div>
        <input
          type="text"
          value={newPhotoURL}
          onChange={handleInputChange}
          placeholder="Ingrese la URL de la nueva foto"
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc"
          }}
        />
        <button 
          onClick={handleSubmit}
          style={{
            marginTop: "10px",
            padding: "8px 16px",
            borderRadius: "5px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
        >
          Actualizar Foto
        </button>
      </div>
    </div>
  );
};
