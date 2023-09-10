import { useState } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
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
import { useGetIncomesQuery } from "../../../services/endpoints/reports";

const getCurrentMonthRange = () => {
  const now = new Date();
  return {
    start: startOfMonth(now),
    end: endOfMonth(now),
  };
};

const getRandomColor = () =>
  `#${Math.floor(Math.random() * 16777215).toString(16)}`;

export const IncomesChart = () => {
  const { start, end } = getCurrentMonthRange();

  const [startDate, setStartDate] = useState(start);
  const [endDate, setEndDate] = useState(end);

  const { data = [], isFetching } = useGetIncomesQuery({
    startDate: startDate.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
  });

  const totalSum = data?.data?.reduce((acc, item) => acc + item.totalAmount, 0);

  return (
    <Card sx={{ mt: 3 }}>
      <CardHeader title="Reporte de ingresos" sx={{ pb: 0 }} />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <DatePicker
              label="Fecha de inicio"
              value={startDate}
              onChange={setStartDate}
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
              onChange={setEndDate}
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
        ) : data.data.length ? (
          <Box sx={{ mt: 4, overflowX: "auto" }}>
            <Box sx={{ textAlign: "center", marginBottom: 2 }}>
              <Typography variant="h6">Total: {totalSum}</Typography>
            </Box>
            <ResponsiveContainer width="100%" height={500}>
              <PieChart>
                <Pie
                  dataKey="totalAmount"
                  data={data.data}
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  label={(entry) => entry.userInfo.name}
                >
                  {data.data.map((_, index) => (
                    <Cell key={index} fill={getRandomColor()} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
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
