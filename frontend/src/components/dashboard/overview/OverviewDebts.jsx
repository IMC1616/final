import React from "react";
import { useSelector } from "react-redux";
import { Grid, Box, Typography } from "@mui/material";
import { useGetUserDebtsQuery } from "../../../services/endpoints/users";
import { selectCurrentUser } from "../../../features/auth/authSlice";
import { PersonalStats } from "./PersonalStats";
import { DebtChart } from "./DebtChart";
import { IncomesChart } from "./IncomesChart";
import Guard from "../../Guards/Guard";

const OverviewDebts = () => {
  const user = useSelector(selectCurrentUser);

  const {
    data: userDebts,
    isLoading: userDebtsLoading,
    isError: userDebtsError,
    error: userDebtsErrorData,
    isSuccess: userDebtsSuccess,
  } = useGetUserDebtsQuery(user._id);

  return (
    <>
      <Guard roles={["customer"]}>
        {userDebtsLoading ? (
          <div>Cargando...</div>
        ) : userDebtsError ? (
          <Box mt={2} textAlign="center">
            <Typography variant="h6" color="error">
              {userDebtsErrorData?.data?.message}
            </Typography>
          </Box>
        ) : userDebtsSuccess && userDebts?.data ? (
          <Grid item xs={12} md={12}>
            <PersonalStats
              totalDebt={userDebts.data.totalDebt}
              monthlyDetails={userDebts.data.monthlyDetails}
            />
          </Grid>
        ) : (
          <Box mt={2} textAlign="center">
            No hay datos para mostrar
          </Box>
        )}
      </Guard>

      <Guard roles={["admin", "reader"]}>
        <Grid container spacing={2}>
          <Grid item xs={12} xl={6}>
            <DebtChart />
          </Grid>
          <Grid item xs={12} xl={6}>
            <IncomesChart />
          </Grid>
        </Grid>
      </Guard>
    </>
  );
};

export default OverviewDebts;
