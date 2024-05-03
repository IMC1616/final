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
  const { user, meter, consumption, totalAmount, paymentStatus, invoiceType } =
    invoice;
  console.log("🚀 ~ InvoicePreview ~ consumption:", consumption);

  const monthName = format(parseISO(invoice.invoiceDate), "MMMM", {
    locale: es,
  });
  const totalAmountFormatted = numeral(totalAmount).format("0,0.00");

  return (
    <Card {...other} sx={{ p: 6 }}>
      <Stack
        alignItems="flex-start"
        direction="row"
        justifyContent="space-between"
        spacing={3}
      >
        <figure>
          <img src="/logo.png" alt="Logo" width={50} />
        </figure>
        <div>
          <Typography align="right" color="success.main" variant="h4">
            {statusMap[paymentStatus].label.toUpperCase()}
          </Typography>
          <Typography align="right" variant="subtitle2">
            Factura ID: {invoice._id}
          </Typography>
        </div>
      </Stack>
      <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <Typography variant="h3" style={{ textTransform: "uppercase" }}>
          {invoiceType === "Reconnection" ? "RECIBO DE RECONEXIÓN" : "RECIBO"}
        </Typography>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Grid container justifyContent="space-between">
          <Grid item xs={12} md={4}>
            <Typography gutterBottom variant="subtitle2">
              Socio
            </Typography>
            <Typography variant="body2">
              {user?.name} {user?.lastName}
            </Typography>
            <Typography variant="body2">NIT/CI: {user.ci}</Typography>
          </Grid>
          {consumption && (
            <Grid item xs={12} md={4}>
              <Typography gutterBottom variant="subtitle2">
                Medidor
              </Typography>
              <Typography variant="body2">
                Código: {consumption?.meter?.code}
              </Typography>
              <Typography variant="body2">
                Categoría: {consumption?.meter?.category?.name}
              </Typography>
            </Grid>
          )}
          {typeof meter === "object" && (
            <>
              <Grid item xs={12} md={4}>
                <Typography gutterBottom variant="subtitle2">
                  Medidor
                </Typography>
                <Typography variant="body2">Código: {meter?.code}</Typography>
                <Typography variant="body2">
                  Categoría: {meter?.category?.name}
                </Typography>
              </Grid>
            </>
          )}
        </Grid>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Descripción</TableCell>
              {invoiceType !== "Reconnection" && (
                <>
                  <TableCell>Consumo</TableCell>
                  <TableCell>Tarifa</TableCell>
                </>
              )}
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell>
                {invoiceType === "Reconnection"
                  ? "Cargo por reconexión"
                  : `Consumo de agua del mes de ${monthName}`}
              </TableCell>
              {invoiceType !== "Reconnection" && (
                <>
                  <TableCell>
                    {consumption?.consumptionCubicMeters} m³
                  </TableCell>
                  <TableCell>
                    {consumption?.meter?.category?.fixedPrice ??
                      consumption?.meter?.category?.pricePerCubicMeter}{" "}
                    Bs
                  </TableCell>
                </>
              )}

              <TableCell align="right">{totalAmountFormatted} Bs</TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                colSpan={invoiceType === "Reconnection" ? 1 : 3}
                sx={{ borderBottom: "none" }}
              />
              <TableCell sx={{ borderBottom: "none" }}>
                <Typography variant="subtitle1">Total</Typography>
              </TableCell>
              <TableCell align="right" sx={{ borderBottom: "none" }}>
                <Typography variant="subtitle2">
                  {totalAmountFormatted} Bs
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </Card>
  );
};

export default InvoicePreview;
