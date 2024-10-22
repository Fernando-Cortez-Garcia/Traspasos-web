import React, { useEffect, useRef, useState } from "react";
import MUIDataTable from "mui-datatables";
import {
  Button,
  Modal,
  Box,
  Typography,
  TextField,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import EditNoteIcon from "@mui/icons-material/EditNote";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import {
  fetchTraspasos,
  registerEvidence,
  uploadPhoto,
} from "../../api/peticiones";
import "react-toastify/dist/ReactToastify.css";
import toastr from "toastr";

import { useThemeContext } from "../../theme/ThemeContextProvider.tsx";
import imageCompression from 'browser-image-compression';
import { PhotoProvider, PhotoView } from "react-photo-view";
import 'react-photo-view/dist/react-photo-view.css';
import DeleteIcon from '@mui/icons-material/Delete';

const TbTraspaso = ({ fecha }) => {
  const { theme } = useThemeContext();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [rowIndex, setRowIndex] = useState(null);
  const [updateValue, setUpdateValue] = useState(null);
  const [name, setName] = useState("");
  const [iddoc, setIddoc] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);


  const handleOpen = (index, update, iddoc) => {
    setRowIndex(index);
    setUpdateValue(() => update);
    setIddoc(iddoc);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIddoc("");
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    }

    try {
      const compressedFile = await imageCompression(selectedFile, options);
      setFile(compressedFile);
      setPreviewUrl(URL.createObjectURL(compressedFile));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchDataAndSetData = async () => {
      try {
        const filteredData = await fetchTraspasos(fecha);
        setData(filteredData);
        setLoading(false); //establece loading a false
      } catch (error) {
        console.error("Error en fetchDataAndSetData:", error.message);
      }
    };

    fetchDataAndSetData();
  }, [fecha]);

  const handleRegister = async () => {
    if (name.trim() === "") {
      toastr.info("El nombre está vacío");
      return;
    }
    if (file === null) {
      toastr.info("No se ha seleccionado ningún archivo");
      return;
    }
    setIsLoading(true);
    try {
      const registerResult = await registerEvidence(name, iddoc);
      if (registerResult.status === "exitoso") {
        await uploadPhoto(iddoc, file);
        toastr.success("Evidencia registrada exitosamente");
      } else {
        toastr.error("Error al registrar la evidencia");
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIddoc(null)
      setFile(null)
      setName("")
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setIsLoading(false);
      handleClose();
      refreshTable();
    }
  };

  const handleDeleteImage = () => {
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const refreshTable = async () => {
    try {
      const filteredData = await fetchTraspasos(fecha);
      setData(filteredData);
    } catch (error) {
      console.error("Error en refreshTable:", error.message);
    }
  };

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
          return <p>{tableMeta.rowData[4]} </p>;
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
                  bgcolor: tableMeta.rowData[5] === "Impreso" ? "green" : "red",
                }}
                className="text-center"
              >
                <Typography variant="inherit" sx={{ color: "white" }}>
                  {tableMeta.rowData[5]}
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
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div>
              <Button
                variant="contained"
                component="label"
                onClick={() =>
                  handleOpen(
                    tableMeta.rowIndex,
                    updateValue,
                    tableMeta.rowData[0]
                  )
                }
                disabled={tableMeta.rowData[5] === "Impreso" ? false : true}
              >
                <EditNoteIcon />
              </Button>
            </div>
          );
        },
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
      const estado = rowData[5].props.children.props.children.props.children;
      return {
        style: {
          backgroundColor: estado === "Cancelado" ? "#ff7676" : "inherit",
          color: "white"
        },
      };
    },
    textLabels: {
      body: {
        noMatch: "No se encontraron traspasos Pendientes en esta fecha",
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

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        {loading ? (
          <Box sx={{ width: "100%", overflow: "hidden" }}>
            <Skeleton animation="wave" height={400} />
          </Box>
        ) : (
          <MUIDataTable data={data} columns={columns} options={options} />
        )}

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Registrar evidencia para el traspaso: {iddoc}
            </Typography>

            <TextField
              label="Nombre"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-4 mt-4"
            />

            <Box
            >
              {file !== null ? (
                <Box
                  sx={{
                    m: 2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <PhotoProvider>
                    <PhotoView src={previewUrl}>
                      <img
                        src={previewUrl}
                        alt="Previsualización de la imagen"
                        style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                      />
                    </PhotoView>
                  </PhotoProvider>
                  <Button
                    variant="contained"
                    onClick={handleDeleteImage}
                    sx={{
                      float: "center",
                      bgcolor: "#FD5361",
                      "&:hover": { bgcolor: "#d83e49" },
                    }}
                    className="mt-1 text-center"
                  >
                    <DeleteIcon></DeleteIcon>
                  </Button>
                </Box>

              ) : (
                <Box component="section" sx={{ p: 2, mt: 1, mb: 2, bgcolor: 'warning.main', borderRadius: 1 }}>
                  <Typography color={"white"} >
                    No se ha seleccionado ninguna imagen
                  </Typography>
                </Box>
              )}
            </Box>

            <input
              ref={fileInputRef}
              type="file"
              className="form form-control"
              onChange={handleFileChange}
            />
            <Button
              variant="contained"
              onClick={handleRegister}
              sx={{
                mt: 2,
                float: "right",
                bgcolor: "#4CAF50",
                "&:hover": { bgcolor: "#388E3C" },
              }}
              className="mt-5"
              disabled={isLoading} // Deshabilita el botón cuando está cargando
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <>
                  Registrar
                  <AutorenewIcon sx={{ ml: 1 }} />
                </>
              )}
            </Button>
          </Box>
        </Modal>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default TbTraspaso;
