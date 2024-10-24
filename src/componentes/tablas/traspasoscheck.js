import React, { useEffect, useState } from "react";

// Componentes de terceros
import MUIDataTable from "mui-datatables";

// Componentes de Material-UI
import { LoadingButton } from "@mui/lab";
import {
  Modal,
  Box,
  Typography,
  Skeleton
} from "@mui/material";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import {
  InsertPhoto
} from "@mui/icons-material";

// Funciones de API
import {
  fetchTraspasosCheck,
  fetchDetallesTraspasos,
  fetchFotosTraspasos,
} from "../../api/peticiones"; // Importamos las funciones desde api.js

import { useThemeContext } from "../../theme/ThemeContextProvider.tsx";
import { PhotoProvider, PhotoView } from "react-photo-view";

//Enviroment variable
const IMAGES_URL = process.env.REACT_APP_URL_IMAGES_TRASPASOS;

const TbTraspaso2 = ({ fecha }) => {
  //Tema
  const { theme } = useThemeContext();
  //Variables mixtas
  const [detailsData, setDetailsData] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [iddoc, setIddoc] = useState(null);
  const [photoData, setPhotoData] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const filteredData = await fetchTraspasosCheck(fecha);
        setData(filteredData);
        setLoading(false);
      } catch (error) {
        setData([]);
        setLoading(false)
        console.error("Error:", error.message);
      }
    };

    fetchData();
  }, [fecha]);

  const handleOpenModal = (iddoc) => {
    setIddoc(iddoc);
    setOpen(true);
    fetchDetailsData(iddoc);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const fetchDetailsData = async (iddoc) => {
    try {
      setLoadingDetails((prevState) => ({
        ...prevState,
        [iddoc]: true,
      }));
      //fotos
      const photos = await fetchFotosTraspasos(iddoc);
      setPhotoData(photos);
      //tabla detalles
      const response = await fetchDetallesTraspasos(iddoc);
      setDetailsData(response);

      setLoadingDetails((prevState) => ({
        ...prevState,
        [iddoc]: false,
      }));
    } catch (error) {
      setLoadingDetails((prevState) => ({
        ...prevState,
        [iddoc]: false,
      }));
      console.error("Error en fetchDetailsData:", error.message);
    }
  };

  //-----------------------------------
  //   Datatable traspasos(principal)
  //-----------------------------------
  const columns = [
    {
      name: "DOCID",
      label: "Iddoc",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "FECHA",
      label: "FECHA",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "NOMBRE",
      label: "Emisor",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "NUMERO",
      label: "N.Traspaso",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "NOTA",
      label: "Nota",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "XSOLICITA",
      label: "Solicita",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return <p>{tableMeta.rowData[5]} </p>;
        },
      },
    },

    {
      name: "ESTADO",
      label: "Estado",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div>
              <Box
                sx={{
                  width: 80,
                  height: 20,
                  borderRadius: 5,
                  bgcolor: tableMeta.rowData[6] === "Impreso" ? "green" : "red",
                }}
                className="text-center"
              >
                <Typography variant="inherit" sx={{ color: "white" }}>
                  {tableMeta.rowData[6]}
                </Typography>
              </Box>
            </div>
          );
        },
      },
    },
    {
      name: "Evidencia",
      label: "Registrar",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => (
          <LoadingButton
            loading={loadingDetails[tableMeta.rowData[0]]} // Accede usando la clave dinámica
            variant="contained"
            component="label"
            onClick={() => handleOpenModal(tableMeta.rowData[0])} // Passing DOCID as iddoc
          >
            <InsertPhoto />
          </LoadingButton>
        ),
      },
    },
  ];

  const options = {
    filter: false,
    print: false,
    download: false,
    viewColumns: false,
    selectableRows: "none",
    setRowProps: (row, dataIndex, rowIndex) => {
      const rowData = row || [];
      //Se obtiene el estado con los props y children, ya que esta dentro de varios componentes
      const estado = rowData[6].props.children.props.children.props.children;
      return {
        style: {
          backgroundColor: estado === "Cancelado" ? "#ff7676" : "inherit",
          color: "white"
        },
      };
    },
    textLabels: {
      body: {
        noMatch: "No se encontraron detalles.",
        toolTip: "Ordenar",
        columnHeaderTooltip: (column) => `Ordenar por ${column.label}`,
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

  //-----------------------------------
  //   Datatable detalles traspasos
  //-----------------------------------

  const columnsDetailDatatable = [
    {
      name: "DESCANTIDAD",
      label: "Cantidad",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "DESCRIPCIO",
      label: "Descripcion",
      options: {
        filter: true,
        sort: true,
      },
    }
  ];

  const optionsDetailDatatable = {
    filter: false,
    print: false,
    download: false,
    viewColumns: false,
    selectableRows: "none",
    setRowProps: (row, dataIndex, rowIndex) => {
      return {
        style: {
          backgroundColor: row[6] === "Cancelado" ? "#FFCDD2" : "inherit", // Cambia el índice según la posición de la columna "ESTADO"
        },
      };
    },
    textLabels: {
      body: {
        noMatch: "No se encontraron traspasos Completados en esta fecha",
        toolTip: "Ordenar",
        columnHeaderTooltip: (column) => `Ordenar por ${column.label}`,
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


  if (loading) return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      <Skeleton animation="wave" height={400} />
    </Box>
  )

  if (data.length === 0) return (
    <Box
      component="section"
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        boxShadow: 5,
        p: 4,
        mt: 1,
        mb: 2,
        borderRadius: 3,
        textAlign: "center"
      }}
    >
      <Typography>
        Sin traspasos completados
      </Typography>
    </Box>
  )

  if (data.length > 0) return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <MUIDataTable data={data} columns={columns} options={options} />
        <Modal
          open={open}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              // width: 800,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
              maxHeight: "90%",
              overflow: "auto",
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.05)",
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Evidencia traspaso: {iddoc}
            </Typography>

            <Box mt={2}>
              <Typography variant="h6" className="mt-4 mb-3" align="center">
                Evidencia fotográfica
              </Typography>
            </Box>

            <div className="row text-center justify-content-center">
              {photoData.map((slotProps, index) => (
                <div key={slotProps.idCajasFotos} className="col-6 col-md-4 col-lg-3 mb-4">
                  <PhotoProvider>
                    <PhotoView src={`${IMAGES_URL}${slotProps.imagen}`}>
                      <img
                        src={`${IMAGES_URL}${slotProps.imagen}`}
                        alt={`Previsualización ${index}`}
                        style={{
                          width: "100%",
                          height: "150px",
                          objectFit: "cover",
                          borderRadius: "8px"
                        }}
                      />
                    </PhotoView>
                  </PhotoProvider>
                </div>
              ))}
            </div>

            <Box mt={2}>
              <Typography variant="h6" className="mt-4 mb-3" align="center">
                Contenido del traspaso
              </Typography>
            </Box>

            {
              <MUIDataTable
                data={detailsData}
                columns={columnsDetailDatatable}
                options={optionsDetailDatatable}
              />
            }
          </Box>
        </Modal>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default TbTraspaso2;
