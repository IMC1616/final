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
  MenuItem,
} from "@mui/material";
import { selectModalData } from "../../../features/modal/modalSlice";
import {
  useCreatePropertyMeterMutation,
  useUpdatePropertyMeterMutation,
} from "../../../services/endpoints/customers";
import { meterStatuses } from "../../../constants";
import { selectSelectedProperty } from "../../../features/customers/customerSlice";
import { useGetCategoriesQuery } from "../../../services/endpoints/categories";

const CustomerMetersModal = ({ isOpen, handleClose }) => {
  const data = useSelector(selectModalData);
  const params = useParams();

  const [createMeter] = useCreatePropertyMeterMutation();
  const [updateMeter] = useUpdatePropertyMeterMutation();

  const selectedProperty = useSelector(selectSelectedProperty);

  const {
    isLoading: isLoadingCategories,
    isFetching: isFetchingCategories,
    isSuccess: isSuccessCategories,
    data: fetchedDataCategories,
    isError: isErrorCategories,
  } = useGetCategoriesQuery("/categories");

  const handleSubmit = async (
    values,
    { setErrors, setStatus, setSubmitting }
  ) => {
    try {
      let resultAction;
      if (data?._id) {
        resultAction = await updateMeter(values).unwrap();
        toast.success("Medidor actualizado!");
      } else {
        resultAction = await createMeter(values).unwrap();
        toast.success("Medidor creado!");
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
          code: data?.code || "",
          status: data?.status || "active",
          property: data?.property || selectedProperty,
          category: data?.category?._id || "",
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          code: Yup.string()
            .max(255, "El código no puede tener más de 255 caracteres")
            .required("El código es requerido"),
          status: Yup.string()
            .oneOf(
              ["active", "inactive", "damaged", "suspended"],
              "Estado inválido"
            )
            .required("El estado es requerido"),
          property: Yup.string().required("La propiedad es requerida"),
          category: Yup.string().required("La categoría es requerida"),
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
        }) => (
          <form onSubmit={handleSubmit}>
            <Box sx={{ p: 3 }}>
              <DialogTitle id="form-dialog-title">
                {data ? "Editar Medidor" : "Crear Medidor"}
              </DialogTitle>
              <Divider />
              <DialogContent>
                <Grid container spacing={3}>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <TextField
                      autoFocus
                      error={Boolean(touched.code && errors.code)}
                      fullWidth
                      helperText={touched.code && errors.code}
                      label="Código"
                      name="code"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      required
                      value={values.code}
                      variant="outlined"
                    />
                  </Grid>
                  {meterStatuses && (
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                      <TextField
                        select
                        error={Boolean(touched.status && errors.status)}
                        fullWidth
                        helperText={touched.status && errors.status}
                        label="Estado"
                        name="status"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        required
                        value={values.status}
                        variant="outlined"
                      >
                        {Object.entries(meterStatuses).map(([key, value]) => (
                          <MenuItem key={key} value={key}>
                            {value}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  )}
                  {fetchedDataCategories && (
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                      <TextField
                        select
                        error={Boolean(touched.category && errors.category)}
                        fullWidth
                        helperText={touched.category && errors.category}
                        label="Categoría"
                        name="category"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        required
                        value={values.category}
                        variant="outlined"
                      >
                        {fetchedDataCategories.data.categories.map(
                          (category) => (
                            <MenuItem key={category._id} value={category._id}>
                              {category.name} - Precio:{" "}
                              {category.pricePerCubicMeter
                                ? `${category.pricePerCubicMeter} por m³`
                                : `${category.fixedPrice} fijo`}
                            </MenuItem>
                          )
                        )}
                      </TextField>
                    </Grid>
                  )}
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
                    {data ? "Guardar Cambios" : "Crear Medidor"}
                  </Button>
                </Box>
              </Box>
            </Box>
          </form>
        )}
      </Formik>
    </Dialog>
  );
};

export default CustomerMetersModal;
