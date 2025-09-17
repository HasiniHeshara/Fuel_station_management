import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Home from './Components/Home/home';

import FuelLevels from './Components/FuelLevel/FuelLevel';

import EVRegister from './Components/EVRegister/EVRegister';
import EVLogin from './Components/EVLogin/EVLogin';
import EVProfile from './Components/EVList/EVList';





function App() {
  return (
    <div>
      <React.Fragment>
        <Routes>


          <Route path="/" element={<Home/>}/>
          <Route path="/mainhome" element={<Home/>}/>

                    <Route path="/fuel-levels" element={<FuelLevels />} />
                    <Route path="/evregister" element={<EVRegister />} />
                    <Route path="/evlog" element={<EVLogin />} />
                    <Route path="/ev/profile/:id" element={<EVProfile />} />




          </Routes>
          </React.Fragment>
          </div>
      );
}

export default App;
