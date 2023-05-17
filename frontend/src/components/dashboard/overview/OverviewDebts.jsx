import React from "react";
import { useSelector } from "react-redux";
import {
  Grid,
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import { useGetUserDebtsQuery } from "../../../services/endpoints/users";
import { selectCurrentUser } from "../../../features/auth/authSlice";
import { PersonalStats } from "./PersonalStats";
import { DebtChart } from "./DebtChart";
import Guard from "../../Guards/Guard";

const OverviewDebts = () => {
  const user = useSelector(selectCurrentUser);

  const {
    data: userDebts,
    isLoading: userDebtsLoading,
    isError: userDebtsError,
    isSuccess: userDebtsSuccess,
  } = useGetUserDebtsQuery(user._id);

  if (userDebtsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Guard roles={["customer"]}>
        <Grid item xs={12} md={12}>
          <PersonalStats
            totalDebt={userDebts?.data?.totalDebt}
            monthlyDetails={userDebts?.data?.monthlyDetails}
          />
        </Grid>
      </Guard>

      <Guard item roles={["admin", "reader"]}>
        <Grid xs={12} md={12}>
          <DebtChart />
        </Grid>
      </Guard>
    </div>
  );
};

export default OverviewDebts;
