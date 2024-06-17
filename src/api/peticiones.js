import { useEffect } from 'react';

const apiUrl = 'http://hidalgo.no-ip.info:5610/hidalgoapi/production/Panel.php';


const Traspasos= ({ option, fecha,ondata}) => {
  useEffect(() => {
    const traspasos = async () => {
      try {
        const formdata = new FormData();
        formdata.append("opcion", option);
        formdata.append("fecha", fecha);
        const requestOptions = {
          method: "POST",
          body: formdata,
        };
        
        // Convierte la respuesta en texto y luego a un json para poder ocuparlo mas facilmente
        const respuesta = await fetch(apiUrl, requestOptions);
        const result = await respuesta.text();
        const parsedResult = JSON.parse(result);

        // La funcion regresa el resultado del JSON
        ondata(parsedResult)

      } catch (error) {
        console.error('Error:', error.message);
      }
    };

    traspasos();
  }, []); // Se monta una unica vez para que no haga peticiones todo el tiempo

  return null; // No hay necesidad de devolver nada ya que esto es solo para la lógica de conexión
};

export default Traspasos;