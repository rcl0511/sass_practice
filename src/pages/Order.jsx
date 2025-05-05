// src/pages/Order.jsx
import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, X } from 'lucide-react';

const Order = () => {
  const [query, setQuery] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);

  // 재고 데이터 로드
  const fetchMedicines = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/api/medicines');
      if (!res.ok) throw new Error('데이터 조회 실패');
      const data = await res.json();
      setMedicines(data);
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  // 검색 필터링
  const filtered = medicines.filter((m) => {
    const q = query.trim().toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      String(m.code).includes(q)
    );
  });

  // 장바구니 추가
  const addToCart = (medicine, qty) => {
    if (qty < 1) return;
    setCart((prev) => {
      const idx = prev.findIndex((item) => item.code === medicine.code);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx].qty += qty;
        return updated;
      }
      return [...prev, { ...medicine, qty }];
    });
  };

  // 장바구니 항목 제거
  const removeFromCart = (code) => {
    setCart((prev) => prev.filter((item) => item.code !== code));
  };

  // 주문 요청 (확인창 추가)
  const handleOrder = async () => {
    if (cart.length === 0) {
      alert('장바구니에 담긴 상품이 없습니다.');
      return;
    }
    if (!window.confirm('선택하신 상품을 정말 주문하시겠습니까?')) {
      return;
    }
    try {
      const user = JSON.parse(localStorage.getItem('userInfo')) || {};
      const body = {
        hospitalName: user.name || '익명 병원',
        items: cart.map(({ code, name, qty }) => ({ code, name, qty })),
      };
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('주문 등록에 실패했습니다.');
      alert('주문이 정상적으로 등록되었습니다!');
      setCart([]);
    } catch (e) {
      console.error(e);
      alert(e.message);
    }
  };

  return (
    <div style={{ padding: 24, fontFamily: 'Inter, sans-serif' }}>
      <h2 style={{ marginBottom: 16 }}>주문 페이지</h2>

      {/* 검색창 */}
      <div style={{ position: 'relative', marginBottom: 24, maxWidth: 600 }}>
        <input
          type="text"
          placeholder="약품 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: '100%',
            height: 40,
            padding: '0 40px 0 12px',
            borderRadius: 8,
            border: '1px solid #ccc',
            fontSize: 14,
          }}
        />
        <Search
          size={20}
          onClick={fetchMedicines}
          style={{
            position: 'absolute',
            right: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            cursor: 'pointer',
            color: '#888',
          }}
        />
      </div>

      {loading && <p>데이터를 불러오는 중...</p>}
      {error && <p style={{ color: 'red' }}>에러: {error}</p>}

      {/* 메인 영역: 재고 목록 + 장바구니 */}
      {!loading && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>

          {/* 의약품 목록 테이블 */}
          <div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  {['No', '제품명', '코드', '재고', '단가', '표준코드', '수량', '추가'].map((th, i) => (
                    <th
                      key={i}
                      style={{ padding: 8, border: '1px solid #ddd', textAlign: 'left' }}
                    >
                      {th}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((m, idx) => (
                  <tr key={`${m.code}-${idx}`}>
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>{m.no}</td>
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>{m.name}</td>
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>{m.code}</td>
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>{m.stockQty}</td>
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>{m.unitPrice?.toLocaleString()}</td>
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>{m.standardCode}</td>
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>
                      <input
                        type="number"
                        min={1}
                        defaultValue={1}
                        id={`qty-${m.code}`}
                        style={{ width: 60, padding: 4, borderRadius: 4, border: '1px solid #ccc' }}
                      />
                    </td>
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>
                      <button
                        onClick={() => {
                          const val = parseInt(document.getElementById(`qty-${m.code}`).value, 10);
                          addToCart(m, val);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          background: '#475BE8',
                          color: '#fff',
                          padding: '6px 12px',
                          border: 'none',
                          borderRadius: 4,
                          cursor: 'pointer',
                        }}
                      >
                        <ShoppingCart size={16} style={{ marginRight: 4 }} />
                        추가
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 장바구니 패널 테이블 */}
          <div
            style={{
              border: '1px solid #ddd',
              borderRadius: 8,
              padding: 16,
              background: '#fafafa',
            }}
          >
            <h3 style={{ marginTop: 0 }}>🛒 장바구니</h3>
            {cart.length === 0 ? (
              <p>장바구니가 비어 있습니다.</p>
            ) : (
              <>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['제품명', '수량', '삭제'].map((th, i) => (
                        <th
                          key={i}
                          style={{
                            padding: 8,
                            border: '1px solid #ddd',
                            textAlign: 'left',
                            background: '#f5f5f5',
                          }}
                        >
                          {th}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item, idx) => (
                      <tr key={`${item.code}-${idx}`}>
                        <td style={{ padding: 8, border: '1px solid #ddd' }}>{item.name}</td>
                        <td style={{ padding: 8, border: '1px solid #ddd' }}>{item.qty}</td>
                        <td style={{ padding: 8, border: '1px solid #ddd' }}>
                          <button
                            onClick={() => removeFromCart(item.code)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              color: '#e00',
                            }}
                          >
                            <X size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  onClick={handleOrder}
                  style={{
                    marginTop: 16,
                    width: '100%',
                    padding: '8px 0',
                    background: '#10b981',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                  }}
                >
                  주문하기
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;