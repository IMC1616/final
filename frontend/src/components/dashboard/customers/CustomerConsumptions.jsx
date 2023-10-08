import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  closeModal,
  openModal,
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
import { Edit } from "@mui/icons-material";
import { useGetMeterConsumptionsQuery } from "../../../services/endpoints/customers";
import CustomerConsumptionsModal from "./CustomerConsumptionsModal";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const CustomerConsumptions = ({ meterId }) => {
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
  console.log(
    "🚀 ~ file: CustomerConsumptions.jsx:39 ~ CustomerConsumptions ~ meterConsumptionsData:",
    meterConsumptionsData
  );

  const handleCloseModal = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

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
            <div style={{ position: "relative" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Fecha de lectura:{" "}
                  {format(new Date(consumption?.readingDate), "dd MMMM yyyy", {
                    locale: es,
                  })}
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
                <Typography variant="subtitle1">
                  Registradp por: {consumption?.registeredBy?.name}{" "}
                  {consumption?.registeredBy?.lastName}
                </Typography>
              </CardContent>
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "20px",
                  zIndex: 1000,
                }}
              >
                <Tooltip placement="left" title="Editar consumo">
                  <IconButton
                    edge="end"
                    sx={{
                      color: "white",
                      backgroundColor: "primary.main",
                      borderRadius: "4px",
                      "&:hover": {
                        backgroundColor: "primary.dark",
                      },
                    }}
                    onClick={() => {
                      dispatch(
                        openModal({
                          component: "consumption",
                          type: "edit",
                          data: consumption,
                        })
                      );
                    }}
                  >
                    <Edit />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          </Card>
        </Grid>
      ))}

      <CustomerConsumptionsModal
        isOpen={
          showModal &&
          modalComponent === "consumption" &&
          modalType !== "delete"
        }
        handleClose={handleCloseModal}
        meterConsumptionsData={meterConsumptionsData}
      />
    </Grid>
  );
};

export default CustomerConsumptions;
