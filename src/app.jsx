import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

import Login             from './pages/Login';
import Signup            from './pages/Signup';
import MainLayout        from './layout/MainLayout';
import HospitalDashboard from './pages/HospitalDashboard';
import Order             from './pages/Order';
import VendorDashboard   from './pages/VendorDashboard';
import VendorStocks      from './pages/VendorStocks';
import VendorOrdersManagement from './pages/VendorOrdersManagement';

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
      {/* 주문(Invoice) 페이지 */}
      <Route path="/hospital/order"     element={<Order />} />
      {/* 공급업체 페이지 */}
      <Route path="/vendor/dashboard"   element={<VendorDashboard />} />
      <Route path="/vendor/stocks"      element={<VendorStocks />} />
      <Route path="/vendor/orders"      element={<VendorOrdersManagement />} />
    </Route>

    {/* 매칭되지 않는 경로는 대시보드로 */}
    <Route path="*" element={<Navigate to="/hospital/dashboard" replace />} />
  </Routes>
);

export default App;
