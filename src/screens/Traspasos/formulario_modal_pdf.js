import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { applyPlugin } from "jspdf-autotable";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import {
  Typography,
  Card,
  CardContent,
  Button,
  Tooltip,
  MenuItem,
  Alert,
  FormControl,
  InputLabel,
  Select,
  Autocomplete,
} from "@mui/material";
import {
  fetchTransfersToPdf,
  fetchTransferIssuers,
} from "../../api/peticiones";

import "bootstrap/dist/css/bootstrap.css";

import { useThemeContext } from "../../theme/ThemeContextProvider.tsx";

applyPlugin(jsPDF);

const FormularioModalPdf = () => {
  // Declaración de variables ------------------------------------------------------------
  const { theme } = useThemeContext();
  const [fechaInicial, setFechaInicial] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");
  const [tipo, setTipo] = useState("TODOS");
  const [filtro, setFiltro] = useState("");
  const [dataReport, setDataReport] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [emisores, setEmisores] = useState([]);
  const [error, setError] = useState(false);

  const debounceTime = 500;

  // Declaración de funciones ------------------------------------------------------------
  const verifyData = () => {
    setDataReport([]);
    setError(false);

    let error = false;
    let objectValues = {};

    objectValues = {
      fechaInicial: fechaInicial,
      fechaFinal: fechaFinal,
      tipo: tipo,
      filtro: filtro,
    };

    for (const key in objectValues) {
      if (tipo == "TODOS") {
        if (!objectValues[key] && key != "filtro") {
          error = true;
          setError(true);
        }
      } else {
        if (!objectValues[key]) {
          error = true;
          setError(true);
        }
      }
    }

    if (error) {
      return null;
    }

    getDataPdf();
  };

  // Ejecutar verifyData cuando los valores cambien
  useEffect(() => {
    const obtenerEmisores = async () => {
      try {
        const response = await fetchTransferIssuers();
        const nombresEmisores = response.map((emisor) => emisor.NOMBRE);
        setEmisores(nombresEmisores);
      } catch (error) {
        console.error("Error en obtener emisores:", error.message);
      }
    };

    obtenerEmisores();
  }, []);

  useEffect(() => {
    verifyData();
  }, [fechaInicial, fechaFinal, tipo]);

  useEffect(() => {
    const handler = setTimeout(() => {
      verifyData();
    }, debounceTime);

    return () => clearTimeout(handler);
  }, [filtro]);

  const getDataPdf = async () => {
    try {
      setIsLoadingData(true);
      const filteredData = await fetchTransfersToPdf(
        fechaInicial,
        fechaFinal,
        tipo,
        filtro
      );
      setDataReport(filteredData);
      setIsLoadingData(false);
    } catch (error) {
      console.error("Error en fetchDataAndSetData:", error.message);
    }
  };

  const generatePdf = () => {
    const doc = new jsPDF({ orientation: "landscape" });

    // Título del documento (centrado y en negritas)
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    const title = "TRASPASOS TALLER";
    const titleWidth = doc.getTextWidth(title);
    const xPosition = (doc.internal.pageSize.width - titleWidth) / 2;
    doc.text(title, xPosition, 15);

    // Definir columnas de la tabla
    const columns = [
      "FOLIO",
      "FECHA",
      "NOTA",
      "EMISOR",
      "SOLICITA",
      "CLAVE",
      "DESCRIPCIÓN",
      "CANT",
      "UNIDAD",
      "COSTO",
    ];

    // Ordenar los datos
    const sortedData = [...dataReport].sort((a, b) => {
      // Ordenar por FECHA (convirtiéndolas a objetos Date)
      const dateA = new Date(a.FECHA);
      const dateB = new Date(b.FECHA);
      if (dateA - dateB !== 0) return dateA - dateB;

      // Ordenar por NOTA (alfabéticamente)
      if (a.NOTA.localeCompare(b.NOTA) !== 0)
        return a.NOTA.localeCompare(b.NOTA);

      // Ordenar por EMISOR (alfabéticamente)
      if (a.NOMBRE.localeCompare(b.NOMBRE) !== 0)
        return a.NOMBRE.localeCompare(b.NOMBRE);

      return 0; // Si son iguales, mantener el orden
    });

    // Formatear datos en filas ordenadas
    const rows = [];
    sortedData.forEach((item) => {
      // Ordenar contenido por DESCRIPCIÓN
      const sortedContenido = [...item.contenido].sort((a, b) =>
        a.DESCRIPCIO.localeCompare(b.DESCRIPCIO)
      );

      sortedContenido.forEach((detalle) => {
        rows.push([
          item.NUMERO, // FOLIO
          item.FECHA, // FECHA
          item.NOTA, // NOTA
          item.NOMBRE, // EMISOR
          item.XSOLICITA, // SOLICITA
          detalle.CLAVE, // CLAVE
          detalle.DESCRIPCIO, // DESCRIPCIÓN
          detalle.DESCANTIDAD, // CANTIDAD
          detalle.UNIDAD, // UNIDAD
          detalle.IMPORTECONCEPTO, // COSTO
        ]);
      });
    });

    // Generar tabla
    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 25,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    // Agregar fecha de expedición al final
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    doc.setFontSize(10);
    doc.text(
      `FECHA DE EXPEDICIÓN: ${day}-${month}-${year}`,
      14,
      doc.internal.pageSize.height - 10
    );

    // Guardar PDF
    doc.save("Traspasos_Taller.pdf");
  };

  return (
    <ThemeProvider theme={theme}>
      <Card
        sx={{
          maxWidth: 500,
          mx: "auto",
          my: 3,
          //p: 2,
          boxShadow: 0,
          borderRadius: 2,
          gap: 50,
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            align="center"
            className="mb-5 mt-0"
          >
            Generar Reporte PDF
          </Typography>

          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={6}>
              <TextField
                id="start-date"
                label="Fecha inicio"
                type="date"
                value={fechaInicial}
                onChange={(e) => setFechaInicial(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                id="end-date"
                label="Fecha fin"
                type="date"
                value={fechaFinal}
                onChange={(e) => setFechaFinal(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="tipo-label">Tipo</InputLabel>
                <Select
                  labelId="tipo-label"
                  id="tipo"
                  value={tipo}
                  onChange={(e) => {
                    setFiltro("");
                    setTipo(e.target.value);
                  }}
                >
                  <MenuItem value="TODOS">Todos</MenuItem>
                  <MenuItem value="EMISOR">Emisor</MenuItem>
                  <MenuItem value="XSOLICITA">Solicita</MenuItem>
                  <MenuItem value="DESCRIPCIO">Descripcion</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              {tipo != "EMISOR" ? (
                <TextField
                  id="filtro"
                  label="Filtro"
                  type="text"
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  disabled={tipo == "TODOS"}
                />
              ) : (
                <Autocomplete
                  id="filtro"
                  options={emisores}
                  value={filtro}
                  onChange={(event, newValue) => setFiltro(newValue)}
                  disabled={tipo == "TODOS"}
                  fullWidth
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Filtro"
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
              )}
            </Grid>

            <Grid item xs={12}>
              <Tooltip
                title={
                  dataReport.length == 0 ? "No hay datos para mostrar" : ""
                }
              >
                <span>
                  <Button
                    onClick={generatePdf}
                    variant="contained"
                    color="error"
                    fullWidth
                    disabled={dataReport.length == 0}
                  >
                    {isLoadingData ? (
                      <div class="loader"></div>
                    ) : (
                      <svg
                        width="31"
                        height="33"
                        viewBox="0 0 31 33"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_4019_3089)">
                          <path
                            d="M31 26.8906V27.7859H28.9405V29.3395C28.9405 29.3453 29.0121 29.4185 29.0177 29.4185H30.897V30.3138H28.9405V32.9996H27.988C27.9823 32.9996 27.9108 32.9264 27.9108 32.9206V26.8906H31Z"
                            fill="#FEFEFE"
                          />
                          <path
                            d="M30.3232 19.5519C29.086 16.9725 23.7776 17.3153 21.4555 17.5765C20.9402 17.6345 20.4243 17.7503 19.9099 17.8177C19.6571 17.7872 18.2695 16.1114 18.027 15.8034C17.127 14.6579 16.3279 13.4219 15.5736 12.1727C16.2229 9.93085 17.0148 7.4641 17.1491 5.11425C17.2686 3.02193 16.4067 -0.0199139 13.889 9.82391e-05C12.4247 0.0116842 11.5066 1.30247 11.2435 2.65487C10.7328 5.28804 11.7929 8.29197 12.7717 10.6918C11.5689 14.2066 10.2262 17.6892 8.50339 20.9702C6.14116 22.0714 3.4736 23.1936 1.54849 25.0211C0.266453 26.2376 -0.83692 28.3051 0.883786 29.7044C2.39545 30.9331 4.53475 30.2305 5.94139 29.1983C8.35511 27.4278 10.1428 24.4649 11.587 21.8597C14.0512 20.9628 16.6137 20.3356 19.1777 19.7963C21.4792 21.7812 24.3764 23.5317 27.5177 23.2505C29.3213 23.0888 31.2891 21.5663 30.3232 19.5519ZM6.9768 24.1484C6.19522 25.3987 4.05077 28.4684 2.54734 28.6232C1.77452 28.7028 1.54849 28.1751 1.67515 27.4678C1.91353 26.1402 4.94614 24.4138 6.07886 23.8093C6.24156 23.7224 7.51329 23.0409 7.5725 23.0999C7.61524 23.1415 7.04218 24.0431 6.9768 24.1484ZM12.7985 2.61273C13.2866 0.889585 14.5006 1.49574 14.6258 3.06195C14.7828 5.0263 14.1438 7.0154 13.648 8.88022C13.4766 8.69958 13.404 8.37307 13.3257 8.13082C12.8546 6.66256 12.3799 4.09311 12.7985 2.61273ZM12.8767 19.5182L14.8332 14.4625C15.7353 15.7407 16.5818 17.072 17.6645 18.2011L12.8767 19.5182ZM27.2381 21.2793C25.8896 22.2847 23.2113 20.7464 22.0137 19.9411C21.6594 19.7026 21.3335 19.4098 20.9597 19.2017C20.969 19.1306 21.0297 19.109 21.0905 19.099C21.8273 18.9763 22.8009 19.0106 23.5593 18.9911C24.5968 18.9647 26.7793 18.7994 27.4739 19.7278C27.8554 20.2376 27.7329 20.9096 27.2381 21.2793Z"
                            fill="#FEFEFE"
                          />
                          <path
                            d="M26.6688 28.9772C26.5345 28.0282 25.9187 26.8906 24.8472 26.8906H22.556V32.9996H24.5383C26.6271 32.9996 26.9005 30.6092 26.6688 28.9772ZM25.3276 31.5951C25.2267 31.7488 24.8632 32.0516 24.6928 32.0516H23.5343V27.7859H24.6413C24.8838 27.7859 25.2462 28.0924 25.3693 28.3052C25.7658 28.9887 25.7637 30.931 25.3276 31.5951Z"
                            fill="#FEFEFE"
                          />
                          <path
                            d="M20.8225 27.2156C20.6943 27.1155 20.2515 26.8906 20.1105 26.8906H17.7163V32.9206C17.7163 32.9264 17.7879 32.9996 17.7935 32.9996H18.6688C18.6745 32.9996 18.7461 32.9264 18.7461 32.9206V30.6297H19.7501C20.1002 30.6297 20.6459 30.4296 20.9096 30.1831C21.5727 29.5638 21.5634 27.797 20.8225 27.2156ZM20.2114 29.3637C20.146 29.4696 19.8592 29.6818 19.7501 29.6818H18.7461V27.7859H19.853C19.868 27.7859 20.0801 27.9155 20.111 27.9434C20.4127 28.2135 20.4168 29.0298 20.2114 29.3637Z"
                            fill="#FEFEFE"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_4019_3089">
                            <rect width="31" height="33" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    )}
                    Generar
                  </Button>
                </span>
              </Tooltip>

              <div className="mt-2"></div>

              {!error && !isLoadingData && dataReport.length == 0 ? (
                <Alert
                  severity="error"
                  sx={{ fontWeight: "bold", borderRadius: 2 }}
                >
                  No se encontraron registros para los datos ingresados, intente
                  con otros datos.
                </Alert>
              ) : (
                <p></p>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default FormularioModalPdf;
