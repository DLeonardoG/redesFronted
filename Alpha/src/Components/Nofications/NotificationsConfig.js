import axios from 'axios';
import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:8083/notifications';

// Estado para las notificaciones
const [notifications, setNotifications] = useState([]);
const [readNotifications, setReadNotifications] = useState([]);
const [notification, setNotification] = useState(null);

// Obtención de notificaciones no leídas
useEffect(() => {
  const fetchUnseenNotifications = async () => {
    const unseenNotifications = await getUnseenNotifications(usuario.id);
    setNotifications(unseenNotifications);
  };

  fetchUnseenNotifications();
}, [usuario.id]);

// Función para obtener notificaciones no leídas
export const getUnseenNotifications = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/unread/${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching unread notifications:", error);
    return [];
  }
};

// Función para obtener notificaciones leídas
export const getReadNotifications = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/read/${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching read notifications:", error);
    return [];
  }
};

// Función para marcar una notificación como leída
export const markNotificationAsRead = async (notificationId) => {
  try {
    await axios.put(`${API_URL}/read/${notificationId}`, null, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    // Actualizar el estado para reflejar la notificación como leída
    setNotifications(notifications.filter(notification => notification.id !== notificationId));
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
};

// Función para marcar todas las notificaciones de un usuario como leídas
export const markAllNotificationsAsRead = async (userId) => {
  try {
    await axios.put(`${API_URL}/read-all/${userId}`, null, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    // Actualizar el estado para reflejar que todas las notificaciones han sido leídas
    setNotifications([]);
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
  }
};

// Función para obtener una notificación por su ID
export const getNotificationById = async (notificationId) => {
  try {
    const response = await axios.get(`${API_URL}/${notificationId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    setNotification(response.data);
  } catch (error) {
    console.error("Error fetching notification by ID:", error);
  }
};

// Función para crear una nueva notificación
export const createNotification = async (notificationData) => {
  try {
    const response = await axios.post(API_URL, notificationData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    // Añadir la nueva notificación al estado
    setNotifications([...notifications, response.data]);
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};
