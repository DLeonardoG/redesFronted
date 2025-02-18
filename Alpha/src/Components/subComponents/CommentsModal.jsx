import React, { useState, useEffect } from "react";
import AxiosConfiguration from "../../AxiosConfiguration";
import { useUser } from "../../UserContext";

const CommentsModal = ({ open, handleClose, postId, publisherId, onCommentAdded, existingComments }) => {
  const { usuario } = useUser();
  const [comment, setComment] = useState("");
  const [commentsList, setCommentsList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  useEffect(() => {
    setCommentsList(existingComments || []);
  }, [existingComments]);

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;

    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken || !usuario?.id) return;

      setIsSubmitting(true);

      const newComment = {
        tempId: Date.now(),
        comment: comment.trim(),
        date: new Date().toISOString(),
        userGiving: usuario,
        publicationId: postId,
        typeInterationId: 2,
        username: usuario.username,
        userGivingId: usuario.id,
      };

      setCommentsList((prev) => [newComment, ...prev]);
      onCommentAdded(newComment);

      await AxiosConfiguration.post(
        "interations",
        {
          publicationId: postId,
          userGivingId: usuario.id,
          userReceivingId: publisherId,
          typeInterationId: 2,
          date: new Date().toISOString(),
          comment: comment.trim(),
          username: usuario.username,
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      setComment("");
    } catch (error) {
      console.error("Error al agregar comentario:", error);
      setCommentsList((prev) => prev.filter((c) => c.tempId !== newComment.tempId));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditComment = (id, text) => {
    setSelectedCommentId(id);
    setEditCommentText(text);
  };

  const handleSaveEdit = async () => {
    if (!editCommentText.trim()) return;
  
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) return;
  
      // Enviar la solicitud PATCH al backend para actualizar el comentario
      const response = await AxiosConfiguration.patch(
        `interations/${selectedCommentId}/comment`,
        { comment: editCommentText.trim() },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
  
      if (response.status === 200) {
        // Si la actualización fue exitosa, actualizar la lista de comentarios
        setCommentsList((prev) =>
          prev.map((c) =>
            c.id === selectedCommentId ? { ...c, comment: editCommentText.trim() } : c
          )
        );
        setSelectedCommentId(null);
        setEditCommentText("");
      } else {
        console.error("Error al actualizar el comentario");
      }
    } catch (error) {
      console.error("Error al editar comentario:", error);
    }
  };
  

  const handleCancelEdit = () => {
    setSelectedCommentId(null);
    setEditCommentText("");
  };

  const handleDeleteComment = async (id) => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) return;

      await AxiosConfiguration.delete(`interations/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      setCommentsList((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error al eliminar comentario:", error);
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center ${open ? "block" : "hidden"}`}
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg w-full sm:w-[500px] max-h-[80vh] overflow-y-auto shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Comentarios</h3>
          <button onClick={handleClose} className="text-gray-600 hover:text-gray-800">
            <span className="text-2xl">&times;</span>
          </button>
        </div>

        <div className="border-b mb-4 border-gray-200"></div>

        <div className="flex flex-col gap-4 mb-4">
          <textarea
            placeholder="Escribe un comentario..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="p-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleCommentSubmit}
            disabled={isSubmitting || !comment.trim()}
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center disabled:bg-gray-400"
          >
            {isSubmitting ? (
              <div className="animate-spin w-5 h-5 border-4 border-t-4 border-white rounded-full"></div>
            ) : (
              "Enviar"
            )}
          </button>
        </div>

        <div className="border-b mb-4 border-gray-200"></div>

        <div className="space-y-4">
          {commentsList.length === 0 ? (
            <p className="text-center text-gray-500">Aún no hay comentarios.</p>
          ) : (
            commentsList.map((commentItem) => (
              <div key={commentItem.id} className="p-4 bg-gray-50 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={commentItem.userGiving?.photo || "https://i.pinimg.com/550x/77/3e/4a/773e4a6b450dea859d9c0b9d45030ae6.jpg"}
                      alt={commentItem.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-gray-800 font-medium">{commentItem.username}</span>
                  </div>
                  {usuario?.id === commentItem.userGivingId && (
                    <div className="flex gap-3 text-sm text-gray-600">
                      <button
                        onClick={() => handleEditComment(commentItem.id, commentItem.comment)}
                        className="hover:text-blue-600"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteComment(commentItem.id)}
                        className="hover:text-red-600"
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>

                {selectedCommentId === commentItem.id ? (
                  <div className="mt-2">
                    <textarea
                      value={editCommentText}
                      onChange={(e) => setEditCommentText(e.target.value)}
                      className="p-3 w-full rounded-lg border border-gray-300 bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="mt-2 flex gap-3">
                      <button
                        onClick={handleSaveEdit}
                        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="border border-gray-300 text-gray-600 p-2 rounded-md hover:bg-gray-200"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-800 mt-2">{commentItem.comment}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentsModal;
