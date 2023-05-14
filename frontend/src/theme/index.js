import { merge } from "lodash";
import { createTheme, responsiveFontSizes } from "@mui/material";
import { darkShadows, lightShadows } from "./shadows";
import { THEMES } from "../constants";

const baseOptions = {
  direction: "ltr",
  components: {
    MuiAvatar: {
      styleOverrides: {
        fallback: {
          height: "75%",
          width: "75%",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        "*": {
          boxSizing: "border-box",
        },
        html: {
          MozOsxFontSmoothing: "grayscale",
          WebkitFontSmoothing: "antialiased",
          height: "100%",
          width: "100%",
        },
        body: {
          height: "100%",
        },
        "#root": {
          height: "100%",
        },
        "#nprogress .bar": {
          zIndex: "2000 !important",
        },
      },
    },
    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: {
          variant: "h6",
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 3,
          overflow: "hidden",
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: "auto",
          marginRight: "16px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
  typography: {
    button: {
      fontWeight: 600,
    },
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
    h1: {
      fontWeight: 600,
      fontSize: "3.5rem",
    },
    h2: {
      fontWeight: 600,
      fontSize: "3rem",
    },
    h3: {
      fontWeight: 600,
      fontSize: "2.25rem",
    },
    h4: {
      fontWeight: 600,
      fontSize: "2rem",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.5rem",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1.125rem",
    },
    overline: {
      fontWeight: 600,
    },
  },
};

const themesOptions = {
  [THEMES.LIGHT]: {
    components: {
      MuiInputBase: {
        styleOverrides: {
          input: {
            "&::placeholder": {
              opacity: 0.86,
              color: "#42526e",
            },
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          "*": {
            "::-webkit-scrollbar": {
              width: "10px",
            },
            "::-webkit-scrollbar-track": {
              backgroundColor: "#FFFFFF",
            },
            "::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(145, 158, 171, 0.24)",
            },
            "::-webkit-scrollbar-thumb:horizontal": {
              backgroundColor: "#FFFFFF",
            },
          },
        },
      },
    },
    palette: {
      mode: "light",
      action: {
        active: "#6b778c",
      },
      background: {
        default: "#f4f5f7",
        paper: "#ffffff",
      },
      error: {
        contrastText: "#ffffff",
        main: "#f44336",
      },
      primary: {
        contrastText: "#ffffff",
        main: "#2f557f",
      },
      secondary: {
        contrastText: "#ffffff",
        main: "#ffa92d",
      },
      success: {
        lightest: "#F0FDF9",
        light: "#3FC79A",
        main: "#10B981",
        dark: "#0B815A",
        darkest: "#134E48",
        contrastText: "#FFFFFF",
      },
      text: {
        primary: "#172b4d",
        secondary: "#6b778c",
      },
      warning: {
        contrastText: "#ffffff",
        main: "#ff9800",
      },
      neutral: {
        50: "#F8F9FA",
        100: "#F3F4F6",
        200: "#E5E7EB",
        300: "#D2D6DB",
        400: "#9DA4AE",
        500: "#6C737F",
        600: "#4D5761",
        700: "#2F3746",
        800: "#1C2536",
        900: "#111927",
      },
    },
    shadows: lightShadows,
  },
  [THEMES.DARK]: {
    components: {
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: "1px solid rgba(145, 158, 171, 0.24)",
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          "*": {
            "*::-webkit-scrollbar": {
              width: "2px",
            },
            "*::-webkit-scrollbar-track": {
              backgroundColor: "#1c2531",
            },
            "*::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(145, 158, 171, 0.24)",
            },
          },
        },
      },
    },
    palette: {
      mode: "dark",
      background: {
        // default: '#121f3d',
        default: "#03091e",
        paper: "#121f3d",
      },
      divider: "rgba(145, 158, 171, 0.24)",
      error: {
        lightest: "#FEF3F2",
        light: "#FEE4E2",
        main: "#F04438",
        dark: "#B42318",
        darkest: "#7A271A",
        contrastText: "#FFFFFF",
      },
      primary: {
        contrastText: "#ffffff",
        main: "#277dbb",
      },
      secondary: {
        contrastText: "#ffffff",
        main: "#ffa92d",
      },
      success: {
        lightest: "#F0FDF9",
        light: "#3FC79A",
        main: "#10B981",
        dark: "#0B815A",
        darkest: "#134E48",
        contrastText: "#FFFFFF",
      },
      text: {
        primary: "#ffffff",
        secondary: "#919eab",
      },
      warning: {
        contrastText: "#ffffff",
        main: "#ff9800",
      },
      neutral: {
        50: "#F8F9FA",
        100: "#F3F4F6",
        200: "#E5E7EB",
        300: "#D2D6DB",
        400: "#9DA4AE",
        500: "#6C737F",
        600: "#4D5761",
        700: "#2F3746",
        800: "#1C2536",
        900: "#111927",
      },
    },
    shadows: darkShadows,
  },
};

export const createCustomTheme = (config = {}) => {
  let themeOptions = themesOptions[config.theme];

  if (!themeOptions) {
    console.warn(new Error(`The theme ${config.theme} is not valid`));
    themeOptions = themesOptions[THEMES.LIGHT];
  }

  let theme = createTheme(
    merge(
      {},
      baseOptions,
      themeOptions,
      {
        ...(config.roundedCorners && {
          shape: {
            borderRadius: 16,
          },
        }),
      },
      {
        direction: config.direction,
      }
    )
  );

  if (config.responsiveFontSizes) {
    theme = responsiveFontSizes(theme);
  }

  return theme;
};
