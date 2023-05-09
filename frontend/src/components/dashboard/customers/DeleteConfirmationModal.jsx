import React from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  Box,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { Alert } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { selectModalData } from "../../../features/modal/modalSlice";
import { useDeleteCustomerMutation } from "../../../services/endpoints/customers";

const DeleteConfirmationModal = ({ open, handleClose }) => {
  const data = useSelector(selectModalData);
  const [deleteCustomer] = useDeleteCustomerMutation();

  const handleConfirm = async () => {
    try {
      await deleteCustomer(data?._id);

      toast.success("Cliente eliminado!");
      handleClose();
    } catch (error) {
      toast.error("¡Algo salió mal!");
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      onClose={handleClose}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <DialogTitle id="dialog-title" align="center">
        <Alert severity="warning" icon={<Delete fontSize="inherit" />}>
          ¿Estás seguro de eliminar el cliente {data?.name}?
        </Alert>
      </DialogTitle>
      <DialogContent dividers align="center">
        <DialogContentText id="dialog-description">
          ¡No podrás revertir esto!
        </DialogContentText>
      </DialogContent>
      <Box
        sx={{ display: "flex", mx: 3, my: 2, justifyContent: "space-around" }}
      >
        <Button
          color="error"
          variant="contained"
          size="large"
          onClick={handleClose}
        >
          Cancelar
        </Button>
        <Button
          color="primary"
          onClick={handleConfirm}
          variant="contained"
          size="large"
        >
          ¡Sí, bórralo!
        </Button>
      </Box>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
