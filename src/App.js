import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './screens/auth/login';
import Traspasos from './screens/Traspasos/traspasos'



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<SignIn />} />
        <Route path="/traspasos" element={<Traspasos />} />
      </Routes>
    </Router>
  );
}

export default App;
