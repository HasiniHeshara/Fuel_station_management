import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Home from './Components/Home/home';

import FuelLevels from './Components/FuelLevel/FuelLevel';

import EVBookingPayment from './Components/EVPaymentForm/EVBookingPayment';






function App() {
  return (
    <div>
      <React.Fragment>
        <Routes>


          <Route path="/" element={<Home/>}/>
          <Route path="/mainhome" element={<Home/>}/>

          <Route path="/fuel-levels" element={<FuelLevels />} />

          <Route path="/EVBookingPayment" element={<EVBookingPayment />} />





          </Routes>
          </React.Fragment>
          </div>
      );
}

export default App;
