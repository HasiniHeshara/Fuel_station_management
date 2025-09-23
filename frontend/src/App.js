import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Home from './Components/Home/home';

import FuelLevels from './Components/FuelLevel/FuelLevel';

import EVBookingPayment from './Components/EVPaymentForm/EVBookingPayment';
import AdminBulkOrders from './Components/AdminBulkOrders/AdminBulkOrders';

import VehicleDetailsPage from './Components/EVPaymentForm/EVPaymentList';
import EVDetail from './Components/EVDetails/EVDetails';


import EVRegister from './Components/EVRegister/EVRegister';
import EVLogin from './Components/EVLogin/EVLogin';
import EVProfile from './Components/EVList/EVList';
import FactoryLogin from './Components/FactoryLogin/FactoryLogin';
import FRegister from './Components/AddFactory/RegisterFactory';
import FactoryProfile from './Components/FactoryProfile/FactoryProfile';
import Contact from './Components/Contact/Contact';
import Admin from './Components/Admin/Admin';
import UpdateEV from './Components/UpdateEV/UpdateEV';
import UpdateFactory from './Components/UpdateFactory/UpdateFactory';
import UpdateMember from './Components/UpdateMember/UpdateMember';


import AddFuelMember from './Components/AddMember/AddMember';
import DisplayFuelMember from './Components/MemberDisplay/MemberDisplay'; 
import SingleMember from './Components/SingleMember/SingleMember';
import MemberLogin from './Components/MemberLogin/MemberLogin';

import PaymentPage from './Components/Payment/payment';
import DisplayPayment from './Components/DisplayPayment/DisplayPayment';
import UpdatePayment from './Components/UpdatePayment/UpdatePayment';
import PaymentDetails from './Components/SinglePayment/SinglePayment';

import AddStock from './Components/AddStock/AddStock';
import DisplayStock from './Components/StockDisplay/StockDisplay';
import UpdateStock from './Components/UpdateStock/UpdateStock';


import AllFactories from './Components/DisplayFactory/DisplayFactory';

import DisplayRecord from './Components/DisplayRecord/DisplayRecord';
import BulkOrderForm from './Components/BulkOrderFrom/BulkOrderForm';
import DailySummary from './Components/FuelIncomeSummary/DailyIncomeSummary';
import BulkPaymentList from './Components/BulkPaymentList/BulkPaymentList';

     


import FuelStations from './Components/FuelStations/FuelStations';
import ServicesPage from './Components/ServicePage/ServicesPage';
import FuelPricesPage from './Components/FuelPricePage/FuelPricesPage';
import PrivacyPolicy from './Components/PrivacyPolicy/PrivacyPolicy';
import TermsOfService from './Components/PrivacyPolicy/TermsOfService';



import CustomerChat from './Components/MessageCustomer/CustomerChat';
import AdminChat from './Components/MessageAdmin/AdminChat';
import EnterPin from './Components/Pin/EnterPin';
import CreatePin from './Components/Pin/CreatePin';

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
                    <Route path="/ev/updateEV/:id" element={<UpdateEV />} />
                    <Route path="/evlog" element={<EVLogin />} />
                    <Route path="/ev/profile/:id" element={<EVProfile />} />
                    <Route path="/flogin" element={<FactoryLogin />} />
                    <Route path="/fRegister" element={<FRegister />} />
                    <Route path="/factory/profile/:id" element={<FactoryProfile />} />
                    <Route path="/factories" element={<AllFactories />} />
                    <Route path="/factory/update/:id" element={<UpdateFactory />} />
          

                    <Route path="/addstock" element={<AddStock/>}/>
                    <Route path="/displaystock/:id" element={<DisplayStock/>}/>
                    <Route path="/updatestock/:id" element={<UpdateStock/>}/>


                    <Route path="/placeorder/:id" element={<BulkOrderForm />} />

                    <Route path="/sales" element={<DisplayRecord />} />


          <Route path="/EVBookingPayment" element={<EVBookingPayment />} />

          <Route path="/allEV" element={<EVDetail />} />

          <Route path="/admin/bulkorders" element={<AdminBulkOrders />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} /> 

          <Route path="/addmember" element={<AddFuelMember/>}/>
          <Route path="/displaymember" element={<DisplayFuelMember/>}/>
          <Route path="/memberlogin" element={<MemberLogin />} />
            <Route path="/displaysinglemember/:id" element={<SingleMember />} />
           <Route path="/updatemember/:id" element={<UpdateMember />} />


          <Route path="/payment/:id" element={<PaymentPage />} />
          <Route path="/displaypayments" element={<DisplayPayment />} />
          <Route path="/updatepayment/:id" element={<UpdatePayment />} />
          <Route path="/paymentdetails/:id" element={<PaymentDetails />} />       

            <Route path="/stations" element={<FuelStations />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/fuel-prices" element={<FuelPricesPage />} />   
            <Route path="/privacy" element={<PrivacyPolicy/>} />
          <Route path="/term" element={<TermsOfService/>} />  
                    <Route path="/evpayment/details" element={<VehicleDetailsPage />} />
 

               <Route path="/bulkpaymentlist" element={<BulkPaymentList />} />

                    <Route path="/summary" element={<DailySummary />} />

          <Route path="/customerchat/:pin" element={<CustomerChat/>} />
          <Route path="/adminchat" element={<AdminChat/>} />
          <Route path="/enterpin" element={<EnterPin/>} />
          <Route path="/createpin" element={<CreatePin/>} />


          </Routes>
          </React.Fragment>
          </div>
      );
}

export default App;
