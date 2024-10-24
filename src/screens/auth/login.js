import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Box,
  Typography,
  Container,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  LockOutlined as LockOutlinedIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { LoadingButton } from "@mui/lab";
import "./estilos.css";
import { fetchLogin } from "../../api/peticiones"; // Importamos las funciones desde api.js

export default function SignIn() {
  //Declaración de variables
  const navigate = useNavigate(); // Hook para redireccionar
  const [openSnackbar, setOpenSnackBar] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState("");
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPasswrod, setErrorPassword] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);

  //Funciones
  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const user = data.get("email");
    const password = data.get("password");

    if (!validateFields(user, password)) {
      return;
    }

    try {
      setLoadingLogin(true);
      // Aquí haces la llamada a la API para validar el usuario
      const response = await fetchLogin(user, password);

      const userData = {
        nombre: response.Nombre,
        tipo: response.Tipo,
      };

      //Se almacena el usuario en el localstorage y se navega a la siguiente vista
      localStorage.setItem("user", JSON.stringify(userData));
      navigate("traspasos");
    } catch (error) {
      setLoadingLogin(false);
      setOpenSnackBar(true);
      setErrorSnackbar(error.message);
      console.error("Error:", error.message);
    }
  };

  const validateFields = (user, password) => {
    let isValid = true;

    // Reset error states
    setErrorEmail(false);
    setErrorPassword(false);

    // Check if user field is empty
    if (!user) {
      setErrorEmail(true);
      isValid = false;
    }

    // Check if password field is empty
    if (!password) {
      setErrorPassword(true);
      isValid = false;
    }

    return isValid;
  };

  const handleCloseSnackbar = () => {
    setOpenSnackBar(false);
  }

  return (

    <>
      <Container id="contenedor" component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "#f50057" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Traspasos Hidalgo
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              error={errorEmail}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Usuario"
              name="email"
              autoComplete="email"
              autoFocus
            />

            <PasswordField error={errorPasswrod} />

            <LoadingButton
              loading={loadingLogin}
              type="submit"
              fullWidth
              variant="contained"
              bgcolor="red"
              sx={{ mt: 3, mb: 2 }}
            >
              Iniciar
            </LoadingButton>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
      <Snackbar open={openSnackbar} autoHideDuration={2000} onClose={handleCloseSnackbar}>
        <Alert
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {errorSnackbar}
        </Alert>
      </Snackbar>
    </>
  );
}

//Componentes
function PasswordField({ error }) {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <TextField
      error={error}
      margin="normal"
      required
      fullWidth
      name="password"
      label="Contraseña"
      type={showPassword ? "text" : "password"}
      id="password"
      autoComplete="current-password"
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link
        color="inherit"
        href="http://hidalgo.no-ip.info:5610/soporteBitala/index.html"
      >
        Bitala Mx
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
