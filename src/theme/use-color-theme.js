import React, { useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

export const useColorTheme = () => {
  const [mode, setMode] = useState("light");

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return { mode, toggleColorMode, theme };
};
