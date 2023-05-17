import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import { Link as RouterLink } from "react-router-dom";
import ArrowLeftIcon from "../../../icons/ArrowLeft";
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Link,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";

import getInitials from "../../../utils/getInitials";
import { useGetInvoiceByIdQuery } from "../../../services/endpoints/invoices";
import InvoicePreview from "../../../components/dashboard/invoices/InvoicePreview";
import { InvoicePdfDialog } from "../../../components/dashboard/invoices/InvoicePdfDialog";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { InvoicePdfDocument } from "../../../components/dashboard/invoices/InvoicePdfDocument";

const InvoiceOverview = () => {
  const dispatch = useDispatch();

  const params = useParams();

  const [invoice, setInvoice] = useState(null);
  const [openPdf, setOpenPdf] = useState(false);

  const {
    isLoading,
    isFetching,
    isSuccess,
    data: invoiceData,
    error,
  } = useGetInvoiceByIdQuery(params.invoiceId);

  useEffect(() => {
    if (isSuccess) {
      setInvoice(invoiceData.data);
    }
  }, [isSuccess]);

  if (isFetching || isLoading) return <div>Loading...</div>;

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack divider={<Divider />} spacing={4}>
            <Stack spacing={4}>
              <div>
                <Link
                  color="text.primary"
                  component={RouterLink}
                  to={"/dashboard/invoices/"}
                  sx={{
                    alignItems: "center",
                    display: "inline-flex",
                  }}
                  underline="hover"
                >
                  <SvgIcon sx={{ mr: 1 }}>
                    <ArrowLeftIcon />
                  </SvgIcon>
                  <Typography variant="subtitle2">Recibos</Typography>
                </Link>
              </div>
              <Stack
                alignItems="flex-start"
                direction="row"
                justifyContent="space-between"
                spacing={4}
              >
                <Stack alignItems="center" direction="row" spacing={2}>
                  <Avatar
                    sx={{
                      height: 42,
                      width: 42,
                    }}
                  >
                    {getInitials(
                      `${invoice?.user?.name} ${invoice?.user?.lastName}`
                    )}
                  </Avatar>
                  <div>
                    <Typography variant="h4">ID: {invoice?._id}</Typography>
                    <Typography color="text.secondary" variant="body2">
                      {`${invoice?.user?.name} ${invoice?.user?.lastName}`}
                    </Typography>
                  </div>
                </Stack>
                {invoice && (
                  <Stack alignItems="center" direction="row" spacing={2}>
                    <Button color="inherit" onClick={() => setOpenPdf(true)}>
                      Vista previa
                    </Button>
                    <PDFDownloadLink
                      document={<InvoicePdfDocument invoice={invoice} />}
                      fileName="invoice"
                      style={{ textDecoration: "none" }}
                    >
                      <Button color="primary" variant="contained">
                        Descargar
                      </Button>
                    </PDFDownloadLink>
                  </Stack>
                )}
              </Stack>
            </Stack>
            {invoice && <InvoicePreview invoice={invoice} />}
          </Stack>
        </Container>
      </Box>

      <InvoicePdfDialog
        open={openPdf}
        onClose={() => setOpenPdf(false)}
        invoice={invoice}
      />
    </>
  );
};

export default InvoiceOverview;
