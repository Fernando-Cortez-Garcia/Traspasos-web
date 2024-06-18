import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TbTraspaso from '../../componentes/tablas/traspasostable';
import TbTraspasos2 from '../../componentes/tablas/traspasoscheck';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import 'bootstrap/dist/css/bootstrap.css';
const defaultTheme = createTheme();


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
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  }

  const fechaActual = ()=>{
    let fecha = new Date();
    let year = fecha.getFullYear();
    let month = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
    let day = fecha.getDate().toString().padStart(2, '0');
  
    let formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }

  return (



    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xl">
        <CssBaseline />
        <h1>Traspasos Hidalgo</h1>
        <div className='container d-flex justify-content-center mt-2 mb-4'>
        <input className='form form-control w-25'  type='date' />
        </div>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Traspasos Pendientes" {...a11yProps(0)} />
              <Tab label="Traspasos Completados" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <TbTraspaso fecha={fechaActual} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <TbTraspasos2/>
          </CustomTabPanel>
        </Box>

      </Container>
    </ThemeProvider>
  );
}

export default Traspasos;
