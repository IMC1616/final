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
import { useGetPropertyMetersQuery } from "../../../services/endpoints/customers";
import {
  selectMeter,
  selectSelectedMeter,
} from "../../../features/customers/customerSlice";

const CustomerMeters = ({ propertyId }) => {
  const dispatch = useDispatch();

  const showModal = useSelector(selectShowModal);
  const modalType = useSelector(selectModalType);
  const modalComponent = useSelector(selectModalComponent);

  const selectedMeter = useSelector(selectSelectedMeter);

  const {
    isLoading,
    isFetching,
    isSuccess,
    data: propertyMetersData,
    error,
  } = useGetPropertyMetersQuery(propertyId);

  useEffect(() => {
    if (propertyMetersData?.data.length > 0) {
      dispatch(selectMeter(propertyMetersData.data[0]._id));
    } else {
      dispatch(selectMeter(null));
    }
  }, [propertyMetersData]);


  if (isLoading) return <div>Cargando...</div>;

  return (
    <Grid container spacing={2} marginTop={2}>
      {propertyMetersData?.data.map((meter) => (
        <Grid item xs={12} sm={12} md={12} key={meter._id}>
          <Card
            sx={{
              backgroundColor: "background.default",
              borderRight: (theme) =>
                selectedMeter === meter._id
                  ? `10px solid ${theme.palette.error.main}`
                  : "none",
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Código del medidor: {meter.code}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  backgroundColor: meter.status === "active" ? "success.main" : "error.main",
                  borderRadius: "4px",
                  color: "common.white",
                  display: "inline-block",
                  fontWeight: "bold",
                  padding: "4px 8px",
                }}
              >
                Estado: {meter.status}
              </Typography>
              <Typography variant="subtitle1" marginTop={1}>
                Categoría: {meter.category.name}
              </Typography>
              {meter.category.pricePerCubicMeter && (
                <Typography variant="subtitle1" marginTop={1}>
                  Precio por m³: {meter.category.pricePerCubicMeter}
                </Typography>
              )}
              {meter.category.fixedPrice && (
                <Typography variant="subtitle1" marginTop={1}>
                  Precio fijo: {meter.category.fixedPrice}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
  
};

export default CustomerMeters;
