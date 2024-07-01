import { createBrowserRouter, Navigate, redirect } from "react-router-dom";
import SignIn from "../screens/auth/login";
import Traspasos from "../screens/Traspasos/traspasos";
import ProtectedRoute from "./ProtectedRoute"; // Asegúrate de que la ruta es correcta

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    loader: loginLoader,
    element: <SignIn />,
  },
  {
    path: "/traspasos",
    element: <ProtectedRoute element={Traspasos} />,
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);


//Función de la vista login, se ejecuta cuando se accede a esta
async function loginLoader() {
  //Si el usuario está logeado, redirige a la vista traspasos
  if (localStorage.getItem("user")) {
    return redirect("/traspasos");
  }
  return null;
}

export default router;
