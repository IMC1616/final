import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { startOfMonth, endOfMonth } from "date-fns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from "@mui/material";
import { useGetUnpaidQuery } from "../../../services/endpoints/reports";

const getCurrentMonthRange = () => {
  const now = new Date();
  return {
    start: startOfMonth(now),
    end: endOfMonth(now),
  };
};

export const DebtChart = () => {
  const { start, end } = getCurrentMonthRange();

  const [startDate, setStartDate] = useState(start);
  const [endDate, setEndDate] = useState(end);

  const { data = [], isFetching } = useGetUnpaidQuery({
    startDate: startDate.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
  });

  return (
    <Card sx={{ mt: 3 }}>
      <CardHeader title="Reporte de deudas" sx={{ pb: 0 }} />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <DatePicker
              label="Fecha de inicio"
              value={startDate}
              onChange={setStartDate}
              slotProps={{
                textField: {
                  size: "small",
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
              onChange={setEndDate}
              slotProps={{
                textField: {
                  size: "small",
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
        ) : data.data.length ? (
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
        ) : (
          <Box mt={2} textAlign="center">
            <Typography variant="h6" color="textSecondary">
              No hay datos para mostrar
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
