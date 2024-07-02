import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import "./estilos.css";
import { fetchLogin } from "../../api/peticiones"; // Importamos las funciones desde api.js
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


const defaultTheme = createTheme();

export default function SignIn() {
  //Declaración de variables
  const navigate = useNavigate();  // Hook para redireccionar
  const [showPassword, setShowPassword] = useState(false);

  //Funciones
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const user = data.get('email');
    const password = data.get('password');

    try {
      // Aquí haces la llamada a la API para validar el usuario
      const response = await fetchLogin(user, password);

      const userData = {
        nombre: response.Nombre,
        tipo: response.Tipo
      };

      localStorage.setItem("user", JSON.stringify(userData));
      console.log(userData);
      navigate('traspasos');
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  

  return (
    <body>
    <ThemeProvider theme={defaultTheme}>
      <Container id='contenedor' component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: '#f50057' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Traspaso Hidalgo
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Usuario"
              name="email"
              autoComplete="email"
              autoFocus
            />

            {PasswordField()}
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              bgcolor="red"
              sx={{ mt: 3, mb: 2 }}
              
            >
              Iniciar
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
    </body>
  );
}

//Componentes
function PasswordField() {
  
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <TextField
      margin="normal"
      required
      fullWidth
      name="password"
      label="Contraseña"
      type={showPassword ? 'text' : 'password'}
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
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="http://hidalgo.no-ip.info:5610/soporteBitala/index.html">
        Bitala Mx 
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

