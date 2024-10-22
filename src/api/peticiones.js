const apiUrl = process.env.REACT_APP_URL_PETICIONES;
//Función modificada que verifica si la respuesta de la api es un error de usuario o red
const fetchLogin = async (usuario, contra) => {

  try {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer YOUR_TOKEN_HERE");

    const formdata = new FormData();
    formdata.append("opcion", "1.2");
    formdata.append("usuario", usuario);
    formdata.append("contra", contra);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    const response = await fetch(apiUrl, requestOptions);

    // Verificar si la respuesta es OK
    if (!response.ok) {
      // Obtener el texto del error de la respuesta
      const errorText = await response.text(); 
      let errorMessage = `HTTP error! Status: ${response.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson && errorJson.message) {
          errorMessage += ` - ${errorJson.message}`;
        }
      } catch (e) {
        errorMessage += ` - ${errorText}`;
      }
      throw new Error(errorMessage);
    }

    const result = await response.text();
    try {
      return JSON.parse(result)[0];
    } catch (e) {
      throw new Error(`JSON parse error: ${e.message}`);
    }
  } catch (error) {
    if (error instanceof TypeError) {
      // Error de la api
      throw new Error(`Network error: ${error.message}. Intentelo de nuevo más tarde.`);
    } else {
      // Error de red
      throw new Error("Usuario o contraseña incorrectas.");
    }
  }
};

const fetchTraspasos = async (fecha) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer YOUR_TOKEN_HERE");

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

    const filteredData = parsedResult.filter((item) => item.XSOLICITA === "");
    const modifiedData = filteredData.map((item) => {
      //C = Cancelado
      if (item.ESTADO === "C") {
        return { ...item, ESTADO: "Cancelado" };
      }
      if (item.ESTADO === "I") {
        return { ...item, ESTADO: "Impreso" };
      }
      return item;
    });
    return modifiedData;
  } catch (error) {
    console.error("Error en fetchTraspasos:", error.message);
    throw error;
  }
};

const fetchDetallesTraspasos = async (docid) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer YOUR_TOKEN_HERE");

    const formdata = new FormData();
    formdata.append("opcion", "50");
    formdata.append("docid", docid);

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
      return (parsedResult = JSON.parse(result));
    } catch (e) {
      throw new Error(`JSON parse error: ${e.message}`);
    }
  } catch (error) {
    console.error("Error en fetchTraspasos:", error.message);
    throw error; // Re-lanzar el error para manejarlo en el componente que llame a fetchTraspasos
  }
};

const fetchFotosTraspasos = async (docid) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer YOUR_TOKEN_HERE");

    const formdata = new FormData();
    formdata.append("opcion", "49");
    formdata.append("docid", docid);

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
      return (parsedResult = JSON.parse(result));
    } catch (e) {
      throw new Error(`JSON parse error: ${e.message}`);
    }
  } catch (error) {
    console.error("Error en fetchTraspasos:", error.message);
    throw error; // Re-lanzar el error para manejarlo en el componente que llame a fetchTraspasos
  }
};

const fetchTraspasosCheck = async (fecha) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer YOUR_TOKEN_HERE");

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

    const filteredData = parsedResult.filter((item) => item.XSOLICITA !== "");
    const modifiedData = filteredData.map((item) => {
      if (item.ESTADO === "C") {
        return { ...item, ESTADO: "Cancelado" };
      }
      if (item.ESTADO === "I") {
        return { ...item, ESTADO: "Impreso" };
      }
      return item;
    });

    return modifiedData;
  } catch (error) {
    console.error("Error en fetchTraspasos:", error.message);
    throw error; // Re-lanzar el error para manejarlo en el componente que llame a fetchTraspasos
  }
};

const registerEvidence = async (nombre, docid) => {
  try {
    const formData = new FormData();
    formData.append("opcion", "47");
    formData.append("nombre", nombre);
    formData.append("docid", docid);

    const response = await fetch(
      "http://hidalgo.no-ip.info:5610/hidalgoapi/production/Panel.php",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { status: text };
    }

    return data;
  } catch (error) {
    console.error("Error en registerEvidence:", error.message);
    throw error; // Re-lanzar el error para manejarlo en el componente que llame a registerEvidence
  }
};


const uploadPhoto = async (docId, file) => {

  try {
    const photoData = new FormData();
    photoData.append("opcion", "48");
    photoData.append("docid", docId);
    photoData.append("foto", file);

    const response = await fetch(
      "http://hidalgo.no-ip.info:5610/hidalgoapi/production/Panel.php",
      {
        method: "POST",
        body: photoData,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { status: text };
    }

    return data;
  } catch (error) {
    console.error("Error en uploadPhoto:", error.message);
    throw error; // Re-lanzar el error para manejarlo en el componente que llame a uploadPhoto
  }
};

export {
  fetchLogin,
  fetchTraspasos,
  registerEvidence,
  uploadPhoto,
  fetchTraspasosCheck,
  fetchDetallesTraspasos,
  fetchFotosTraspasos,
};
