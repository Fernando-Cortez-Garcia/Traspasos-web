import { createTheme } from "@mui/material";
import React, { createContext, useState, useMemo, useContext } from "react";

// Creamos el contexto con valores predeterminados
export const ThemeContext = createContext({
  mode: "light",
  toggleColorMode: () => {},
  theme: createTheme(),
});

// Custom hook para manejar el tema
const useColorTheme = () => {
  const [mode, setMode] = useState("light");

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

  return {
    mode,
    toggleColorMode,
    theme,
  };
};

// Proveedor del contexto
export const ThemeContextProvider = ({ children }) => {
  const value = useColorTheme();
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// Custom hook para usar el contexto
export const useThemeContext = () => {
  return useContext(ThemeContext);
};
