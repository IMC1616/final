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
  useCreateReconnectionMutation,
  useUpdateReconnectionMutation,
} from "../../../services/endpoints/reconnections";
import { selectModalData } from "../../../features/modal/modalSlice";

const removeEmptyProperties = (obj) => {
  return Object.entries(obj).reduce((newObj, [key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      newObj[key] = value;
    }
    return newObj;
  }, {});
};

const ReconnectionModal = ({ isOpen, handleClose }) => {
  const data = useSelector(selectModalData);

  const [createReconnection] = useCreateReconnectionMutation();
  const [updateReconnection] = useUpdateReconnectionMutation();

  const handleSubmit = async (
    values,
    { setErrors, setStatus, setSubmitting }
  ) => {
    try {
      const cleanedValues = removeEmptyProperties(values);

      let resultAction;
      if (data?._id) {
        resultAction = await updateReconnection(cleanedValues).unwrap();
        toast.success("Reconexión actualizada!");
      } else {
        resultAction = await createReconnection(cleanedValues).unwrap();
        toast.success("Reconexión creada!");
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
          amount: data?.amount,
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string()
            .required("Debe ingresar el nombre")
            .matches(/^.{3,30}$/, "Mínimo 3 caracteres, máximo 30."),
          amount: Yup.number()
            .min(0, "El valor debe ser mayor o igual a 0")
            .required("Debe ingresar el precio de reconexión"),
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
                {data ? "Editar Reconexión" : "Crear Reconexión"}
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
                      label="Reconexión"
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
                      error={Boolean(touched.amount && errors.amount)}
                      fullWidth
                      helperText={touched.amount && errors.amount}
                      label="Precio de reconexión"
                      name="amount"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.amount}
                      variant="outlined"
                      type="number"
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
                    {data ? "Guardar Cambios" : "Crear Reconexión"}
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

export default ReconnectionModal;
