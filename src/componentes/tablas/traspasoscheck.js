import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { Button, Modal, Box, Typography, Skeleton, TextField } from "@mui/material";
import { createTheme, StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';

import { fetchTraspasosCheck, registerEvidence, uploadPhoto } from "../../api/peticiones"; // Importamos las funciones desde api.js

const TbTraspaso2 = ({ fecha }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [iddoc, setIddoc] = useState(null);
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const filteredData = await fetchTraspasosCheck(fecha);
        setData(filteredData);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error.message);
      }
    };

    fetchData();
  }, [fecha]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  const handleOpenModal = (iddoc) => {
    setIddoc(iddoc);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleRegister = async () => {
    try {
      await registerEvidence(name, iddoc, file);
      const photoResult = await uploadPhoto(iddoc, file);

      if (photoResult.status === 'exitoso' || photoResult.status === 'success') {
        alert('Registro y subida de foto exitosos.');
        await refreshTable();
      } else {
        alert('Hubo un error al intentar subir la foto.');
      }

      handleCloseModal();
    } catch (error) {
      console.error('Error en handleRegister:', error.message);
      alert('Hubo un error al intentar registrar la evidencia.');
    }
  };

  const refreshTable = async () => {
    try {
      const filteredData = await fetchTraspasosCheck(fecha);
      setData(filteredData);
    } catch (error) {
      console.error('Error en refreshTable:', error.message);
    }
  };

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
      name: "FECHA",
      label: "FECHA",
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
        customBodyRender: (value, tableMeta, updateValue) => (
          <Button
            variant="contained"
            component="label"
            onClick={() => handleOpenModal(tableMeta.rowData[0])} // Passing DOCID as iddoc
          >
            <InsertPhotoIcon />
          </Button>
        )
      }
    },
  ];

  const options = {
    filter: false,
    print: false,
    download: false,
    viewColumns: false,
    selectableRows: 'none',
    setRowProps: (row, dataIndex, rowIndex) => {
      return {
        style: {
          backgroundColor: row[6] === 'Cancelado' ? '#FFCDD2' : 'inherit' // Cambia el índice según la posición de la columna "ESTADO"
        }
      };
    },
    textLabels: {
      body: {
        noMatch: "No se encontraron traspasos Completados en esta fecha",
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

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={createTheme()}>
        {loading ? (
          <Box sx={{ width: '100%', overflow: 'hidden' }}>
            <Skeleton animation="wave" height={400} />
          </Box>
        ) : (
          <MUIDataTable
            data={data}
            columns={columns}
            options={options}
          />
        )}

        <Modal
          open={open}
          onClose={handleCloseModal}
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
              Evidencia traspaso: {iddoc}
            </Typography>

            <img
              src={"https://tse4.mm.bing.net/th?id=OIP.SBwa67f-YE7Hc6JRd9phMgHaEK&pid=Api&P=0&h=180"}
              alt="titulo"
              loading="lazy"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
            
            <Box mt={2}>
              <Typography variant="body1">Nombre:</Typography>
              <TextField
                value={name}
                onChange={(e) => setName(e.target.value)}
                variant="outlined"
                fullWidth
                size="small"
              />
            </Box>

            <Box mt={2}>
              <Typography variant="body1">Subir Foto:</Typography>
              <input
                accept="image/*"
                id="contained-button-file"
                type="file"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="contained-button-file">
                <Button variant="contained" component="span">
                  Subir
                  <InsertPhotoIcon sx={{ ml: 1 }} />
                </Button>
              </label>
              {file && <Typography variant="body2">{file.name}</Typography>}
            </Box>

            <Button
              variant="contained"
              onClick={handleRegister}
              sx={{ mt: 2, float: 'right', bgcolor: '#4CAF50', '&:hover': { bgcolor: '#388E3C' } }}
            >
              Registrar
              <InsertPhotoIcon sx={{ ml: 1 }} />
            </Button>
          </Box>
        </Modal>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default TbTraspaso2;
