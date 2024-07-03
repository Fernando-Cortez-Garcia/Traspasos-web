import React, { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TbTraspaso from '../../componentes/tablas/traspasostable';
import TbTraspasos2 from '../../componentes/tablas/traspasoscheck';
import  ResponsiveAppBar from '../../componentes/top-bar/topbar';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import 'bootstrap/dist/css/bootstrap.css';

import { useThemeContext } from "../../theme/ThemeContextProvider.tsx";


function CustomTabPanel(props) {

  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const Traspasos = () => {
  const { theme } = useThemeContext();

  const [value, setValue] = useState(0);
  const [fecha, setFecha] = useState('');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const fechaActual = () => {
    let fecha = new Date();
    let year = fecha.getFullYear();
    let month = (fecha.getMonth() + 1).toString().padStart(2, '0');
    let day = fecha.getDate().toString().padStart(2, '0');
    let formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };

  useEffect(() => {
    const initialFecha = fechaActual();
    setFecha(initialFecha);
  }, []);

  const handleFechaChange = (event) => {
    const newFecha = event.target.value;
    setFecha(newFecha);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xl">
        <CssBaseline />
        <ResponsiveAppBar className="mb-4"/>
        
        <Grid container justifyContent="center" className="mt-2 mb-4">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              id='fecha-input'
              label='Seleccione Fecha'
              type='date'
              value={fecha}
              onChange={handleFechaChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Traspasos Pendientes" {...a11yProps(0)} />
              <Tab label="Traspasos Completados" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <TbTraspaso fecha={fecha} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <TbTraspasos2 fecha={fecha} />
          </CustomTabPanel>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Traspasos;
