// src/layouts/MainLayout.jsx
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import vectorLogo from '../assets/Vector.svg';
import toggleIcon from '../assets/sidebar-left.svg';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const user = JSON.parse(localStorage.getItem('userInfo')) || {};
  const role = user.role;
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // navItem을 text, path 두 인자로만 받도록 변경
  const navItem = (text, path) => (
    <div
      key={text}
      onClick={() => navigate(path)}
      style={{
        padding: '10px 20px',
        borderRadius: 8,
        fontSize: 16,
        color: '#111827',
        fontFamily: 'Inter V',   // 기본 폰트 고정
        cursor: 'pointer',
        transition: 'background 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start'
      }}
      onMouseOver={e => (e.currentTarget.style.background = '#E5E7EB')}
      onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
    >
      {text}
    </div>
  );

  // hospital / vendor 메뉴 정의
  const hospitalMenu = [
    navItem('메인화면',        '/hospital/dashboard'),
    navItem('주문서 작성하기', '/hospital/order'),
    navItem('명세서 관리',     '/hospital/invoice'),
    navItem('거래처',         '/hospital/logs'),
    navItem('결제하기',       '/hospital/payment')
  ];

  const vendorMenu = [
    navItem('메인화면',     '/vendor/dashboard'),
    navItem('주문관리',     '/vendor/orders'),
    navItem('명세서 발행',  '/vendor/invoice'),
    navItem('권한설정',     '/vendor/permissions')
  ];

  // 하단 링크 메뉴
  const footerLinks = [
    { text: 'Community',    path: '/community' },
    { text: '권한설정',      path: '/settings/permissions' },
    { text: '설정관리',      path: '/settings/general' },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {sidebarOpen && (
        <aside style={{
          width: 260,
          background: '#F8F8F8',
          padding: 20,
          borderRight: '1px solid #ECECEC',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* 로고 + 토글 버튼 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <img src={vectorLogo} alt="로고" style={{ width: 32, height: 24 }} />
              <span style={{
                color: '#475BE8',
                fontSize: 22,
                fontWeight: 800,
                fontFamily: 'Inter'
              }}>
                온라인 명세서
              </span>
            </div>
            <img
              src={toggleIcon}
              alt="Toggle"
              onClick={toggleSidebar}
              style={{ cursor: 'pointer', width: 24 }}
            />
          </div>

          {/* 네비게이션 메뉴 */}
          <nav style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {role === 'hospital' ? hospitalMenu : vendorMenu}
          </nav>

          {/* 하단 Links */}
          <div style={{ marginTop: 'auto', paddingTop: 16 }}>
            <div style={{
              fontSize: 14,
              color: '#6B7280',
              fontFamily: 'Inter V',
              marginBottom: 8
            }}>
              Links
            </div>
            {footerLinks.map(({ text, path }) => (
              <div
                key={text}
                onClick={() => navigate(path)}
                style={{
                  fontSize: 16,
                  color: '#111827',
                  fontFamily: 'Inter V',
                  marginBottom: 8,
                  padding: 8,
                  borderRadius: 8,
                  cursor: 'pointer'
                }}
                onMouseOver={e => (e.currentTarget.style.background = '#E5E7EB')}
                onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
              >
                {text}
              </div>
            ))}
          </div>

          {/* 사용자 정보 */}
          <div style={{
            marginTop: 16,
            paddingTop: 16,
            borderTop: '1px solid #ECECEC',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#E5E7EB'
            }} />
            <div>
              <div style={{
                color: '#111827',
                fontSize: 14,
                fontFamily: 'Inter V',
                fontWeight: '400',
                lineHeight: '24px'
              }}>
                {user.name || '사용자 이름'}
              </div>
              <div style={{
                color: '#6B7280',
                fontSize: 12,
                fontFamily: 'Inter V',
                fontWeight: '400',
                lineHeight: '16px'
              }}>
                {user.email || 'user@example.com'}
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* 메인 콘텐츠 영역 */}
      <main style={{ flex: 1, padding: 24 }}>
        {!sidebarOpen && (
          <div onClick={toggleSidebar} style={{ cursor: 'pointer', marginBottom: 12 }}>
            <span style={{ fontSize: 18, color: '#475BE8' }}>☰ 메뉴 열기</span>
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
