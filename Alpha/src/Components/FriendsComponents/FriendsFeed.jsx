import React from "react";
import { FriendsCard } from "./FriendsCard"; 

export const FriendsFeed = ({ usuario }) => {
  const followingIds = usuario.followingIds || [];

  return (
    <div className="lg:grid lg:grid-cols-[1fr_1fr] p-5 md:p-10 h-full overflow-y-scroll bg-gray-900">
      <div className="flex justify-start lg:flex-col lg:p-10">
        {followingIds.length === 0 ? (
          <p className="text-white text-center">No estás siguiendo a nadie.</p>
        ) : (
          followingIds.map((followingId) => (
            <FriendsCard key={followingId} usuario={{ id: followingId }} />
          ))
        )}
      </div>
    </div>
  );
};