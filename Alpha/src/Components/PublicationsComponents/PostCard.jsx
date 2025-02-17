import React, { useState } from 'react';
import { PostCardModalPc } from './PostCardModalPc';

export const PostCard = ({ img, description, username, date, interations, postId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {isModalOpen && (
        <PostCardModalPc
          img={img}
          description={description}
          username={username}
          onClose={closeModal}
          date={date}
          interations={interations}
          postId={postId}
        />
      )}
      <div className="flex justify-center items-center">
        <button 
          className="w-full h-full cursor-pointer flex justify-center items-center" 
          onClick={openModal}
        >
          <img src={img} alt={description} className="w-full h-full object-cover" />
        </button>
      </div>
    </>
  );
}; 