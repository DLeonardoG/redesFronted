import React from "react";
import { useUser } from "../UserContext";
import { AsideMain } from "./subComponents/asideMain";
import { FriendsFeed } from "./FriendsComponents/FriendsFeed";



export const Friends = () => {
  const { usuario } = useUser();
  return (
    <>
      <section className="h-screen bg-gray-900">
        <AsideMain usuario={usuario} />
        <FriendsFeed usuario={usuario} />
        {/* <FriendsFeed usuario={usuario} /> */}
      </section>
      </>
  );
};
