import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useGetCustomerPropertiesQuery } from "../../../services/endpoints/customers";
import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const CustomerProperties = ({ customerId }) => {

  const dispatch = useDispatch();

  const selectedProperty = selectSelectedProperty()

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
    }
  }, [customerPropertiesData]);

  if (isLoading) return <div>Cargando...</div>;

  return (
    <Grid container spacing={2} marginTop={2}>
      {customerPropertiesData?.data.map((property) => (
        <Grid item xs={12} sm={12} md={12} key={property._id}>
          <Card sx={{ backgroundColor: "background.default" }}>
            {property.latitud && property.longitud && mapReady ? (
              <div style={{ height: "200px" }}>
                <MapContainer
                  center={[property.latitud, property.longitud]}
                  zoom={16}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[property.latitud, property.longitud]}>
                    <Popup>{property.address}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            ) : (
              <Typography color="error">
                No se encontraron coordenadas para esta propiedad.
              </Typography>
            )}
            <CardActionArea>
              <CardContent>
                <Typography variant="h6">{property.address}</Typography>
                <Typography color="textSecondary">
                  Ciudad: {property.city}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CustomerProperties;
