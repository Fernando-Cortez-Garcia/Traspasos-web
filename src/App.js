import React, { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router/AppRouter.js"; // Importa el router configurado
import { CssBaseline, ThemeProvider } from "@mui/material";
import NightModeToggle from "./componentes/NightModeToggle";
import { useThemeContext } from "./theme/ThemeContextProvider";

function App() {
  const { theme, mode } = useThemeContext();

  return (
    // <ThemeProvider theme={theme}>
    //   <CssBaseline>
    //     ...{mode}...
    //     <NightModeToggle/>
        // Suspense permite manejar la carga diferida de componentes, aquí se puede
        // mostrar algo como un splash component para indicar que la app se
        // encuentra cargando 
        <Suspense fallback={<div>Loading...</div>}>
          {/* Se instancia el router con la lógica de login hecha */}
          <RouterProvider router={router} />
        </Suspense>
    //   </CssBaseline>
    // </ThemeProvider>
  );
}

export default App;
