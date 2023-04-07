import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Drawer,
  Fab,
  FormControlLabel,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { THEMES } from "../constants";
import AdjustmentsIcon from "../icons/Adjustments";
import {
  saveSettings,
  selectSettings,
} from "../features/settings/settingsSlice";

const getValues = (settings) => ({
  compact: settings.compact,
  direction: settings.direction,
  responsiveFontSizes: settings.responsiveFontSizes,
  roundedCorners: settings.roundedCorners,
  theme: settings.theme,
});

const SettingsDrawer = () => {
  const dispatch = useDispatch();
  const settings = useSelector(selectSettings);

  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(getValues(settings));

  useEffect(() => {
    setValues(getValues(settings));
  }, [settings]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (field, value) => {
    setValues({
      ...values,
      [field]: value,
    });
  };

  const handleSave = () => {
    dispatch(saveSettings(values));
    setOpen(false);
  };

  return (
    <>
      <Tooltip title="Settings">
        <Fab
          color="primary"
          onClick={handleOpen}
          size="medium"
          sx={{
            bottom: 0,
            right: 0,
            position: "fixed",
            margin: (theme) => theme.spacing(4),
            zIndex: (theme) => theme.zIndex.speedDial
          }}
        >
          <AdjustmentsIcon fontSize="small" />
        </Fab>
      </Tooltip>
      <Drawer
        anchor="right"
        onClose={handleClose}
        open={open}
        PaperProps={{
          sx: {
            p: 2,
            mt: 8,
            width: 320,
          },
        }}
      >
        <Typography color="textPrimary" variant="h6">
          Ajustes
        </Typography>
        <Box sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Theme"
            name="theme"
            onChange={(event) => handleChange("theme", event.target.value)}
            select
            SelectProps={{ native: true }}
            value={values.theme}
            variant="outlined"
          >
            {Object.keys(THEMES).map((theme) => (
              <option key={theme} value={theme}>
                {theme
                  .split("_")
                  .map((w) => w[0].toUpperCase() + w.substr(1).toLowerCase())
                  .join(" ")}
              </option>
            ))}
          </TextField>
        </Box>
        <Box
          sx={{
            mt: 2,
            px: 1.5,
          }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={values.direction === "rtl"}
                color="primary"
                edge="start"
                name="direction"
                onChange={(event) =>
                  handleChange(
                    "direction",
                    event.target.checked ? "rtl" : "ltr"
                  )
                }
              />
            }
            label={
              <div>
                RTL
                <Typography
                  color="textSecondary"
                  component="p"
                  variant="caption"
                >
                  Cambiar la dirección del texto
                </Typography>
              </div>
            }
          />
        </Box>
        <Box
          sx={{
            mt: 2,
            px: 1.5,
          }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={values.responsiveFontSizes}
                color="primary"
                edge="start"
                name="direction"
                onChange={(event) =>
                  handleChange("responsiveFontSizes", event.target.checked)
                }
              />
            }
            label={
              <div>
                Tamaños de fuente adaptables
                <Typography
                  color="textSecondary"
                  component="p"
                  variant="caption"
                >
                  Ajustar fuente para dispositivos pequeños
                </Typography>
              </div>
            }
          />
        </Box>
        <Box
          sx={{
            mt: 2,
            px: 1.5,
          }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={values.compact}
                color="primary"
                edge="start"
                name="compact"
                onChange={(event) =>
                  handleChange("compact", event.target.checked)
                }
              />
            }
            label={
              <div>
                Compacto
                <Typography
                  color="textSecondary"
                  component="p"
                  variant="caption"
                >
                  Anchura fija en algunas pantallas.
                </Typography>
              </div>
            }
          />
        </Box>
        <Box
          sx={{
            mt: 2,
            px: 1.5,
          }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={values.roundedCorners}
                color="primary"
                edge="start"
                name="roundedCorners"
                onChange={(event) =>
                  handleChange("roundedCorners", event.target.checked)
                }
              />
            }
            label={
              <div>
                Rounded Corners
                <Typography
                  color="textSecondary"
                  component="p"
                  variant="caption"
                >
                  Increase border radius
                </Typography>
              </div>
            }
          />
        </Box>
        <Box sx={{ mt: 3 }}>
          <Button
            color="primary"
            fullWidth
            onClick={handleSave}
            variant="contained"
          >
            Save Settings
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default SettingsDrawer;
