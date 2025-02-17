import React, { useEffect, useState } from 'react';
import AxiosConfiguration from '../../AxiosConfiguration';
import { FeedPostCard } from './feedPostCard';

export const FeedPosts = ({ usuario }) => {
  const [followingPosts, setFollowingPosts] = useState([]);

  const fetchImage = async (photo) => {
    const imageUrl = `http://localhost:8083/api/publications/images/${photo}`;
    const response = await fetch(imageUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    if (!response.ok) {
      console.error(`Error cargando imagen: ${imageUrl}`);
      return null;
    }
    const imageBlob = await response.blob();
    return URL.createObjectURL(imageBlob);
  };

  const fetchPostsByUser = async (userId) => {
    try {
      const response = await AxiosConfiguration.get(`publications/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      const postsWithImages = await Promise.all(
        response.data.map(async (post) => ({
          ...post,
          photo: await fetchImage(post.photo),
        }))
      );

      return postsWithImages;
    } catch (error) {
      console.error(`Error fetching posts for user ${userId}:`, error);
      return [];
    }
  };

  const fetchFollowingPosts = async () => {
    try {
      const postsPromises = usuario.followingIds.map((userId) => fetchPostsByUser(userId));
      const postsArrays = await Promise.all(postsPromises);

      const allPosts = postsArrays.flat();

      console.log(allPosts)

      const sortedPosts = allPosts.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA; 
      });

      setFollowingPosts(sortedPosts);
    } catch (error) {
      console.error('Error fetching following posts:', error);
    }
  };

  useEffect(() => {
    if (usuario.followingIds && usuario.followingIds.length > 0) {
      fetchFollowingPosts();
    }
  }, [usuario]);

  return (
    <main className='feed_post-container'>
      {followingPosts.length > 0 ? (
        followingPosts.map((post) => (
          <FeedPostCard
            key={post.id}
            username={post.username}
            imageUrl={post.photo}
            likes={post.likes || 0}
            comments={post.comments || 0}
            description={post.description} 
            date={post.date}
            postId = {post.id}
            publisherId={post.publisherId}
            interations={post.interations}
          />
        ))
      ) : (
        <p className='text-white'>No hay publicaciones recientes de los usuarios que sigues.</p>
      )}
    </main>
  );
};