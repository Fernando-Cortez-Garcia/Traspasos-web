import { useEffect } from 'react';

const apiUrl = 'http://hidalgo.no-ip.info:5610/hidalgoapi/production/Panel.php';

const Traspasos = ({ option, fecha, onData }) => {
  useEffect(() => {
    const traspasos = async () => {
      try {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJGZXJuYW5kbyIsIm5hbWUiOiJmZXIxMiIsImV4cCI6MTcxNjM5NjYyMCwiaWF0IjoxNzE2Mzk2NDQwfQ.XePwxaH6oBy0zwYCqiocdIhGSTLUEf-6XEPJWB-s5sA");

        const formdata = new FormData();
        formdata.append("opcion", option);
        formdata.append("fecha", fecha);

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: formdata,
          redirect: "follow",
        };

        const respuesta = await fetch(apiUrl, requestOptions);
        const result = await respuesta.text();
        const parsedResult = JSON.parse(result);

        onData(parsedResult);

      } catch (error) {
        console.error('Error:', error.message);
      }
    };

    traspasos();
  }, []); // Empty dependency array to ensure it runs only once on mount

  return null; // No need to return any UI component
};

export default Traspasos;
