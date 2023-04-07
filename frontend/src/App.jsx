import React from "react";
import { useSelector } from "react-redux";
import { useRoutes } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { selectSettings } from "./features/settings/settingsSlice";
import { createCustomTheme } from "./theme";
import SettingsDrawer from "./components/SettingsDrawer";
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SettingsDrawer />
      {content}
    </ThemeProvider>
  );
};

export default App;
