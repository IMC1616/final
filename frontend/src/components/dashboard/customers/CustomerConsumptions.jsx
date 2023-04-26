import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectModalComponent,
  selectModalType,
  selectShowModal,
} from "../../../features/modal/modalSlice";
import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useGetMeterConsumptionsQuery } from "../../../services/endpoints/customers";

const CustomerConsumptions = ({ meterId }) => {
  console.log("🚀 ~ file: CustomerConsumptions.jsx:20 ~ CustomerConsumptions ~ meterId:", meterId)
  const dispatch = useDispatch();

  const showModal = useSelector(selectShowModal);
  const modalType = useSelector(selectModalType);
  const modalComponent = useSelector(selectModalComponent);

  const {
    isLoading,
    isFetching,
    isSuccess,
    data: meterConsumptionsData,
    error,
  } = useGetMeterConsumptionsQuery(meterId);

  if (isLoading) return <div>Cargando...</div>;

  return (
    <Grid container spacing={2} marginTop={2}>
      {meterConsumptionsData?.data.map((consumption) => (
        <Grid item xs={12} sm={12} md={12} key={consumption._id}>
          <Card
            sx={{
              backgroundColor: "background.default",
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Fecha de lectura:{" "}
                {new Date(consumption.readingDate).toLocaleDateString()}
              </Typography>
              <Typography variant="subtitle1">
                Lectura anterior: {consumption.previousReading}
              </Typography>
              <Typography variant="subtitle1">
                Lectura actual: {consumption.currentReading}
              </Typography>
              <Typography variant="subtitle1">
                Consumo (m³): {consumption.consumptionCubicMeters}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CustomerConsumptions;
