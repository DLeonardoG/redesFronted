import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import AxiosConfiguration from '../../AxiosConfiguration'; // Ajusta la ruta según tu estructura

export const EditDescriptionModal = ({
  open,
  currentDescription,
  postId,
  onClose,
  onUpdate,
}) => {
  const [description, setDescription] = useState(currentDescription);

  const handleSave = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) return;

      const response = await AxiosConfiguration.put(
        `/api/publications/${postId}`,
        { description },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      onUpdate(response.data); // Actualiza la descripción en el componente padre
      onClose(); // Cierra el modal
    } catch (error) {
      console.error("Error actualizando la descripción:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Editar descripción</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Descripción"
          type="text"
          fullWidth
          variant="outlined"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onClick={(e) => e.stopPropagation()} // Evita la propagación del evento
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleSave} color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};