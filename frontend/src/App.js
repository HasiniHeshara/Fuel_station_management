import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Home from './Components/Home/home';

import FuelLevels from './Components/FuelLevel/FuelLevel';





function App() {
  return (
    <div>
      <React.Fragment>
        <Routes>


          <Route path="/" element={<Home/>}/>
          <Route path="/mainhome" element={<Home/>}/>

                    <Route path="/fuel-levels" element={<FuelLevels />} />




          </Routes>
          </React.Fragment>
          </div>
      );
}

export default App;
