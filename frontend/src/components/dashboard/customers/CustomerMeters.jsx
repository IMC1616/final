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
import { useGetPropertyMetersQuery } from "../../../services/endpoints/customers";
import {
  selectMeter,
  selectSelectedMeter,
} from "../../../features/customers/customerSlice";
import CustomerMetersModal from "./CustomerMetersModal";
import { meterStatuses } from "../../../constants";
import Guard from "../../Guards/Guard";

const getStatusBackgroundColor = (status) => {
  switch (status) {
    case "active":
      return "success.main";
    case "inactive":
      return "warning.main";
    case "damaged":
      return "error.main";
    case "suspended":
      return "info.main";
    default:
      return "text.primary";
  }
};

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
  }, [propertyMetersData, dispatch]);

  const handleCloseModal = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

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
            <div style={{ position: "relative" }}>
              <CardActionArea
                onClick={() => {
                  dispatch(selectMeter(meter._id));
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Código del medidor: {meter.code}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      backgroundColor: getStatusBackgroundColor(meter.status),
                      borderRadius: "4px",
                      color: "common.white",
                      display: "inline-block",
                      fontWeight: "bold",
                      padding: "4px 8px",
                    }}
                  >
                    Estado: {meterStatuses[meter.status]}
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
              </CardActionArea>
              <Guard item roles={["admin"]}>
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "20px",
                    zIndex: 1000,
                  }}
                >
                  <Tooltip placement="left" title="Editar medidor">
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
                            component: "meter",
                            type: "edit",
                            data: meter,
                          })
                        );
                      }}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                </div>
              </Guard>
            </div>
          </Card>
        </Grid>
      ))}
      <CustomerMetersModal
        isOpen={
          showModal && modalComponent === "meter" && modalType !== "delete"
        }
        handleClose={handleCloseModal}
      />
    </Grid>
  );
};

export default CustomerMeters;
