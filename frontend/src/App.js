import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Home from './Components/Home/home';




function App() {
  return (
    <div>
      <React.Fragment>
        <Routes>


          <Route path="/" element={<Home/>}/>
          <Route path="/mainhome" element={<Home/>}/>



          </Routes>
          </React.Fragment>
          </div>
      );
}

export default App;
