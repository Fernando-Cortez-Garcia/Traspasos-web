import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { Button, Modal, Box, Typography, TextField, Skeleton } from "@mui/material";
import { createTheme, StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import EditNoteIcon from '@mui/icons-material/EditNote';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { fetchTraspasos, registerEvidence, uploadPhoto } from "../../api/peticiones"; 
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
  const [loading, setLoading] = useState(true); // Estado para controlar la carga de datos
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

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  useEffect(() => {
    const fetchDataAndSetData = async () => {
      try {
        const filteredData = await fetchTraspasos(fecha);
        setData(filteredData);
        setLoading(false); // Una vez cargados los datos, establece loading a false
      } catch (error) {
        console.error('Error en fetchDataAndSetData:', error.message);
      }
    };

    fetchDataAndSetData();
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

  
  const handleRegister = async () => {
    if (name.trim() === '') {
      alert("El nombre está vacío");
      return;
    }
    if (file === null) {
      alert("El archivo está vacío");
      return;
    }

    try {
      const registerResult = await registerEvidence(name, iddoc, file);

      if (registerResult.status === 'exitoso' || registerResult.status === 'success') {
        await uploadPhotoAndRefreshTable(iddoc, file); // Llama a uploadPhoto y actualiza la tabla después
      } else {
        alert('Registro fallido, no se subirá la foto.');
      }

      handleClose(); // Cierra el modal después de finalizar
    } catch (error) {
      console.error('Error en handleRegister:', error.message);
      alert('Hubo un error al intentar registrar la evidencia.');
    }
  };

  const uploadPhotoAndRefreshTable = async (docId, file) => {
    try {
      const photoUploadResult = await uploadPhoto(docId, file);

      console.log('Foto subida exitosamente:', photoUploadResult);
      if (photoUploadResult.status === 'exitoso' || photoUploadResult.status === 'success') {
        await refreshTable(); // Actualiza la tabla después de subir la foto
        alert('Registro y subida de foto exitosos.');
      } else {
        alert('Hubo un error al intentar subir la foto.');
      }
    } catch (error) {
      console.error('Error en uploadPhotoAndRefreshTable:', error.message);
      alert('Hubo un error al intentar subir la foto.');
    }
  };

  const refreshTable = async () => {
    try {
      const filteredData = await fetchTraspasos(fecha);
      setData(filteredData);
    } catch (error) {
      console.error('Error en refreshTable:', error.message);
    }
  };

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={createTheme()}>
        {loading ? ( // Si loading es true, muestra el skeleton
          <Box sx={{ width: '100%', overflow: 'hidden' }}>
            <Skeleton animation="wave" height={400} />
          </Box>
        ) : ( // Si loading es false, muestra la tabla
          <MUIDataTable
            data={data}
            columns={columns}
            options={options}
          />
        )}

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
              onChange={handleFileChange}
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
