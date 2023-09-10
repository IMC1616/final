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
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { selectModalData } from "../../../features/modal/modalSlice";
import {
  useCreateMeterConsumptionMutation,
  useUpdateMeterConsumptionMutation,
} from "../../../services/endpoints/customers";
import { selectSelectedMeter } from "../../../features/customers/customerSlice";
import { formatISO } from "date-fns";

function findLastConsumption(data) {
  if (!data || !data.length) {
    return null;
  }

  const sortedData = data
    .slice()
    .sort((a, b) => new Date(a.readingDate) - new Date(b.readingDate));
  return sortedData[sortedData.length - 1];
}

const CustomerConsumptionsModal = ({
  isOpen,
  handleClose,
  meterConsumptionsData,
}) => {
  const data = useSelector(selectModalData);
  const params = useParams();

  const [createConsumption] = useCreateMeterConsumptionMutation();
  const [updateConsumption] = useUpdateMeterConsumptionMutation();

  const selectedMeter = useSelector(selectSelectedMeter);

  const handleSubmit = async (
    values,
    { setErrors, setStatus, setSubmitting }
  ) => {
    try {
      const payload = {
        ...values,
        readingDate: formatISO(values.readingDate),
      };

      let resultAction;
      if (data?._id) {
        resultAction = await updateConsumption(payload).unwrap();
        toast.success("Consumo actualizado!");
      } else {
        resultAction = await createConsumption(payload).unwrap();
        toast.success("Consumo creado!");
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

  const lastConsumption = findLastConsumption(meterConsumptionsData?.data);

  return (
    <Dialog fullWidth maxWidth="md" open={isOpen} onClose={handleClose}>
      <Formik
        initialValues={{
          _id: data?._id,
          readingDate: data?.readingDate
            ? new Date(data?.readingDate)
            : new Date(),

          previousReading:
            data?.previousReading || lastConsumption?.currentReading || 0,
          currentReading:
            data?.currentReading || lastConsumption?.currentReading,
          consumptionCubicMeters: data?.consumptionCubicMeters || "",
          meter: data?.meter || selectedMeter,
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          readingDate: Yup.date()
            .required("La fecha de lectura es requerida")
            .typeError("Fecha no válida."),
          previousReading: Yup.number().required(
            "La lectura anterior es requerida"
          ),
          currentReading: Yup.number()
            .required("La lectura actual es requerida")
            .test(
              "is-greater",
              "La lectura actual debe ser mayor que la lectura anterior",
              function (value) {
                const { previousReading } = this.parent;
                return value > previousReading;
              }
            ),
          consumptionCubicMeters: Yup.number().required(
            "El consumo en metros cúbicos es requerido"
          ),
          meter: Yup.string().required("El medidor es requerido"),
        })}
        validateOnBlur={true}
        validateOnChange={true}
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
          useEffect(() => {
            const consumption = values.currentReading - values.previousReading;
            setFieldValue("consumptionCubicMeters", consumption);
          }, [values.currentReading, values.previousReading, setFieldValue]);

          return (
            <form onSubmit={handleSubmit}>
              <Box sx={{ p: 3 }}>
                <DialogTitle id="form-dialog-title">
                  {data ? "Editar Consumo" : "Registrar Consumo"}
                </DialogTitle>
                <Divider />
                <DialogContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <MobileDatePicker
                        label="Fecha de lectura"
                        value={values.readingDate}
                        onChange={(newValue) =>
                          setFieldValue("readingDate", newValue)
                        }
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: Boolean(errors.readingDate),
                            helperText: errors.readingDate,
                            required: true,
                            name: "readingDate",
                            variant: "outlined",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        error={Boolean(
                          touched.previousReading && errors.previousReading
                        )}
                        fullWidth
                        helperText={
                          touched.previousReading && errors.previousReading
                        }
                        label="Lectura anterior"
                        name="previousReading"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        required
                        type="number"
                        value={values.previousReading}
                        variant="outlined"
                        disabled
                      />
                    </Grid>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                      <TextField
                        error={Boolean(
                          touched.currentReading && errors.currentReading
                        )}
                        fullWidth
                        helperText={
                          touched.currentReading && errors.currentReading
                        }
                        label="Lectura actual"
                        name="currentReading"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        required
                        type="number"
                        value={values.currentReading}
                        variant="outlined"
                        inputProps={{ min: values.previousReading }}
                      />
                    </Grid>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                      <TextField
                        error={Boolean(
                          touched.consumptionCubicMeters &&
                            errors.consumptionCubicMeters
                        )}
                        fullWidth
                        helperText={
                          touched.consumptionCubicMeters &&
                          errors.consumptionCubicMeters
                        }
                        label="Consumo en metros cúbicos"
                        name="consumptionCubicMeters"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        required
                        type="number"
                        value={values.consumptionCubicMeters}
                        variant="outlined"
                        disabled
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
                      {data ? "Guardar Cambios" : "Registrar Consumo"}
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

export default CustomerConsumptionsModal;
