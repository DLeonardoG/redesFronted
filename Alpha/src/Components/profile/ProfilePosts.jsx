import React, { useEffect, useState } from 'react';
import { PostCard } from '../PublicationsComponents/PostCard';
import AxiosConfiguration from '../../AxiosConfiguration';

export const ProfilePosts = ({ usuario }) => {
  const [ownPosts, setOwnPosts] = useState([]);

  const fetchOwnPosts = async () => {
    try {
      const response = await AxiosConfiguration.get(`publications/user/${usuario.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      const sortedPosts = response.data.sort((a, b) => {
        const dateA = new Date(a.date); 
        const dateB = new Date(b.date); 
        return dateB - dateA; 
      });

      setOwnPosts(sortedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchOwnPosts();
  }, [usuario]);


  return (

<section className="grid grid-cols-3 gap-2 px-2 py-3 md:px-5 md:py-6 place-items-center z-[1]">
      {ownPosts.length > 0 ? (
        ownPosts.map((post) => (
          <PostCard
            key={post.id}
            username={post.username}
            img={post.photo}
            description={post.description}
            date={post.date}
            interations={post.interations}
            postId={post.id}
          />
        ))
      ) : (
        <p className='text-center p-6'>No hay publicaciones</p>
      )}
    </section>
  );
};