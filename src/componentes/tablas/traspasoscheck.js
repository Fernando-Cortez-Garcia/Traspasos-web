import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { Button } from "@mui/material";
import {
  createTheme,
  StyledEngineProvider,
  ThemeProvider
} from "@mui/material/styles";
import Traspasos from "../../api/peticiones"; // Asegúrate de tener la importación correcta
import PhotoSizeSelectActualIcon from '@mui/icons-material/PhotoSizeSelectActual';
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
    label: "Evidencia",
    options: {
      customBodyRender: (value, tableMeta, updateValue) => {
        return (
          <Button
            variant="contained"
            component="label"
          >
             <PhotoSizeSelectActualIcon />
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => handleFileUpload(e, tableMeta.rowIndex, updateValue)}
            />
          </Button>
        );
      }
    }
  },
];

const handleFileUpload = (event, rowIndex, updateValue) => {
  const file = event.target.files[0];
  if (file) {
    console.log(`File uploaded in row ${rowIndex}:`, file);
    updateValue(file.name); // Actualiza el valor de la celda si es necesario
  }
};

const options = {
  filter: false,
  print: false,
  download: false,
  viewColumns: false,
  selectableRows: 'none',
  textLabels: {
    body: {
      noMatch: "Lo siento, no se encontraron registros coincidentes",
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

export default function App() {
  const [data, setData] = useState([]);
  const handleData = (fetchedData) => {
    const filteredData = fetchedData.filter(item => item.XSOLICITA != "");
    setData(filteredData);
  };

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={createTheme()}>
        <Traspasos option="46" fecha="2024-06-15" onData={handleData} />
            <MUIDataTable
              data={data}
              columns={columns}
              options={options}
            />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
