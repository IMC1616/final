import React from "react";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import { Box, Container, Grid, Typography } from "@mui/material";
import { selectSettings } from "../../../features/settings/settingsSlice";
import { selectCurrentUser } from "../../../features/auth/authSlice";
import OverviewDebts from "../../../components/dashboard/overview/OverviewDebts";

const Overview = () => {
  const settings = useSelector(selectSettings);
  const user = useSelector(selectCurrentUser);

  // const {
  //   data: userDebts,
  //   isLoading: userDebtsLoading,
  //   isError: userDebtsError,
  //   isSuccess: userDebtsSuccess,
  // } = useGetUserDebtsQuery("64605b685e8fc587f733b088");

  return (
    <>
      <Helmet>
        <title>Dashboard: Overview</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 8,
        }}
      >
        <Container maxWidth={settings.compact ? "xl" : false}>
          <Grid container spacing={3}>
            <Grid
              alignItems="center"
              container
              justifyContent="space-between"
              spacing={3}
              item
              xs={12}
            >
              <Grid item>
                <Typography color="textPrimary" variant="h5">
                  Hola de nuevo {user.name} {user.lastName}!
                </Typography>
              </Grid>
            </Grid>

            <Grid item md={12} xs={12}>
              {/* <PersonalStats cost={99700} profit={32100} sales={152000} /> */}
              <OverviewDebts />
            </Grid>

            {/*<Grid item md={4} xs={12}>
              <OverviewEvents />
            </Grid>
            <Grid item md={8} xs={12}>
              <OverviewPrayers />
            </Grid> */}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Overview;
