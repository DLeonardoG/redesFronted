import React, { useState, useEffect } from 'react';
import AxiosConfiguration from '../../AxiosConfiguration';
import { useUser } from '../../UserContext';
import { format, parseISO } from 'date-fns'; // Librería para formatear fechas

export const PostCardModalPc = ({
  img,
  description,
  username,
  onClose,
  date,
  interations,
  postId,
}) => {
  const { usuario } = useUser();
  const [isLiked, setIsLiked] = useState(false);
  const [interactionId, setInteractionId] = useState(null);
  const [optimisticLikes, setOptimisticLikes] = useState(0);
  const [commentsList, setCommentsList] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [showOptions, setShowOptions] = useState(false); // Estado para mostrar opciones

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editedDescription, setEditedDescription] = useState(description);

  // Modo oscuro/claro
  const [isDarkMode, setIsDarkMode] = useState(false);

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
    setCommentsList(initialComments);
  }, [interations, usuario?.id]);

  const handleLikeClick = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken || !usuario?.id) return;

      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);
      setOptimisticLikes((prev) => (newIsLiked ? prev + 1 : prev - 1));

      if (newIsLiked) {
        const response = await AxiosConfiguration.post(
          'interations',
          {
            date: new Date().toISOString(),
            publicationId: postId,
            userGivingId: usuario.id,
            userReceivingId: usuario.id,
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
      console.error('Error gestionando like:', error);
      setIsLiked((prev) => !prev);
      setOptimisticLikes((prev) => (isLiked ? prev - 1 : prev + 1));
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentInput.trim()) return;

    const authToken = localStorage.getItem('authToken');
    if (!authToken || !usuario?.id) return;

    setIsSubmittingComment(true);

    const tempComment = {
      tempId: Date.now(),
      comment: commentInput.trim(),
      date: new Date().toISOString(),
      userGiving: usuario,
      publicationId: postId,
      typeInterationId: 2,
    };

    setCommentsList((prev) => [tempComment, ...prev]);
    setCommentInput('');

    try {
      const payload = {
        publicationId: postId,
        userGivingId: usuario.id,
        userReceivingId: usuario.id,
        typeInterationId: 2,
        date: new Date().toISOString(),
        comment: tempComment.comment,
      };

      await AxiosConfiguration.post('interations', payload, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
    } catch (error) {
      console.error('Error al enviar el comentario:', error);
      setCommentsList((prev) =>
        prev.filter((c) => c.tempId !== tempComment.tempId)
      );
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleEdit = async () => {
    setEditedDescription(description);
    setEditModalOpen(true);
    setShowOptions(false); // Cerrar el menú de opciones
  };

  const handleDelete = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) return;

      await AxiosConfiguration.delete(`publications/${postId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      console.log('Publicación eliminada');
      onClose();
    } catch (error) {
      console.error('Error eliminando la publicación:', error);
    }
    setShowOptions(false); // Cerrar el menú de opciones
  };

  const handleEditCancel = () => {
    setEditModalOpen(false);
  };

  const handleEditSave = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) return;

      const payload = { description: editedDescription };

      const response = await AxiosConfiguration.patch(
        `publications/${postId}/description`,
        payload,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      console.log('Descripción actualizada:', response.data);
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error actualizando la descripción:', error);
    }
  };

  // Formatear fecha y hora con date-fns
  const formattedDate = format(parseISO(date), "dd 'de' MMMM 'de' yyyy");
  const formatCommentDate = (dateString) => {
    return format(parseISO(dateString), "dd MMM yyyy, HH:mm");
  };

  return (
    <>
      {/* Fondo oscuro */}
      <div
        className={`fixed inset-0 z-[9999] flex items-center justify-center ${
          isDarkMode ? 'bg-black/50' : 'bg-gray-900/50'
        }`}
        onClick={onClose}
      >
        {/* Contenedor del modal */}
        <div
          className={`relative rounded-lg w-[90vw] max-w-5xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row ${
            isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Botón de cierre */}
          <button
            className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70 transition-all"
            onClick={onClose}
          >
            &times;
          </button>

          {/* Sección de la imagen */}
          <div className="flex-1 overflow-y-auto bg-black flex items-center justify-center p-4">
            <img
              src={img}
              alt={description}
              className="max-w-full max-h-[50vh] md:max-h-[80vh] object-contain"
            />
          </div>

          {/* Sección de contenido */}
          <div className="flex-1 flex flex-col w-full overflow-y-auto md:w-[400px]">
            {/* Cabecera */}
            <div className="flex items-center p-4 border-b">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4519/4519678.png"
                alt={username}
                className="w-10 h-10 rounded-full"
              />
              <span className="ml-2 font-semibold">{username}</span>
              {/* Botón de opciones */}
              <button
                className=" p-2 hover:bg-gray-100 rounded-full"
                onClick={() => setShowOptions(!showOptions)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
              {/* Menú de opciones */}
              {showOptions && (
                <div
                  className={`absolute right-4 top-14 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-white'
                  } border rounded-lg shadow-lg`}
                >
                  <button
                    className={`block w-full px-4 py-2 text-left ${
                      isDarkMode
                        ? 'hover:bg-gray-600 text-white'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={handleEdit}
                  >
                    Editar
                  </button>
                  <button
                    className={`block w-full px-4 py-2 text-left ${
                      isDarkMode
                        ? 'hover:bg-gray-600 text-white'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={handleDelete}
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </div>

            {/* Descripción y comentarios */}
            <div
              className="flex-1 overflow-y-auto p-4"
              style={{ maxHeight: '40vh' }}
            >
              <div className="mb-4">
                <span className="font-semibold">{username}</span>
                <p className="text-gray-700">{description}</p>
                <span className="text-gray-500 block mt-1">{formattedDate}</span>
              </div>

              {commentsList.length > 0 ? (
                commentsList.map((comment) => (
                  <div key={comment.id || comment.tempId} className="mb-4">
                    <span className="font-semibold">
                      {comment.userGiving?.username || usuario?.username}
                    </span>
                    <p className="text-gray-700">{comment.comment}</p>
                    <span className="text-gray-500 block mt-1">
                      {formatCommentDate(comment.date)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No hay comentarios</p>
              )}
            </div>

            {/* Interacciones (likes y comentarios) */}
            <div className="p-4 border-t">
              <div className="flex justify-between mb-2">
                <div className="flex space-x-4">
                  <button onClick={handleLikeClick}>
                    {isLiked ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-red-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    )}
                  </button>
                  <button>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <span className="font-semibold">{optimisticLikes} Me gusta</span>
              <span className="text-gray-500 block">{formattedDate}</span>
            </div>

            {/* Campo para añadir comentarios */}
            <div className="p-4 border-t">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Añade un comentario..."
                  className={`flex-1 outline-none ${
                    isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'
                  }`}
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                />
                <button
                  className="text-blue-500 font-semibold ml-2"
                  onClick={handleCommentSubmit}
                  disabled={isSubmittingComment || !commentInput.trim()}
                >
                  Publicar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de edición */}
      {editModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50">
          <div
            className={`rounded-lg w-[90vw] max-w-md p-6 ${
              isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            }`}
          >
            <h2 className="text-xl font-semibold mb-4">Editar Descripción</h2>
            <textarea
              className={`w-full p-2 border rounded-lg mb-4 ${
                isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'
              }`}
              rows={4}
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                className={`px-4 py-2 ${
                  isDarkMode
                    ? 'text-gray-300 hover:bg-gray-600'
                    : 'text-gray-600 hover:bg-gray-100'
                } rounded-lg`}
                onClick={handleEditCancel}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={handleEditSave}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};