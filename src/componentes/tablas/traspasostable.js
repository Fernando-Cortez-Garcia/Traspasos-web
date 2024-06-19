import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { Button, Modal, Box, Typography, TextField } from "@mui/material";
import { createTheme, StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import EditNoteIcon from '@mui/icons-material/EditNote';
import DoneAllIcon from '@mui/icons-material/DoneAll';

import 'react-toastify/dist/ReactToastify.css';

const apiUrl = process.env.REACT_APP_URL_PETICIONES;

const handleFileUpload = (event, rowIndex, updateValue) => {
  const file = event.target.files[0];
  if (file) {
    console.log(`File uploaded in row ${rowIndex}:`, file);
    updateValue(file.name); // Update the cell value if necessary
  }
};

export default function TbTraspaso({ fecha }) {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [rowIndex, setRowIndex] = useState(null);
  const [updateValue, setUpdateValue] = useState(null);
  const [fileName, setFileName] = useState('');
  const [name, setName] = useState('');
  const [iddoc, setIddoc] = useState('');
  const [file, setFile] = useState(null);


  const handleOpen = (index, update, iddoc) => {
    setRowIndex(index);
    setUpdateValue(() => update);
    setIddoc(iddoc); // Set iddoc to display in the modal
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIddoc(''); // Reset iddoc when closing the modal
  };

  // const handleRegister = () => {
  //   // Aquí puedes manejar el registro de la información
  //   console.log(`Registrando archivo: ${fileName} con nombre: ${name} en la fila: ${rowIndex} y iddoc: ${iddoc}`);
  //   // Actualiza la celda o realiza cualquier otra acción necesaria
  //   if (updateValue) {
  //     updateValue({ fileName, name });
  //   }
  //   handleClose();
  // };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJGZXJuYW5kbyIsIm5hbWUiOiJmZXIxMiIsImV4cCI6MTcxNjM5NjYyMCwiaWF0IjoxNzE2Mzk2NDQwfQ.XePwxaH6oBy0zwYCqiocdIhGSTLUEf-6XEPJWB-s5sA");

        const formdata = new FormData();
        formdata.append("opcion", "46");
        formdata.append("fecha", fecha);

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: formdata,
          redirect: "follow",
        };

        const response = await fetch(apiUrl, requestOptions);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.text();

        let parsedResult;
        try {
          parsedResult = JSON.parse(result);
        } catch (e) {
          throw new Error(`JSON parse error: ${e.message}`);
        }

        const filteredData = parsedResult.filter(item => item.XSOLICITA === "");
        setData(filteredData);
      } catch (error) {
        console.error('Error:', error.message);
      }
    };

    fetchData();
  }, [fecha]);

  const columns = [
    {
      name: "DOCID",
      label: "Iddoc",
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: "NOMBRE",
      label: "Emisor",
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: "NUMERO",
      label: "N.Traspaso",
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: "NOTA",
      label: "Nota",
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: "XSOLICITA",
      label: "Solicita",
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: "ESTADO",
      label: "Estado",
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: "Evidencia",
      label: "Registrar",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div>
              <Button variant="contained" component="label" onClick={() => handleOpen(tableMeta.rowIndex, updateValue, tableMeta.rowData[0])}>
                <EditNoteIcon />
              </Button>
            </div>
          );
        }
      }
    },
  ];

  const options = {
    filter: false,
    print: false,
    download: false,
    viewColumns: false,
    selectableRows: 'none',
    textLabels: {
      body: {
        noMatch: "No se encontraron traspasos Pendientes en esta fecha",
        toolTip: "Ordenar",
        columnHeaderTooltip: column => `Ordenar por ${column.label}`
      },
      pagination: {
        next: "Siguiente Página",
        previous: "Página Anterior",
        rowsPerPage: "Filas por página:",
        displayRows: "de",
      },
      toolbar: {
        search: "Buscar",
        downloadCsv: "Descargar CSV",
        print: "Imprimir",
        viewColumns: "Ver Columnas",
        filterTable: "Filtrar Tabla",
      },
      filter: {
        all: "Todos",
        title: "FILTROS",
        reset: "REINICIAR",
      },
      viewColumns: {
        title: "Mostrar Columnas",
        titleAria: "Mostrar/Ocultar Columnas de Tabla",
      },
      selectedRows: {
        text: "fila(s) seleccionada(s)",
        delete: "Eliminar",
        deleteAria: "Eliminar Filas Seleccionadas",
      },
    },
  };

  const handleRegister = () => {

    // Validate inputs
    if (name.trim() === '') {
      alert("vacio")
      return;
    }
    if (file === null) {
     
      return;
    }

    
    const formData = new FormData();
    formData.append('opcion', name);
    formData.append('nombreArchivo', name);
    formData.append('archivo', file);
    fetch('tu-url-de-api', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        console.log('Registro exitoso:', data);
        handleClose();
      })
      .catch(error => {
        // Handle error
        console.error('Error al registrar:', error);
        // Optionally display an error message
        alert('Hubo un error al intentar registrar la evidencia.');
      });
  };

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={createTheme()}>
        <MUIDataTable
          data={data}
          columns={columns}
          options={options}
        />
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Registrar evidencia para el traspaso: {iddoc}
            </Typography>

            <TextField
              label="Nombre del archivo"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-4 mt-4"
            />
            <input
              type="file"
              className="form form-control"
            />
            <Button
              variant="contained"
              onClick={handleRegister}
              sx={{ mt: 2, float: 'right', bgcolor: '#4CAF50', '&:hover': { bgcolor: '#388E3C' } }}
              className="mt-5"
            >
              Registrar
              <DoneAllIcon sx={{ ml: 1 }} />
            </Button>
          </Box>
        </Modal>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
