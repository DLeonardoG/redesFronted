import { useEffect, useState } from 'react';
import axios from 'axios';
import NotificationItem from './NotificationItem';

const API_URL = 'http://localhost:8083/api/notifications';

const NotificationsList = ({ onClose, usuario }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const noti = await getNotifications(usuario.id);
        const allNotifications = [...noti].sort((a, b) => new Date(b.date) - new Date(a.date));
        setNotifications(allNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [usuario.id]);

  const getNotifications = async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/all/${userId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }
  };

  const markAllNotificationsAsRead = async (userId) => {
    try {
      await axios.put(`${API_URL}/read-all/${userId}`, null, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({ ...notification, checked: true }))
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#00000094] z-50">
      <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white w-full max-w-md p-6 rounded-3xl shadow-2xl relative flex flex-col">
        <div className="flex justify-between items-center border-b border-white pb-3">
          <h2 className="text-2xl font-bold">Notificaciones</h2>
          <button onClick={() => { markAllNotificationsAsRead(usuario.id); onClose(); }} 
                  className="text-white hover:text-gray-300 transition">
            ✕
          </button>
        </div>
        <div className="mt-4 space-y-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-600">
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <NotificationItem key={notification.id} notification={notification} />
            ))
          ) : (
            <p className="text-center text-gray-200 py-4">No hay notificaciones</p>
          )}
        </div>
        <button 
          onClick={() => markAllNotificationsAsRead(usuario.id)} 
          className="mt-4 w-full py-3 bg-white text-indigo-700 hover:bg-gray-300 font-bold rounded-xl transition">
          Marcar todas como leídas
        </button>
      </div>
    </div>
  );
};

export default NotificationsList;
