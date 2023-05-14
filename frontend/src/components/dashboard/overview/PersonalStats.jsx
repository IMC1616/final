import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import numeral from "numeral";

numeral.register("locale", "bo", {
  delimiters: {
    thousands: ",",
    decimal: ".",
  },
  abbreviations: {
    thousand: "k",
    million: "m",
    billion: "b",
    trillion: "t",
  },
  ordinal: function (number) {
    return number === 1 ? "er" : "ème";
  },
  currency: {
    symbol: "Bs",
  },
});

numeral.locale("bo");

const months = {
  1: "Enero",
  2: "Febrero",
  3: "Marzo",
  4: "Abril",
  5: "Mayo",
  6: "Junio",
  7: "Julio",
  8: "Agosto",
  9: "Septiembre",
  10: "Octubre",
  11: "Noviembre",
  12: "Diciembre",
};

export const PersonalStats = ({ totalDebt = 0, monthlyDetails }) => {
  if (totalDebt === 0) {
    return (
      <Grid xs={12} md={6}>
        <Stack
          alignItems="center"
          direction="row"
          spacing={2}
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "neutral.800" : "error.lightest",
            borderRadius: 2.5,
            px: 3,
            py: 4,
          }}
        >
          <Box
            sx={{
              flexShrink: 0,
              height: 48,
              width: 48,
              "& img": {
                width: "100%",
              },
            }}
          >
            <img src="/assets/iconly/iconly-glass-tick.svg" />
          </Box>
          <div>
            <Typography variant="h6">
              ¡Buenas noticias! No tienes ninguna deuda pendiente.
            </Typography>
          </div>
        </Stack>
      </Grid>
    );
  }

  const formattedTotalDebt = numeral(totalDebt).format("0,0.00 $");
  const totalMonthsOwed = Object.keys(monthlyDetails).length;
  const owedMonths = Object.keys(monthlyDetails).map((mes) => months[mes]);

  return (
    <Card>
      <CardHeader title="Información sobre tus deudas" sx={{ pb: 0 }} />
      <CardContent>
        <Grid container spacing={3}>
          <Grid xs={12} md={6}>
            <Stack
              alignItems="center"
              direction="row"
              spacing={2}
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "neutral.800"
                    : "error.lightest",
                borderRadius: 2.5,
                px: 3,
                py: 4,
              }}
            >
              <Box
                sx={{
                  flexShrink: 0,
                  height: 48,
                  width: 48,
                  "& img": {
                    width: "100%",
                  },
                }}
              >
                <img src="/assets/iconly/iconly-glass-chart.svg" />
              </Box>
              <div>
                <Typography color="text.secondary" variant="body2">
                  Facturas adeudadas
                </Typography>
                <Typography variant="h5">
                  {totalMonthsOwed}{" "}
                  <Typography variant="body2" component="span">
                    ({owedMonths.join(", ")})
                  </Typography>
                </Typography>
              </div>
            </Stack>
          </Grid>
          <Grid xs={12} md={6}>
            <Stack
              alignItems="center"
              direction="row"
              spacing={2}
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "neutral.800"
                    : "warning.lightest",
                borderRadius: 2.5,
                px: 3,
                py: 4,
              }}
            >
              <Box
                sx={{
                  flexShrink: 0,
                  height: 48,
                  width: 48,
                  "& img": {
                    width: "100%",
                  },
                }}
              >
                <img src="/assets/iconly/iconly-glass-info.svg" />
              </Box>
              <div>
                <Typography color="text.secondary" variant="body2">
                  Deuda total
                </Typography>
                <Typography variant="h5">{formattedTotalDebt}</Typography>
              </div>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
