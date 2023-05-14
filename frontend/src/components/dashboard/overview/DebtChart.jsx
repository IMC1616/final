import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
} from "@mui/material";
import { useGetUnpaidQuery } from "../../../services/endpoints/reports";

export const DebtChart = () => {
  const [startDate, setStartDate] = useState(new Date("2023-01-01"));
  const [endDate, setEndDate] = useState(new Date("2023-05-31"));

  const { data = [], isFetching } = useGetUnpaidQuery({
    startDate: startDate.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
  });

  return (
    <Card sx={{ mt: 3 }}>
      <CardHeader title="Reporte de deudas" sx={{ pb: 0 }} />
      <CardContent>
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <DatePicker
                label="Fecha de inicio"
                value={startDate}
                onChange={(newDate) => setStartDate(newDate)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    name: "readingDate",
                    variant: "outlined",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <DatePicker
                label="Fecha de fin"
                value={endDate}
                onChange={(newDate) => setEndDate(newDate)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    name: "readingDate",
                    variant: "outlined",
                  },
                }}
              />
            </Grid>
          </Grid>
          {isFetching ? (
            <div>Cargando...</div>
          ) : (
            <Box sx={{ mt: 4, overflowX: "auto" }}>
              <ResponsiveContainer width="100%" height={500}>
                <BarChart data={data.data}>
                  <XAxis dataKey="userInfo.name" />
                  <YAxis />
                  <Tooltip />
                  <CartesianGrid stroke="#f5f5f5" />
                  <Bar dataKey="totalDebt" fill="#ff7300" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
