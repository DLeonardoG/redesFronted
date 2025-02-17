import React, { useState, useEffect } from "react";
import {
  Avatar,
  IconButton,
  Typography,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Snackbar,
  Alert,
  Modal,
  Box,
  Divider,
  TextField,
  Button,
  CircularProgress,
  Menu,
  MenuItem,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareIcon from "@mui/icons-material/Share";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useUser } from "../../UserContext";
import AxiosConfiguration from "../../AxiosConfiguration";

const CommentsModal = ({
  open,
  handleClose,
  postId,
  publisherId,
  onCommentAdded,
  existingComments,
}) => {
  const { usuario } = useUser();
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [commentsList, setCommentsList] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCommentId, setSelectedCommentId] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editCommentText, setEditCommentText] = useState("");

  useEffect(() => {
    const normalizedComments = (existingComments || []).map((comment) => ({
      ...comment,
      userGiving: comment.userGiving || { id: comment.userGivingId },
      username:  usuario.username ||"Usuario desconocido",
    }));
    setCommentsList(normalizedComments);
  }, [existingComments]);

  const handleMenuOpen = (event, commentId) => {
    setAnchorEl(event.currentTarget);
    setSelectedCommentId(commentId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    if (!isEditing) {
      setSelectedCommentId(null);
    }
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;

    let tempComment;
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken || !usuario?.id) return;

      setIsSubmitting(true);

      tempComment = {
        tempId: Date.now(),
        comment: comment.trim(),
        date: new Date().toISOString(),
        userGiving: usuario,
        publicationId: postId,
        typeInterationId: 2,
        username: usuario.username,
        userGivingId: usuario.id,
      };

      setCommentsList((prev) => [tempComment, ...prev]);
      onCommentAdded(tempComment);

      const payload = {
        publicationId: postId,
        userGivingId: usuario.id,
        userReceivingId: publisherId,
        typeInterationId: 2,
        date: new Date().toISOString(),
        comment: comment.trim(),
        username: usuario.username,
      };

      await AxiosConfiguration.post("interations", payload, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      setSnackbarMessage("Comentario agregado!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setComment("");
    } catch (error) {
      console.error("Error agregando comentario:", error);
      setSnackbarMessage("Error al agregar comentario");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setCommentsList((prev) =>
        prev.filter((c) => c.tempId !== tempComment?.tempId)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async () => {
    handleMenuClose();
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) return;

      const commentToDelete = commentsList.find(
        (c) => (c.id || c.tempId) === selectedCommentId
      );
      if (!commentToDelete) return;

      if (commentToDelete.id) {
        await AxiosConfiguration.delete(`interations/${selectedCommentId}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
      }
      setCommentsList((prev) =>
        prev.filter((c) => (c.id || c.tempId) !== selectedCommentId)
      );

      setSnackbarMessage("Comentario eliminado");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      if (!isEditing) setSelectedCommentId(null);
    } catch (error) {
      console.error("Error eliminando comentario:", error);
      setSnackbarMessage("Error al eliminar el comentario");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleEditMenuItemClick = () => {
    const commentToEdit = commentsList.find(
      (c) => (c.id || c.tempId) === selectedCommentId
    );
    if (commentToEdit) {
      setEditCommentText(commentToEdit.comment);
      setIsEditing(true);
    }
    setAnchorEl(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditCommentText("");
    setSelectedCommentId(null);
  };

  const handleSaveEdit = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) return;

      await AxiosConfiguration.patch(
        `interations/${selectedCommentId}/comment`,
        { comment: editCommentText },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      setCommentsList((prev) =>
        prev.map((c) => {
          if ((c.id || c.tempId) === selectedCommentId) {
            return { ...c, comment: editCommentText };
          }
          return c;
        })
      );

      setSnackbarMessage("Comentario editado");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error al editar comentario:", error);
      setSnackbarMessage("Error al editar comentario");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsEditing(false);
      setEditCommentText("");
      setSelectedCommentId(null);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="comments-modal"
      aria-describedby="comments-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "#1e2939",
          color: "white",
          borderRadius: 2,
          boxShadow: 24,
          p: 3,
          maxHeight: "80vh",
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">Comentarios</Typography>
          <IconButton onClick={handleClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ bgcolor: "#3a4a5c", mb: 2 }} />

        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mb: 2,
          }}
        >
          <TextField
            label="Escribe un comentario..."
            multiline
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            variant="filled"
            InputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: "#b0b0b0" } }}
            sx={{ backgroundColor: "#334155", borderRadius: 1 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCommentSubmit}
            disabled={isSubmitting || !comment.trim()}
            endIcon={
              isSubmitting && <CircularProgress size={20} color="inherit" />
            }
          >
            Enviar
          </Button>
        </Box>

        <Divider sx={{ bgcolor: "#3a4a5c", mb: 2 }} />

        <Box sx={{ mb: 2 }}>
          {commentsList.length === 0 ? (
            <Typography
              variant="body2"
              sx={{ color: "#b0b0b0", textAlign: "center" }}
            >
              Aún no hay comentarios.
            </Typography>
          ) : (
            commentsList.map((commentItem) => (
              <Box
                key={commentItem.id || commentItem.tempId}
                sx={{ mb: 2, position: "relative" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 0.5,
                    }}
                  >
                    <Avatar
                      src={commentItem.userGiving?.profilePic}
                      sx={{ width: 24, height: 24 }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: "white", fontWeight: 500 }}
                    >
                      {commentItem.username ||
                        (commentItem.userGiving && commentItem.userGiving.username) ||
                        "Usuario desconocido"}
                    </Typography>
                  </Box>

                  {(usuario?.id === commentItem.userGiving?.id ||
                    usuario?.id === commentItem.userGivingId) && (
                    <IconButton
                      size="small"
                      sx={{
                        color: "#b0b0b0",
                        "&:hover": {
                          color: "white",
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                        },
                      }}
                      onClick={(e) =>
                        handleMenuOpen(e, commentItem.id || commentItem.tempId)
                      }
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>

                {isEditing &&
                (commentItem.id || commentItem.tempId) === selectedCommentId ? (
                  <Box sx={{ ml: 4 }}>
                    <TextField
                      value={editCommentText}
                      onChange={(e) => setEditCommentText(e.target.value)}
                      variant="filled"
                      size="small"
                      fullWidth
                      sx={{ backgroundColor: "#334155", borderRadius: 1 }}
                      InputProps={{ style: { color: "white" } }}
                    />
                    <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={handleSaveEdit}
                      >
                        Guardar
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={handleCancelEdit}
                      >
                        Cancelar
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Typography variant="body2" sx={{ color: "white", ml: 4 }}>
                    {commentItem.comment}
                  </Typography>
                )}
                <Typography
                  variant="caption"
                  sx={{ color: "#b0b0b0", ml: 4, display: "block" }}
                >
                  {new Date(commentItem.date).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
              </Box>
            ))
          )}
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          sx={{
            "& .MuiPaper-root": {
              backgroundColor: "#334155",
              color: "white",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)",
              minWidth: "120px",
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem
            onClick={handleEditMenuItemClick}
            sx={{
              "&:hover": { backgroundColor: "#3a4a5c" },
              fontSize: "0.875rem",
              py: 1,
            }}
          >
            Editar
          </MenuItem>
          <MenuItem
            onClick={handleDeleteComment}
            sx={{
              "&:hover": { backgroundColor: "#3a4a5c" },
              fontSize: "0.875rem",
              py: 1,
              color: "#ff6666",
            }}
          >
            Eliminar
          </MenuItem>
        </Menu>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            severity={snackbarSeverity}
            sx={{
              backgroundColor:
                snackbarSeverity === "success" ? "#4caf50" : "#f44336",
              color: "#fff",
              "& .MuiAlert-icon": { color: "#fff" },
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Modal>
  );
};


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
    <Card
      sx={{
        maxWidth: 500,
        margin: "auto",
        marginBottom: 3,
        backgroundColor: "#1e2939",
        color: "#ffffff",
        borderRadius: 2,
        transition: "transform 0.2s",
        "&:hover": { transform: "scale(1.01)" },
      }}
    >
      <CardHeader
        avatar={
          <Avatar src={profilePic} alt={username} sx={{ width: 40, height: 40 }} />
        }
        title={<Typography variant="h6">{username}</Typography>}
        subheader={
          <Typography variant="caption" sx={{ color: "#b0b0b0" }}>
            {formatDate(date)}
          </Typography>
        }
      />

      <CardMedia
        component="img"
        image={imageUrl}
        alt="Post content"
        sx={{ maxHeight: 500, objectFit: "cover" }}
      />

      <CardActions disableSpacing>
        <IconButton
          onClick={handleLikeClick}
          sx={{
            color: isLiked ? "#ff4444" : "#ffffff",
            transition: "color 0.3s",
          }}
        >
          {isLiked ? (
            <FavoriteIcon fontSize="medium" />
          ) : (
            <FavoriteBorderIcon fontSize="medium" />
          )}
        </IconButton>

        <IconButton onClick={handleCommentsClick} sx={{ color: "#ffffff" }}>
          <ChatBubbleOutlineIcon fontSize="medium" />
        </IconButton>

        <IconButton sx={{ color: "#ffffff" }}>
          <ShareIcon fontSize="medium" />
        </IconButton>
      </CardActions>

      <CardContent>
        <Typography variant="body1" sx={{ mb: 1 }}>
          {description}
        </Typography>
        <Typography variant="body2" sx={{ color: "#ffffff" }}>
          {optimisticLikes} Me gusta
        </Typography>
        <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
          {comments.length} Comentarios
        </Typography>
      </CardContent>

      <Snackbar
        open={showSuccess}
        autoHideDuration={2000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="success"
          sx={{
            backgroundColor: "#4caf50",
            color: "#fff",
            "& .MuiAlert-icon": { color: "#fff" },
          }}
        >
          {actionType === "add" ? "❤️ ¡Like agregado!" : "💔 Like eliminado"}
        </Alert>
      </Snackbar>

      <CommentsModal
        open={commentsOpen}
        handleClose={() => setCommentsOpen(false)}
        postId={postId}
        publisherId={publisherId}
        onCommentAdded={handleCommentAdded}
        existingComments={comments}
      />
    </Card>
  );
};
