import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login             from './pages/Login';
import Signup            from './pages/Signup';
import MainLayout        from './layout/MainLayout';
import HospitalDashboard from './pages/HospitalDashboard';
import Order             from './pages/Order';
import VendorDashboard   from './pages/VendorDashboard';

const App = () => {
  return (
   
      <Routes>
        {/* 인증 페이지 */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* MainLayout이 필요한 내부 페이지 */}
        <Route element={<MainLayout />}>
          <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
          <Route path="/hospital/order"     element={<Order />} />
          <Route path="/vendor/dashboard"   element={<VendorDashboard />} />
        </Route>
      </Routes>
   
  );
};

export default App;
