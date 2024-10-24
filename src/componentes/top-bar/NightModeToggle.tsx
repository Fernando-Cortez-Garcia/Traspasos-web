import React from "react";
import { Box, Button, IconButton } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useThemeContext } from "../../theme/ThemeContextProvider.tsx";

const NightModeToggle = () => {
  const { mode, toggleColorMode } = useThemeContext();

  return (

    <Box
      onClick={toggleColorMode}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "background.default",
        color: "text.primary",
        padding: "16px",
        cursor: "pointer",
        transition: "background-color 0.8s",
        '&:hover': {
          backgroundColor: '#ffc4c4',
        },
      }}
    >
      Modo {mode === "dark" ? "oscuro" : "claro"}
      {mode === "dark" ? (
        <Brightness7Icon sx={{ ml: 1 }} />
      ) : (
        <Brightness4Icon sx={{ ml: 1 }} />
      )}
    </Box>
  );
};

export default NightModeToggle;
