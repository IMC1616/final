import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { selectSettings } from "../../../features/settings/settingsSlice";
import { useGetCustomerByIdQuery } from "../../../services/endpoints/customers";
import CustomerProperties from "../../../components/dashboard/customers/CustomerProperties";

const CustomerOverview = () => {
  const params = useParams();
  const settings = useSelector(selectSettings);

  const [customer, setCustomer] = useState(null);

  const {
    isLoading,
    isFetching,
    isSuccess,
    data: customerData,
    error,
  } = useGetCustomerByIdQuery(params.customerId);

  useEffect(() => {
    if (isSuccess) {
      setCustomer(customerData.data);
    }
  }, [isSuccess]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        minHeight: "100%",
        py: 8,
      }}
    >
      <Container maxWidth={settings.compact ? "xl" : false}>
        <Typography
          color="textPrimary"
          variant="h5"
        >{`${customer?.name} ${customer?.lastName}`}</Typography>
        <Typography
          color="textSecondary"
          variant="body1"
        >{`CI: ${customer?.ci}`}</Typography>
        <Typography
          color="textSecondary"
          variant="body1"
        >{`Teléfono: ${customer?.phone}`}</Typography>

        <Grid container spacing={1} marginTop={1}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ backgroundColor: "background.paper" }}>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="h6">Propiedades</Typography>
                  <Button variant="contained" color="primary">
                    Agregar
                  </Button>
                </Box>
                <CustomerProperties customerId={params.customerId} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ backgroundColor: "background.paper" }}>
              <CardContent>
                <Typography variant="h6">Medidores</Typography>
                {/* Aquí puedes mostrar la lista de medidores */}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ backgroundColor: "background.paper" }}>
              <CardContent>
                <Typography variant="h6">Consumos</Typography>
                {/* Aquí puedes mostrar la lista de consumos */}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CustomerOverview;
