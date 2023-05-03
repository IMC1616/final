import "./i18n";
import React from "react";
import { useSelector } from "react-redux";
import { useRoutes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { selectSettings } from "./features/settings/settingsSlice";
import { createCustomTheme } from "./theme";
import SettingsDrawer from "./components/SettingsDrawer";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";

import routes from "./routes";

const App = () => {
  const content = useRoutes(routes);
  const settings = useSelector(selectSettings);

  const theme = createCustomTheme({
    direction: settings.direction,
    responsiveFontSizes: settings.responsiveFontSizes,
    roundedCorners: settings.roundedCorners,
    theme: settings.theme,
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Toaster position="top-center" />
        <SettingsDrawer />
        {content}
      </ThemeProvider>
    </LocalizationProvider>
  );
};

export default App;
