import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { openModal } from "../../../features/modal/modalSlice";
import CustomerMeters from "../../../components/dashboard/customers/CustomerMeters";
import CustomerConsumptions from "../../../components/dashboard/customers/CustomerConsumptions";
import {
  selectSelectedMeter,
  selectSelectedProperty,
} from "../../../features/customers/customerSlice";

const CustomerOverview = () => {
  const dispatch = useDispatch();

  const params = useParams();
  const settings = useSelector(selectSettings);

  const [customer, setCustomer] = useState(null);

  const selectedProperty = useSelector(selectSelectedProperty);
  const selectedMeter = useSelector(selectSelectedMeter);

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
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      dispatch(
                        openModal({
                          component: "property",
                          type: "create",
                        })
                      );
                    }}
                  >
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
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="h6">Medidores</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      dispatch(
                        openModal({
                          component: "meter",
                          type: "create",
                        })
                      );
                    }}
                  >
                    Agregar
                  </Button>
                </Box>
                {selectedProperty && (
                  <CustomerMeters propertyId={selectedProperty} />
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ backgroundColor: "background.paper" }}>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="h6">Consumos</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      dispatch(
                        openModal({
                          component: "consumption",
                          type: "create",
                        })
                      );
                    }}
                  >
                    Agregar
                  </Button>
                </Box>
                {selectedMeter && (
                  <CustomerConsumptions meterId={selectedMeter} />
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CustomerOverview;
