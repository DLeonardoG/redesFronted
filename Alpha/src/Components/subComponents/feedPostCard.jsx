import React, { useState, useEffect } from "react";
import { useUser } from "../../UserContext";
import AxiosConfiguration from "../../AxiosConfiguration";
import CommentsModal from "./CommentsModal";

export const FeedPostCard = ({
  username,
  profilePic,
  imageUrl,
  interations,
  description,
  date,
  postId,
  publisherId,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [actionType, setActionType] = useState("");
  const [interactionId, setInteractionId] = useState(null);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [optimisticLikes, setOptimisticLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const { usuario } = useUser();

  useEffect(() => {
    const userInteraction = interations?.find(
      (i) => i.typeInterationId === 1 && i.userGivingId === usuario?.id
    );
    setIsLiked(!!userInteraction);
    setInteractionId(userInteraction?.id || null);

    const initialLikes =
      interations?.filter((i) => i.typeInterationId === 1).length || 0;
    setOptimisticLikes(initialLikes);

    const initialComments =
      interations?.filter((i) => i.typeInterationId === 2) || [];
    setComments(initialComments);
  }, [interations, usuario?.id]);

  const handleLikeClick = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken || !usuario?.id) return;

      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);
      setOptimisticLikes((prev) => (newIsLiked ? prev + 1 : prev - 1));
      setActionType(newIsLiked ? "add" : "remove");
      setShowSuccess(true);

      if (newIsLiked) {
        const response = await AxiosConfiguration.post(
          "interations",
          {
            date: new Date().toISOString(),
            publicationId: postId,
            userGivingId: usuario.id,
            userReceivingId: publisherId,
            typeInterationId: 1,
          },
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        setInteractionId(response.data.id);
      } else {
        if (interactionId) {
          await AxiosConfiguration.delete(`interations/${interactionId}`, {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          setInteractionId(null);
        }
      }
    } catch (error) {
      console.error("Error gestionando like:", error);
      setIsLiked((prev) => !prev);
      setOptimisticLikes((prev) => (isLiked ? prev - 1 : prev + 1));
      setShowSuccess(false);
    }
  };

  const handleCommentAdded = (newComment) => {
    setComments((prev) => [newComment, ...prev]);
  };

  const handleCommentsClick = () => {
    setCommentsOpen(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Fecha desconocida";
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <div className="bg-[#1e2939] p-6 rounded-lg w-full mb-4">
        <div className="flex items-center gap-4">
          <img src={profilePic} alt={username} className="w-12 h-12 rounded-full" />
          <div className="text-white">
            <p className="font-semibold">{username}</p>
            <p className="text-sm">{formatDate(date)}</p>
          </div>
        </div>

        <p className="text-white mt-4">{description}</p>

        <div className="mt-4">
          <img src={imageUrl} alt={description} className="w-full h-auto rounded-lg" />
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleLikeClick}
              className={`${
                isLiked ? "text-blue-500" : "text-white"
              } flex items-center gap-1`}
            >
              <span className="material-icons-outlined">
                thumb_up
              </span>
              <span>{optimisticLikes}</span>
            </button>

            <button
              onClick={handleCommentsClick}
              className="text-white flex items-center gap-1"
            >
              <span className="material-icons-outlined">comment</span>
              <span>{comments.length}</span>
            </button>
          </div>
        </div>
      </div>

      <CommentsModal
        open={commentsOpen}
        handleClose={() => setCommentsOpen(false)}
        postId={postId}
        publisherId={publisherId}
        onCommentAdded={handleCommentAdded}
        existingComments={comments}
      />
    </>
  );
};

export default FeedPostCard;
