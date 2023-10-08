import React from "react";
import { es } from "date-fns/locale";
import { format, parseISO } from "date-fns";
import numeral from "numeral";
import {
  Box,
  Card,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Logo from "../../Logo";
import { statusMap } from "../../../constants";

const InvoicePreview = ({ invoice, ...other }) => {
  const { user, consumption, totalAmount, paymentStatus } = invoice;

  const monthName = format(parseISO(invoice.invoiceDate), "MMMM", {
    locale: es,
  });

  const paymentDateFormat = format(parseISO(invoice.paymentDate), "dd/MM/yyyy");
  const totalAmountFormatted = numeral(totalAmount).format("0,0.00");

  return (
    <Card {...other} sx={{ p: 6 }}>
      <Stack
        alignItems="flex-start"
        direction="row"
        justifyContent="space-between"
        spacing={3}
      >
        <div>
          <Box
            sx={{
              display: "inline-flex",
              height: 24,
              width: 24,
            }}
          >
            <img src="/logo.png" alt="logo" />
          </Box>
        </div>
        <div>
          <Typography align="right" color="success.main" variant="h4">
            {statusMap[paymentStatus].label.toUpperCase()}
          </Typography>
          <Typography align="right" variant="subtitle2">
            {invoice._id}
          </Typography>
        </div>
      </Stack>
      <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <Typography variant="h3" style={{ textTransform: "uppercase" }}>
          RECIBO
        </Typography>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Grid container justifyContent="space-between">
          <Grid xs={12} md={4}>
            <Typography gutterBottom variant="subtitle2">
              Socio
            </Typography>
            <Typography variant="body2">
              Nombre completo: {user.name} {user.lastName}
            </Typography>
            <Typography variant="body2">NIT: {user.nit}</Typography>
          </Grid>
          <Grid xs={12} md={4}>
            <Typography gutterBottom variant="subtitle2">
              Consumo
            </Typography>
            <Typography variant="body2">
              Fecha de lectura:{" "}
              {format(new Date(consumption.readingDate), "dd/MM/yyyy")}
              <br />
              Consumo: {consumption.consumptionCubicMeters} m³
            </Typography>
          </Grid>
          <Grid xs={12} md={4}>
            <Typography gutterBottom variant="subtitle2">
              Medidor
            </Typography>
            <Typography variant="body2">
              Código: {consumption.meter.code}
            </Typography>
            <Typography variant="body2">
              Categoría: {consumption.meter.category.name}
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Fecha de pago</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell>Consumo de agua del mes de {monthName}</TableCell>
              <TableCell>{paymentDateFormat}</TableCell>
              <TableCell align="right">{totalAmountFormatted}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2} sx={{ borderBottom: "none" }} />
              <TableCell sx={{ borderBottom: "none" }}>
                <Typography variant="subtitle1">Subtotal</Typography>
              </TableCell>
              <TableCell align="right" sx={{ borderBottom: "none" }}>
                <Typography variant="subtitle2">
                  {totalAmountFormatted}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2} sx={{ borderBottom: "none" }} />
              <TableCell sx={{ borderBottom: "none" }}>
                <Typography variant="subtitle1">Total</Typography>
              </TableCell>
              <TableCell align="right" sx={{ borderBottom: "none" }}>
                <Typography variant="subtitle2">
                  {totalAmountFormatted}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Box
          sx={{
            marginTop: 10,
            marginBottom: 1,
            width: "30%",
            borderBottom: 1,
            borderColor: "grey.500",
          }}
        />
        <Typography variant="h6" sx={{ marginLeft: 14 }}>
          Sello de Caja
        </Typography>
      </Box>
    </Card>
  );
};

export default InvoicePreview;
