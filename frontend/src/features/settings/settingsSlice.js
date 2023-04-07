import { createSlice } from "@reduxjs/toolkit";
import { THEMES } from "../../constants";

const initialSettings = {
  compact: true,
  direction: "ltr",
  responsiveFontSizes: true,
  roundedCorners: true,
  theme: THEMES.DARK,
};

const restoreSettings = () => {
  let settings = null;

  try {
    const storedData = window.localStorage.getItem("settings");

    if (storedData) {
      settings = JSON.parse(storedData);
    } else {
      settings = {
        compact: true,
        direction: "ltr",
        responsiveFontSizes: true,
        roundedCorners: true,
        theme: window.matchMedia("(prefers-color-scheme: dark)").matches
          ? THEMES.DARK
          : THEMES.LIGHT,
      };
    }
  } catch (err) {
    console.error(err);
  }

  return settings;
};

const storeSettings = (settings) => {
  window.localStorage.setItem("settings", JSON.stringify(settings));
};

const settingsSlice = createSlice({
  name: "settings",
  initialState: restoreSettings() || initialSettings,
  reducers: {
    saveSettings: (state, action) => {
      const updatedSettings = action.payload;
      Object.assign(state, updatedSettings);
      storeSettings(updatedSettings);
    },
  },
});

export const { saveSettings } = settingsSlice.actions;

export const selectSettings = (state) => state.settings;

export default settingsSlice.reducer;
