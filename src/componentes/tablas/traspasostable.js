import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { Button } from "@mui/material";
import { createTheme, StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import EditNoteIcon from '@mui/icons-material/EditNote';

const apiUrl = 'http://hidalgo.no-ip.info:5610/hidalgoapi/production/Panel.php';

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
          <Button
            variant="contained"
            component="label"
          >
            <EditNoteIcon />
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
    updateValue(file.name); // Update the cell value if necessary
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

export default function TbTraspaso({ fecha }) {
  const [data, setData] = useState([]);

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

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={createTheme()}>
        <MUIDataTable
          data={data}
          columns={columns}
          options={options}
        />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
