import React from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogTitle,
  Button,
  Box,
  Divider,
  Typography,
} from "@mui/material";
import { es } from "date-fns/locale";
import { format, parseISO } from "date-fns";
import { selectModalData } from "../../../features/modal/modalSlice";
import { usePayInvoiceMutation } from "../../../services/endpoints/invoices";

const PaymentModal = ({ isOpen, handleClose }) => {
  const invoice = useSelector(selectModalData);

  const [payInvoice] = usePayInvoiceMutation();

  const handlePayment = async () => {
    try {
      const resultAction = await payInvoice(invoice._id).unwrap();
      toast.success("Factura pagada con éxito!");

      handleClose();
      return resultAction;
    } catch (error) {
      console.error(error);
      toast.error("¡Algo salió mal!");
    }
  };

  const invoiceDate = invoice?.invoiceDate ? parseISO(invoice?.invoiceDate) : new Date();
  const monthName = format(invoiceDate, "MMMM", { locale: es });

  return (
    <Dialog fullWidth maxWidth="md" open={isOpen} onClose={handleClose}>
      <Box sx={{ p: 3 }}>
        <DialogTitle id="payment-dialog-title">
          Factura ID: {invoice?._id}
        </DialogTitle>
        <Divider />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mx: 3,
            mt: 1,
          }}
        >
          <Typography
            variant="h5"
            component="div"
            sx={{ fontWeight: "bold", mt: 2, mb: 3 }}
          >
            Monto a pagar: {invoice?.totalAmount.toFixed(2)} Bs por el mes de{" "}
            {monthName}. ¿Estás seguro de hacer el cobro?
          </Typography>
          <Box sx={{ display: "flex", width: "100%" }}>
            <Box sx={{ flexGrow: 1 }}>
              <Button
                color="error"
                size="large"
                variant="contained"
                onClick={handleClose}
                sx={{ width: "100%" }}
              >
                Cancelar
              </Button>
            </Box>
            <Box sx={{ flexGrow: 1, ml: 2 }}>
              <Button
                color="primary"
                size="large"
                variant="contained"
                onClick={handlePayment}
                sx={{ width: "100%" }}
              >
                Cobrar
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default PaymentModal;
