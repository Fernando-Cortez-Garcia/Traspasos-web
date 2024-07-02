import React, { createContext, useContext } from "react";
import { createTheme } from "@mui/material";
import { useColorTheme } from "./use-color-theme";

const defaultTheme = createTheme();

export const ThemeContext = createContext({
  mode: "light",
  toggleColorMode: () => {},
  theme: defaultTheme,
});

export const ThemeContextProvider = ({ children }) => {
  const value = useColorTheme();
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  console.log("hola")
  return useContext(ThemeContext);
};
