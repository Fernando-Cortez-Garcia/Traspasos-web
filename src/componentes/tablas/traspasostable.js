import React, { useEffect, useState } from "react";
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
import {
  createTheme,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material/styles";
import EditNoteIcon from "@mui/icons-material/EditNote";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import {
  fetchTraspasos,
  registerEvidence,
  uploadPhoto,
} from "../../api/peticiones";
import "react-toastify/dist/ReactToastify.css";
import toastr from "toastr";

const TbTraspaso = ({ fecha }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para controlar la carga de datos
  const [open, setOpen] = useState(false);
  const [rowIndex, setRowIndex] = useState(null);
  const [updateValue, setUpdateValue] = useState(null);
  const [fileName, setFileName] = useState("");
  const [name, setName] = useState("");
  const [iddoc, setIddoc] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Estado para el btn

  const handleOpen = (index, update, iddoc) => {
    setRowIndex(index);
    setUpdateValue(() => update);
    setIddoc(iddoc);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIddoc("");
    setFileName("");
    setName("");
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
      const registerResult = await registerEvidence(name, iddoc, file);

      if (
        registerResult.status === "exitoso" ||
        registerResult.status === "success"
      ) {
        await uploadPhotoAndRefreshTable(iddoc, file);
        toastr.success("Evidencia registrada exitosamente");
      } else {
        toastr.error("Error al registrar la evidencia");
      }
    } catch (error) {
      console.error("Error en handleRegister:", error.message);
      toastr.error("Error al registrar la evidencia");
    } finally {
      setIsLoading(false);
      handleClose();
    }
  };

  const uploadPhotoAndRefreshTable = async (docId, selectedFile) => {
    try {
      //Se comprime la imagen
      const compressedImage = await compressImage(selectedFile, 60);

      //Se envia la imagen comprimida
      const photoUploadResult = await uploadPhoto(docId, compressedImage);
      if (
        photoUploadResult.status === "exitoso" ||
        photoUploadResult.status === "success"
      ) {
        await refreshTable(); // Actualiza la tabla después de subir la foto
      } else {
        toastr.error("Error al subir la foto");
      }
    } catch (error) {
      console.error("Error en uploadPhotoAndRefreshTable:", error.message);
      toastr.error("Error al subir la foto");
    }
  };

  const compressImage = (imagenComoArchivo, porcentajeCalidad) => {
    return new Promise((resolve, reject) => {
      const $canvas = document.createElement("canvas");
      const imagen = new Image();
      imagen.onload = () => {
        $canvas.width = imagen.width;
        $canvas.height = imagen.height;
        $canvas.getContext("2d").drawImage(imagen, 0, 0);
        $canvas.toBlob(
          (blob) => {
            if (blob === null) {
              return reject(blob);
            } else {
              resolve(blob);
            }
          },
          "image/jpeg",
          porcentajeCalidad / 100
        );
      };
      imagen.src = URL.createObjectURL(imagenComoArchivo);
    });
  };

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
      },
    },
    {
      name: "ESTADO",
      label: "Estado",
      options: {
        filter: true,
        sort: false,
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
      <ThemeProvider theme={createTheme()}>
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
