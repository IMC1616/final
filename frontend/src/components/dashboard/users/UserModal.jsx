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
  MenuItem,
  Divider,
} from "@mui/material";
import MuiPhoneNumber from "material-ui-phone-number-2";
import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from "../../../services/endpoints/users";
import { selectModalData } from "../../../features/modal/modalSlice";
import { roles } from "../../../constants";

const UserModal = ({ isOpen, handleClose }) => {
  const data = useSelector(selectModalData);

  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const handleSubmit = async (
    values,
    { setErrors, setStatus, setSubmitting }
  ) => {
    try {
      let resultAction;
      if (data?._id) {
        resultAction = await updateUser(values).unwrap();
        toast.success("¡Usuario actualizado!");
      } else {
        resultAction = await createUser(values).unwrap();
        toast.success("¡Usuario creado!");
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
          lastName: data?.lastName,
          ci: data?.ci,
          email: data?.email,
          phone: data?.phone,
          role: data?.role || "admin",
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string()
            .required("Debe ingresar el nombre")
            .matches(
              /^(?=.{3,30}$)[a-zA-Z ]*$/,
              "Mínimo 3 caracteres, máximo 30. Solo letras."
            ),
          lastName: Yup.string()
            .max(255)
            .required("Debe ingresar los apellidos")
            .matches(
              /^(?=.{3,100}$)[a-zA-Z ]*$/,
              "Mínimo 3 caracteres, máximo 100. Solo letras."
            ),
          ci: Yup.string().required("Debe ingresar el Carnet de Identidad"),
          email: Yup.string()
            .max(255)
            .email("Debe ser un correo electrónico válido")
            .required("Correo electrónico es requerido"),
          phone: Yup.string().max(50),
          role: Yup.string().required("Debe asignar un rol"),
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
                {data ? "Editar Usuario" : "Crear Usuario"}
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
                      label="Nombre"
                      name="name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      required
                      value={values.name}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <TextField
                      error={Boolean(touched.lastName && errors.lastName)}
                      fullWidth
                      helperText={touched.lastName && errors.lastName}
                      label="Apellidos"
                      name="lastName"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      required
                      value={values.lastName}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item lg={7} md={7} sm={7} xs={12}>
                    <TextField
                      error={Boolean(touched.email && errors.email)}
                      fullWidth
                      helperText={touched.email && errors.email}
                      label="Correo electrónico"
                      name="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      required
                      value={values.email}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item lg={5} md={5} sm={5} xs={12}>
                    <TextField
                      error={Boolean(touched.ci && errors.ci)}
                      fullWidth
                      helperText={touched.ci && errors.ci}
                      label="Carnet de Identidad"
                      name="ci"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      required
                      value={values.ci}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item lg={7} md={7} sm={7} xs={12}>
                    <MuiPhoneNumber
                      label="Teléfono"
                      fullWidth
                      variant="outlined"
                      defaultCountry={"bo"}
                      value={values.phone}
                      onChange={(newValue) => setFieldValue("phone", newValue)}
                    />
                  </Grid>
                  <Grid item lg={5} md={5} sm={5} xs={12}>
                    <TextField
                      error={Boolean(touched.role && errors.role)}
                      fullWidth
                      helperText={touched.role && errors.role}
                      label="Rol"
                      name="role"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.role}
                      variant="outlined"
                      select
                    >
                      {roles.map((opcion) => (
                        <MenuItem key={opcion.value} value={opcion.value}>
                          {opcion.label}
                        </MenuItem>
                      ))}
                    </TextField>
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
                    {data ? "Guardar Cambios" : "Crear Usuario"}
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

export default UserModal;
