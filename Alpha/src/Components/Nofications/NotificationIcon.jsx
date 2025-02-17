import React, { useState } from "react";
import { useNavigate } from "react-router";
import NotificationsList from "./NotificationsList";
import { NavButton } from '../subComponents/asideMain';

export const NotificationButton = ({usuario}) => {
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    
    const navigate = useNavigate();

    const handleNoti = () => {
        setIsNotificationOpen(true);
      };
    
      const handleNotiClose = () => {
        setIsNotificationOpen(false);
      };

      return (
        <>
        <NavButton
        imagePath="https://png.pngtree.com/png-vector/20240911/ourmid/pngtree-3d-cartoon-bell-notification-icon-clipart-png-image_13816589.png"
        altText="Notifications Icon"
        text="Notifications"
        onClick={handleNoti}
        width={'30px'}
        height={'30px'}
      />
      {isNotificationOpen && (
        <NotificationsList onClose={handleNotiClose} usuario={usuario} />
      )}
      </>
      )
    
}
