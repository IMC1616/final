import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { Formik } from "formik";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Box,
  Grid,
  TextField,
  Divider,
} from "@mui/material";
import { selectModalData } from "../../../features/modal/modalSlice";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {
  useCreateCustomerPropertyMutation,
  useUpdateCustomerPropertyMutation,
} from "../../../services/endpoints/customers";

const getAddressFromLatLng = async (lat, lng) => {
  const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;

  try {
    const response = await fetch(apiUrl);
    const result = await response.json();
    if (result.address) {
      const { house_number, road, city } = result.address;
      let address = "";
      if (road) {
        address += road + " ";
      }
      if (house_number) {
        address += "#" + house_number;
      }
      return { address, city };
    } else {
      throw new Error("No se encontró ninguna dirección");
    }
  } catch (error) {
    console.error(error);
    return { address: "", city: "" };
  }
};

const CustomerPropertiesModal = ({ isOpen, handleClose }) => {
  const data = useSelector(selectModalData);
  const params = useParams();
  const [currentPosition, setCurrentPosition] = useState(null);

  const [createProperty] = useCreateCustomerPropertyMutation();
  const [updateProperty] = useUpdateCustomerPropertyMutation();

  const getCurrentPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition([latitude, longitude]);
        },
        () => {
          console.error("No se pudo obtener la ubicación actual");
        }
      );
    } else {
      console.error("La API Geolocation no es soportada por el navegador");
    }
  };

  useEffect(() => {
    getCurrentPosition();
  }, []);

  const handleSubmit = async (
    values,
    { setErrors, setStatus, setSubmitting }
  ) => {
    try {
      let resultAction;
      if (data?._id) {
        resultAction = await updateProperty(values).unwrap();
        toast.success("Propiedad actualizada!");
      } else {
        resultAction = await createProperty(values).unwrap();
        toast.success("Propiedad creada!");
      }

      setStatus({ success: true });
      setSubmitting(false);
      handleClose();
      return resultAction;
    } catch (error) {
      console.error(error);
      setStatus({ success: false });
      setSubmitting(false);

      if (error.data) {
        const serverErrors = error.data.errors;
        const formErrors = {};

        serverErrors.forEach((err) => {
          formErrors[err.param] = err.msg;
        });

        setErrors(formErrors);
        toast.error("Por favor, corrija los errores en el formulario.");
      } else {
        toast.error("¡Algo salió mal!");
        setErrors({ submit: error.message });
      }
    }
  };

  return (
    <Dialog fullWidth maxWidth="md" open={isOpen} onClose={handleClose}>
      <Formik
        initialValues={{
          _id: data?._id,
          address: data?.address || "",
          city: data?.city || "",
          latitude:
            data?.latitude || (currentPosition && currentPosition[0]) || "",
          longitude:
            data?.longitude || (currentPosition && currentPosition[1]) || "",
          user: data?.user || params.customerId,
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          address: Yup.string()
            .max(255, "La dirección no puede tener más de 255 caracteres")
            .required("La dirección es requerida"),
          city: Yup.string()
            .max(100, "La ciudad no puede tener más de 100 caracteres")
            .required("La ciudad es requerida"),
          latitude: Yup.number().required("La latitud es requerida"),
          longitude: Yup.number().required("La longitud es requerida"),
          user: Yup.string().required("El usuario es requerido"),
        })}
        onSubmit={handleSubmit}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          setFieldValue,
          touched,
          values,
        }) => {
          const [markerPosition, setMarkerPosition] = useState([
            parseFloat(values.latitude) || 0,
            parseFloat(values.longitude) || 0,
          ]);

          const handleMarkerDrag = async (event) => {
            const newPosition = event.target.getLatLng();
            setMarkerPosition([newPosition.lat, newPosition.lng]);
            setFieldValue("latitude", newPosition.lat);
            setFieldValue("longitude", newPosition.lng);

            const { address, city } = await getAddressFromLatLng(
              newPosition.lat,
              newPosition.lng
            );
            setFieldValue("address", address);
            setFieldValue("city", city);
          };

          return (
            <form onSubmit={handleSubmit}>
              <Box sx={{ p: 3 }}>
                <DialogTitle id="form-dialog-title">
                  {data ? "Editar Propiedad" : "Crear Propiedad"}
                </DialogTitle>
                <Divider />
                <DialogContent>
                  <Grid container spacing={3}>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                      <MapContainer
                        center={markerPosition}
                        zoom={13}
                        style={{ height: "400px", width: "100%" }}
                      >
                        <TileLayer
                          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker
                          position={markerPosition}
                          draggable
                          eventHandlers={{
                            dragend: handleMarkerDrag,
                          }}
                        >
                          <Popup>Posición actual</Popup>
                        </Marker>
                      </MapContainer>
                    </Grid>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                      <TextField
                        autoFocus
                        error={Boolean(touched.address && errors.address)}
                        fullWidth
                        helperText={touched.address && errors.address}
                        label="Dirección"
                        name="address"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        required
                        value={values.address}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                      <TextField
                        error={Boolean(touched.city && errors.city)}
                        fullWidth
                        helperText={touched.city && errors.city}
                        label="Ciudad"
                        name="city"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        required
                        value={values.city}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                </DialogContent>
                <Divider />
                <Box sx={{ display: "flex", mx: 3, mt: 1 }}>
                  <Box sx={{ mt: 2 }}>
                    <Button
                      color="error"
                      size="large"
                      variant="contained"
                      onClick={handleClose}
                    >
                      Cancelar
                    </Button>
                  </Box>
                  <Box sx={{ flexGrow: 1 }} />
                  <Box sx={{ mt: 2 }}>
                    <Button
                      color="primary"
                      size="large"
                      variant="contained"
                      disabled={isSubmitting}
                      type="submit"
                    >
                      {data ? "Guardar Cambios" : "Crear Propiedad"}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </form>
          );
        }}
      </Formik>
    </Dialog>
  );
};

export default CustomerPropertiesModal;
