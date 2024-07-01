import { Navigate } from "react-router-dom";

//funcion para proteger las rutas
function ProtectedRoute({ element: Component }) {
  const user = localStorage.getItem("user");
  console.log(user)
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Component />;
}

export default ProtectedRoute;
