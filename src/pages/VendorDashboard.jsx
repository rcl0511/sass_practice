// src/pages/VendorDashboard.jsx
import React from 'react';

const VendorDashboard = () => {
  const user = JSON.parse(localStorage.getItem('userInfo')) || {};

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', color: '#475BE8' }}>도매업체 대시보드</h1>
      <p style={{ marginTop: 12 }}>환영합니다, <strong>{user.email}</strong> 님!</p>
      <p>여기서 병원 주문 관리, 명세서 발행, 권한 설정 등을 진행할 수 있습니다.</p>
    </div>
  );
};

export default VendorDashboard;