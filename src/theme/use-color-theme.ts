import { createTheme, PaletteMode } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import theme, { getDesignTokens } from "./theme.tsx";

//Debido a que toggleColorMode se ejecuta varias veces por instancia, se creó
//una función debounce, que evita multiples ejecuciones mediante un timer
//y cuando este termina, se ejecuta la función como tiene que ser una sola vez
const debounce = <T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

//Esta función obtiene el tema preferido por el usuario de su navegador
const getPreferredMode = () => {
  const savedMode = localStorage.getItem("mode") as PaletteMode | null;
  if (savedMode) {
    return savedMode;
  }
  const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDarkMode ? "dark" : "light";
};

export const useColorTheme = () => {
  const [mode, setMode] = useState<PaletteMode>(getPreferredMode);

  //Init para ver que tema tiene el navegador del usuario
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      setMode(mediaQuery.matches ? "dark" : "light");
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const toggleColorMode = useMemo(
    () =>
      debounce(() => {
        setMode((prevMode) => {
          const newMode = prevMode === "light" ? "dark" : "light";
          localStorage.setItem("mode", newMode);
          return newMode;
        });
      }, 100),
    []
  );

  const modifiedTheme = React.useMemo(
    () =>
      createTheme({
        ...theme,
        palette: {
          ...theme.palette,
          mode,
        },
      }),
    [mode]
  );

  // const modifiedTheme = React.useMemo(
  //   () => createTheme(getDesignTokens(mode)),
  //   [mode]
  // );

  return {
    theme: modifiedTheme,
    mode,
    toggleColorMode,
  };
};
