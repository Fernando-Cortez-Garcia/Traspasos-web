import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { Button, Modal, Box, Typography, TextField } from "@mui/material";
import { createTheme, StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';

const apiUrl = process.env.REACT_APP_URL_PETICIONES;

const TbTraspaso2 = ({ fecha }) => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [iddoc, setIddoc] = useState(null);

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

        const filteredData = parsedResult.filter(item => item.XSOLICITA !== "");
        setData(filteredData);
      } catch (error) {
        console.error('Error:', error.message);
      }
    };

    fetchData();
  }, [fecha]);

  const handleFileUpload = (event, rowIndex, updateValue) => {
    const file = event.target.files[0];
    if (file) {
      console.log(`File uploaded in row ${rowIndex}:`, file);
      updateValue(file.name); // Update the cell value if necessary
    }
  };

  const handleOpenModal = (iddoc) => {
    setIddoc(iddoc);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleRegister = () => {
    // Handle register logic here
    handleCloseModal();
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
            />


          </Box>
        </Modal>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default TbTraspaso2;
