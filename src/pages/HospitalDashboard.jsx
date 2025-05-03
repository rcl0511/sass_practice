// src/pages/HospitalDashboard.jsx
import React, { useEffect, useState, useContext } from 'react';
import { Mail } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';

const HospitalDashboard = () => {
  const { userInfo } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch('/orders.json')
      .then(res => {
        if (!res.ok) throw new Error('응답 오류');
        return res.text();
      })
      .then(text => JSON.parse(text))
      .then(data => setOrders(data))
      .catch(err => console.error('주문 데이터 로딩 실패:', err));
  }, []);

  useEffect(() => {
    fetch('/messages.json')
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(err => console.error('메시지 로딩 실패:', err));
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case '배송완료': return '#10B981';
      case '배송중': return '#F59E0B';
      case '배송준비중': return '#3B82F6';
      case '배송지연': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <div style={{ display: 'flex', height: '100%', gap: 24 }}>
      {/* 왼쪽 */}
      <div style={{ flex: 7, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ height: 100, background: '#f4f4f4', borderRadius: 8, padding: 10 }}>
          <h3 style={{ margin: 0, color: '#888' }}>광고 삽입 구간</h3>
        </div>

        <div style={{ marginTop:300, background: '#ffffff', borderRadius: 4, overflow: 'hidden' }}>

          <div style={{  fontWeight:700,padding: '8px 16px' }}>최근 주문내역</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
  <tr style={{ background: '#5B89FF' }}>
    <th style={{ padding: 8, color: 'white' }}>NO</th>
    <th style={{ padding: 8, color: 'white' }}>주문ID</th>
    <th style={{ padding: 8, color: 'white' }}>날짜</th>
    <th style={{ padding: 8, color: 'white' }}>주문내역</th>
    <th style={{ padding: 8, color: 'white' }}>거래처</th>
    <th style={{ padding: 8, color: 'white' }}>배송상태</th>
    <th style={{ padding: 8, color: 'white' }}>가격</th>
    <th style={{ padding: 8, color: 'white' }}>기타</th>
  </tr>
</thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.id}>
                  <td style={{ padding: 8, textAlign: 'center' }}>{index + 1}</td>
                  <td style={{ padding: 8, textAlign: 'center' }}>{order.id}</td>
                  <td style={{ padding: 8, textAlign: 'center' }}>{order.date}</td>
                  <td style={{ padding: 8, textAlign: 'center' }}>{order.details}</td>
                  <td style={{ padding: 8, textAlign: 'center' }}>{order.client}</td>
                  <td style={{ padding: 8, textAlign: 'center', color: getStatusColor(order.status), fontWeight: 'bold' }}>{order.status}</td>
                  <td style={{ padding: 8, textAlign: 'center' }}>{order.price.toLocaleString()}원</td>
                  <td style={{ padding: 8, textAlign: 'center' }}>{order.etc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ alignSelf: 'flex-end', padding: '6px 12px', background: '#EFF6FF', outline: '1px solid #3B82F6', outlineOffset: '-1px', borderRadius: 4, cursor: 'pointer' }}>
          <div style={{ textAlign: 'center', color: '#2563EB', fontSize: 13, fontWeight: '500', fontFamily: 'Inter' }}>전체 주문보기 ▶</div>
        </div>


      </div>

      {/* 오른쪽 */}
      <div style={{ flex: 3, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ background: '#ffffff', border: '1px solid #ECECEC', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ background: '#F8F8F8', padding: '8px 16px', fontSize: 14, fontWeight: '600', fontFamily: 'Plus Jakarta Sans', color: '#2C2C2C', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>병원정보확인</span>
            <div style={{ background: '#5B89FF', borderRadius: 4, padding: '4px 8px' }}>
              <div style={{ color: 'white', fontSize: 10, fontWeight: 700 }}>Upgrade</div>
            </div>
          </div>
          <div style={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ color: '#696969', fontSize: 8, fontWeight: 500 }}>NAME</div>
                <div style={{ color: '#2C2C2C', fontSize: 14, fontWeight: 600 }}>{userInfo?.hospitalName || '병원명 없음'}</div>
              </div>
              <div>
                <div style={{ color: '#696969', fontSize: 8, fontWeight: 500 }}>담당자</div>
                <div style={{ color: '#2C2C2C', fontSize: 14, fontWeight: 600 }}>{userInfo?.name || '이름 없음'}</div>
              </div>
              <div>
                <div style={{ color: '#696969', fontSize: 8, fontWeight: 500 }}>마지막 접속일</div>
                <div style={{ color: '#2C2C2C', fontSize: 14, fontWeight: 600 }}>{userInfo?.lastLogin || '날짜 없음'}</div>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 500, color: '#2C2C2C' }}>서버 사용구간</div>
              <div style={{ position: 'relative', width: '100%', height: 18, background: '#EAEAEA', borderRadius: 4 }}>
                <div style={{ width: '5%', height: 18, background: '#5B89FF', borderTopLeftRadius: 4, borderBottomLeftRadius: 4, position: 'absolute' }} />
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: 'white', border: '0.80px #ECECEC solid', borderRadius: 8, overflow: 'hidden', height: 700, padding: 16, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ background: '#F8F8F8', padding: '8px 16px', fontSize: 14, fontWeight: '600', fontFamily: 'Plus Jakarta Sans', color: '#2C2C2C' }}>
            오늘의 메세지
          </div>
          {messages.map((msg, idx) => (
            <div key={idx}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ color: '#2C2C2C', fontSize: 12, fontFamily: 'Work Sans', fontWeight: '500' }}>{msg.title}</div>
                
              </div>
              {msg.note && (<div style={{ color: '#696969', fontSize: 10, marginTop: 2 }}>{msg.note}</div>)}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
              <Mail size={16} color="#2563EB" style={{ cursor: 'pointer' }} />
                <div style={{ color: '#696969', fontSize: 10 }}>{msg.sender}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;
