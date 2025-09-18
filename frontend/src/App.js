import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Home from './Components/Home/home';

import FuelLevels from './Components/FuelLevel/FuelLevel';

import EVBookingPayment from './Components/EVPaymentFrom/EVBookingPayement';

import EVRegister from './Components/EVRegister/EVRegister';
import EVLogin from './Components/EVLogin/EVLogin';
import EVProfile from './Components/EVList/EVList';
import FactoryLogin from './Components/FactoryLogin/FactoryLogin';
import FRegister from './Components/AddFactory/RegisterFactory';
import FactoryProfile from './Components/FactoryProfile/FactoryProfile';
import Contact from './Components/Contact/Contact';
import Admin from './Components/Admin/Admin';

import PaymentPage from './Components/Payment/payment';
import DisplayPayment from './Components/DisplayPayment/DisplayPayment';
import UpdatePayment from './Components/UpdatePayment/UpdatePayment';
import PaymentDetails from './Components/SinglePayment/SinglePayment';

import AddStock from './Components/AddStock/AddStock';
import DisplayStock from './Components/StockDisplay/StockDisplay';

import DisplayRecord from './Components/DisplayRecord/DisplayRecord';


function App() {
  return (
    <div>
      <React.Fragment>
        <Routes>


          <Route path="/" element={<Home/>}/>
          <Route path="/mainhome" element={<Home/>}/>


          <Route path="/fuel-levels" element={<FuelLevels />} />
                    <Route path="/fuel-levels" element={<FuelLevels />} />
                    <Route path="/evregister" element={<EVRegister />} />
                    <Route path="/evlog" element={<EVLogin />} />
                    <Route path="/ev/profile/:id" element={<EVProfile />} />
                    <Route path="/flogin" element={<FactoryLogin />} />
                    <Route path="/fRegister" element={<FRegister />} />
                    <Route path="/factory/profile/:id" element={<FactoryProfile />} />

                    <Route path="/addstock" element={<AddStock/>}/>

                    <Route path="/addstock" element={<AddStock/>}/>
                    <Route path="/displaystock/:id" element={<DisplayStock/>}/>

                    <Route path="/sales" element={<DisplayRecord />} />


          <Route path="/EVBookingPayment" element={<EVBookingPayment />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} /> 


          <Route path="/payment/:id" element={<PaymentPage />} />
          <Route path="/displaypayments" element={<DisplayPayment />} />
          <Route path="/updatepayment/:id" element={<UpdatePayment />} />
          <Route path="/paymentdetails/:id" element={<PaymentDetails />} />          



          </Routes>
          </React.Fragment>
          </div>
      );
}

export default App;
