// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

import Login                        from './pages/Login';
import Signup                       from './pages/Signup';
import MainLayout                   from './layout/MainLayout';
import HospitalDashboard            from './pages/HospitalDashboard';
import Order                        from './pages/Order';
import VendorDashboard              from './pages/VendorDashboard';
import VendorStocks                 from './pages/VendorStocks';
import VendorOrdersManagement       from './pages/VendorOrdersManagement';
import VendorInvoice                from './pages/VendorInvoice';
import VendorLedger                 from './pages/VendorLedger';
import VendorClientManagement      from './pages/VendorClientManagement';


const App = () => (
  <Routes>
    {/* 루트 접속 시 로그인으로 리다이렉트 */}
    <Route path="/" element={<Navigate to="/login" replace />} />

    {/* 인증 페이지 */}
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />

    {/* MainLayout 하위 라우트 */}
    <Route element={<MainLayout />}>
      <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
      <Route path="/hospital/order"     element={<Order />} />

      {/* 공급업체 페이지 */}
      <Route path="/vendor/dashboard" element={<VendorDashboard />} />
      <Route path="/vendor/stocks"    element={<VendorStocks />} />
      <Route path="/vendor/orders"    element={<VendorOrdersManagement />} />
      <Route path="/vendor/invoice"   element={<VendorInvoice />} />
      <Route path="/vendor/clients"    element={<VendorClientManagement />} />
      {/* 추가: 거래장 조회 페이지 */}
      <Route path="/vendor/trade"     element={<VendorLedger />} />
    </Route>

    {/* 매칭되지 않는 경로는 대시보드로 */}
    <Route path="*" element={<Navigate to="/hospital/dashboard" replace />} />
  </Routes>
);

export default App;
