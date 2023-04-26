import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useGetCustomerPropertiesQuery } from "../../../services/endpoints/customers";
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
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {
  closeModal,
  openModal,
  selectModalComponent,
  selectModalType,
  selectShowModal,
} from "../../../features/modal/modalSlice";
import {
  selectProperty,
  selectSelectedProperty,
} from "../../../features/customers/customerSlice";
import CustomerPropertiesModal from "./CustomerPropertiesModal";

const CustomerProperties = ({ customerId }) => {
  const dispatch = useDispatch();

  const showModal = useSelector(selectShowModal);
  const modalType = useSelector(selectModalType);
  const modalComponent = useSelector(selectModalComponent);

  const selectedProperty = useSelector(selectSelectedProperty);

  const {
    isLoading,
    isFetching,
    isSuccess,
    data: customerPropertiesData,
    error,
  } = useGetCustomerPropertiesQuery(customerId);

  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (customerPropertiesData) {
      setMapReady(true);
      if (customerPropertiesData.data.length > 0) {
        dispatch(selectProperty(customerPropertiesData.data[0]._id));
      }
    }
  }, [customerPropertiesData, dispatch]);
  

  const handleCloseModal = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

  if (isLoading) return <div>Cargando...</div>;

  return (
    <Grid container spacing={2} marginTop={2}>
      {customerPropertiesData?.data.map((property) => (
        <Grid item xs={12} sm={12} md={12} key={property._id}>
          <Card
            sx={{
              backgroundColor: "background.default",
              borderRight: (theme) =>
                selectedProperty === property._id
                  ? `10px solid ${theme.palette.error.main}`
                  : "none",
            }}
          >
            <div style={{ position: "relative" }}>
              {property.latitude && property.longitude && mapReady ? (
                <div style={{ height: "200px" }}>
                  <MapContainer
                    center={[property.latitude, property.longitude]}
                    zoom={16}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> colaboradores'
                    />
                    <Marker position={[property.latitude, property.longitude]}>
                      <Popup>{property.address}</Popup>
                    </Marker>
                  </MapContainer>

                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "20px",
                      zIndex: 1000,
                    }}
                  >
                    <Tooltip placement="left" title="Editar propiedad">
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
                              component: "property",
                              type: "edit",
                              data: property,
                            })
                          );
                        }}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              ) : (
                <Typography color="error">
                  No se encontraron coordenadas para esta propiedad.
                </Typography>
              )}
            </div>
            <CardActionArea
              onClick={() => {
                dispatch(selectProperty(property._id));
              }}
            >
              <CardContent>
                <Typography variant="h6">{property.address}</Typography>
                <Typography color="textSecondary">{property.city}</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
      <CustomerPropertiesModal
        isOpen={
          showModal && modalComponent === "property" && modalType !== "delete"
        }
        handleClose={handleCloseModal}
      />
    </Grid>
  );
};

export default CustomerProperties;
