import { format } from 'date-fns';

const NotificationItem = ({ notification }) => {
  return (
    <div className={`flex items-center gap-4 p-4 rounded-lg shadow-md border 
                    ${notification.checked ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-800'}`}>
      <div className={`w-3 h-3 rounded-full ${notification.checked ? 'bg-gray-500' : 'bg-green-500'}`} />
      <div className="flex-1">
        <p className="text-xs text-gray-400">{format(new Date(notification.date), 'PPpp')}</p>
        <p className="font-semibold">{notification.content}</p>
        <p className="text-xs text-gray-500">Type: {notification.type}</p>
      </div>
    </div>
  );
};

export default NotificationItem;
