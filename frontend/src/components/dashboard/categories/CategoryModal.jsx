import React from "react";
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
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "../../../services/endpoints/categories";
import { selectModalData } from "../../../features/modal/modalSlice";

const removeEmptyProperties = (obj) => {
  return Object.entries(obj).reduce((newObj, [key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      newObj[key] = value;
    }
    return newObj;
  }, {});
};

const CategoryModal = ({ isOpen, handleClose }) => {
  const data = useSelector(selectModalData);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  const handleSubmit = async (
    values,
    { setErrors, setStatus, setSubmitting }
  ) => {
    try {
      const cleanedValues = removeEmptyProperties(values);

      let resultAction;
      if (data?._id) {
        resultAction = await updateCategory(cleanedValues).unwrap();
        toast.success("Categoría actualizada!");
      } else {
        resultAction = await createCategory(cleanedValues).unwrap();
        toast.success("Categoría creada!");
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
          name: data?.name,
          pricePerCubicMeter: data?.pricePerCubicMeter,
          fixedPrice: data?.fixedPrice,
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string()
            .required("Debe ingresar el nombre")
            .matches(
              /^.{3,30}$/,
              "Mínimo 3 caracteres, máximo 30."
            ),
          pricePerCubicMeter: Yup.number()
            .min(0, "El valor debe ser mayor o igual a 0")
            .test(
              "solo-un-precio",
              "Debe ingresar un valor para Precio por metro cúbico o Precio fijo, pero no ambos.",
              function (value) {
                const { fixedPrice } = this.parent;
                return (!!value && !fixedPrice) || (!value && !!fixedPrice);
              }
            ),
          fixedPrice: Yup.number()
            .min(0, "El valor debe ser mayor o igual a 0")
            .test(
              "solo-un-precio",
              "Debe ingresar un valor para Precio por metro cúbico o Precio fijo, pero no ambos.",
              function (value) {
                const { pricePerCubicMeter } = this.parent;
                return (
                  (!!value && !pricePerCubicMeter) ||
                  (!value && !!pricePerCubicMeter)
                );
              }
            ),
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
                {data ? "Editar Categoría" : "Crear Categoría"}
              </DialogTitle>
              <Divider />
              <DialogContent>
                <Grid container spacing={3}>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <TextField
                      autoFocus
                      error={Boolean(touched.name && errors.name)}
                      fullWidth
                      helperText={touched.name && errors.name}
                      label="Categoría"
                      name="name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      required
                      value={values.name}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item lg={6} md={6} sm={6} xs={12}>
                    <TextField
                      error={Boolean(
                        touched.pricePerCubicMeter && errors.pricePerCubicMeter
                      )}
                      fullWidth
                      helperText={
                        touched.pricePerCubicMeter && errors.pricePerCubicMeter
                      }
                      label="Precio por metro cúbico"
                      name="pricePerCubicMeter"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.pricePerCubicMeter}
                      variant="outlined"
                      type="number"
                      disabled={!!values.fixedPrice}
                    />
                  </Grid>
                  <Grid item lg={6} md={6} sm={6} xs={12}>
                    <TextField
                      error={Boolean(touched.fixedPrice && errors.fixedPrice)}
                      fullWidth
                      helperText={touched.fixedPrice && errors.fixedPrice}
                      label="Precio fijo"
                      name="fixedPrice"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.fixedPrice}
                      variant="outlined"
                      type="number"
                      disabled={!!values.pricePerCubicMeter}
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
                    {data ? "Guardar Cambios" : "Crear Categoría"}
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

export default CategoryModal;
