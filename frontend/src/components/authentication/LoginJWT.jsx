import * as Yup from "yup";
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import { Alert, Box, Button, FormHelperText, TextField } from "@mui/material";
import useMounted from "../../hooks/useMounted";
import { useLoginMutation } from "../../services/endpoints/auth";
import { setCredentials } from "../../features/auth/authSlice";

const LoginJWT = (props) => {
  const mounted = useMounted();
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  return (
    <Formik
      initialValues={{
        email: "gustavoyampara1616@gmail.com",
        password: "NdeiPDv",
        submit: null,
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email("Must be a valid email")
          .max(255)
          .required("Email is required"),
        password: Yup.string().max(255).required("Password is required"),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          const {
            data: { user, token },
          } = await login(values).unwrap();

          dispatch(setCredentials({ user, token }));

          if (mounted.current) {
            setStatus({ success: true });
            setSubmitting(false);
          }
        } catch (err) {
          console.error(err);
          if (mounted.current) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values,
      }) => (
        <form noValidate onSubmit={handleSubmit} {...props}>
          <TextField
            autoFocus
            error={Boolean(touched.email && errors.email)}
            fullWidth
            helperText={touched.email && errors.email}
            label="Correo electrónico"
            margin="normal"
            name="email"
            onBlur={handleBlur}
            onChange={handleChange}
            type="email"
            value={values.email}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.password && errors.password)}
            fullWidth
            helperText={touched.password && errors.password}
            label="Contraseña"
            margin="normal"
            name="password"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            value={values.password}
            variant="outlined"
          />
          {errors.submit && (
            <Box sx={{ mt: 3 }}>
              <FormHelperText error>{errors.submit}</FormHelperText>
            </Box>
          )}
          <Box sx={{ mt: 2 }}>
            <Button
              color="primary"
              disabled={isSubmitting}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
            >
              Iniciar sesión
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default LoginJWT;
