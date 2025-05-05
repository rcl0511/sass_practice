// src/pages/VendorOrdersManagement.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const VendorOrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 주문 목록 로드
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/api/orders');
      if (!res.ok) throw new Error('주문 목록 조회 실패');
      const data = await res.json();
      setOrders(data);
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 주문 수락 처리: status 변경 후 명세서 발행 페이지 이동
  const handleAccept = async (order) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${order._id}/accept`, {
        method: 'PATCH',
      });
      if (!res.ok) throw new Error('주문 수락에 실패했습니다.');
      await fetchOrders();  // 리스트 갱신
      navigate('/vendor/invoice', { state: { order } });
    } catch (e) {
      console.error(e);
      alert(e.message);
    }
  };

  // 대기 중인 주문만 표시
  const pendingOrders = orders.filter(o => o.status === 'PENDING');

  return (
    <div style={{ padding: 24, fontFamily: 'Inter, sans-serif' }}>
      <h2 style={{ marginBottom: 16 }}>주문 관리 (Vendor View)</h2>

      {loading && <p>주문 목록을 불러오는 중...</p>}
      {error && <p style={{ color: 'red' }}>에러: {error}</p>}

      {!loading && !error && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              {['주문번호','병원명','제품명','수량','주문일','상태','동작'].map((th, idx) => (
                <th key={idx} style={{ padding: 8, border: '1px solid #ddd', textAlign: 'left' }}>{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pendingOrders.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: 8, textAlign: 'center' }}>
                  수락 대기 중인 주문이 없습니다.
                </td>
              </tr>
            ) : (
              pendingOrders.map(order => (
                order.items.map((item, i) => (
                  <tr key={`${order._id}-${item.code}-${i}`}>  
                    {i === 0 && (
                      <td rowSpan={order.items.length} style={{ padding: 8, border: '1px solid #ddd' }}>
                        {order._id.slice(-6)}
                      </td>
                    )}
                    {i === 0 && (
                      <td rowSpan={order.items.length} style={{ padding: 8, border: '1px solid #ddd' }}>
                        {order.hospitalName}
                      </td>
                    )}
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>{item.name}</td>
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>{item.qty}</td>
                    {i === 0 && (
                      <td rowSpan={order.items.length} style={{ padding: 8, border: '1px solid #ddd' }}>
                        {new Date(order.createdAt).toLocaleString()}
                      </td>
                    )}
                    {i === 0 && (
                      <td rowSpan={order.items.length} style={{ padding: 8, border: '1px solid #ddd' }}>
                        {order.status}
                      </td>
                    )}
                    {i === 0 && (
                      <td rowSpan={order.items.length} style={{ padding: 8, border: '1px solid #ddd' }}>
                        <button
                          onClick={() => handleAccept(order)}
                          style={{
                            background: '#475BE8',
                            color: '#fff',
                            padding: '6px 12px',
                            border: 'none',
                            borderRadius: 4,
                            cursor: 'pointer'
                          }}
                        >수락</button>
                      </td>
                    )}
                  </tr>
                ))
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default VendorOrdersManagement;
