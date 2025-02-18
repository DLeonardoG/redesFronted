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
    // Normaliza los comentarios existentes
    setCommentsList(existingComments || []);
  }, [existingComments]);

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;

    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken || !usuario?.id) return;

      setIsSubmitting(true);

      // Crea un objeto para el comentario temporal
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

      // Añadirlo de forma optimista a la lista de comentarios
      setCommentsList((prev) => [newComment, ...prev]);
      onCommentAdded(newComment); // Notificar al componente principal

      // Enviar comentario al backend
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

      setComment(""); // Limpiar el campo de texto
    } catch (error) {
      console.error("Error al agregar comentario:", error);
      // Restaurar la lista de comentarios si ocurre un error
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

      // Enviar al backend para actualizar el comentario
      await AxiosConfiguration.put(
        `interations/${selectedCommentId}`,
        { comment: editCommentText.trim() },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      // Actualizar la lista de comentarios
      setCommentsList((prev) =>
        prev.map((c) =>
          c.id === selectedCommentId ? { ...c, comment: editCommentText.trim() } : c
        )
      );
      setSelectedCommentId(null); // Limpiar la edición
      setEditCommentText("");
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

      // Eliminar comentario del backend
      await AxiosConfiguration.delete(`interations/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      // Eliminar comentario de la lista
      setCommentsList((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error al eliminar comentario:", error);
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center ${open ? "block" : "hidden"}`}
      onClick={handleClose}
    >
      <div
        className="bg-[#1e2939] p-6 rounded-lg w-96 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl text-white">Comentarios</h3>
          <button onClick={handleClose} className="text-white">
            X
          </button>
        </div>

        <div className="border-b border-[#3a4a5c] mb-4"></div>

        <div className="flex flex-col gap-4 mb-4">
          <textarea
            placeholder="Escribe un comentario..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="bg-[#334155] text-white p-3 rounded-md h-24"
          />
          <button
            onClick={handleCommentSubmit}
            disabled={isSubmitting || !comment.trim()}
            className="bg-blue-500 text-white p-2 rounded-md flex items-center justify-center"
          >
            {isSubmitting && <div className="animate-spin w-5 h-5 border-4 border-t-4 border-white rounded-full"></div>}
            Enviar
          </button>
        </div>

        <div className="border-b border-[#3a4a5c] mb-4"></div>

        <div>
          {commentsList.length === 0 ? (
            <p className="text-[#b0b0b0] text-center">Aún no hay comentarios.</p>
          ) : (
            commentsList.map((commentItem) => (
              <div key={commentItem.id} className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={commentItem.userGiving?.profilePic}
                      alt={commentItem.username}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-white font-medium">{commentItem.username}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditComment(commentItem.id, commentItem.comment)}
                      className="text-blue-500"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteComment(commentItem.id)}
                      className="text-red-500"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                {selectedCommentId === commentItem.id ? (
                  <div className="ml-4">
                    <textarea
                      value={editCommentText}
                      onChange={(e) => setEditCommentText(e.target.value)}
                      className="bg-[#334155] text-white p-2 rounded-md w-full"
                    />
                    <div className="mt-2 flex gap-2">
                      <button onClick={handleSaveEdit} className="bg-blue-500 text-white p-2 rounded-md">
                        Guardar
                      </button>
                      <button onClick={handleCancelEdit} className="border border-[#b0b0b0] text-[#b0b0b0] p-2 rounded-md">
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-white ml-4">{commentItem.comment}</p>
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
