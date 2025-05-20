// src/pages/vendor/VendorLedger.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';

const VendorLedger = () => {
  const [hospitals, setHospitals] = useState([]);       // 전체 병원 리스트
  const [query, setQuery] = useState('');               // 검색어
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selected, setSelected] = useState(null);       // 선택된 병원
  const [fromDate, setFromDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [toDate, setToDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [ledger, setLedger] = useState([]);             // 거래장부 데이터
  const [loading, setLoading] = useState(false);

  // 1) 마운트 시 Vendor가 거래하는 병원 리스트를 API로 불러옴
  useEffect(() => {
    fetch('/api/vendors/hospitals')
      .then(res => res.json())
      .then(data => setHospitals(data))
      .catch(console.error);
  }, []);

  // 2) 검색어에 따라 필터링 (useMemo로 최적화)
  const filtered = useMemo(() => {
    if (!query) return hospitals;
    const lower = query.toLowerCase();
    return hospitals.filter(h =>
      h.name.toLowerCase().includes(lower) ||
      (h.code && h.code.toLowerCase().includes(lower))
    );
  }, [hospitals, query]);

  // 3) 조회 버튼 클릭
  const fetchLedger = () => {
    if (!selected) {
      alert('병원을 선택해 주세요');
      return;
    }
    setLoading(true);
    fetch(`/api/vendors/ledger?hospitalId=${selected.id}&from=${fromDate}&to=${toDate}`)
      .then(res => res.json())
      .then(data => setLedger(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  // 4) 거래요청서 보내기
  const sendRequest = () => {
    if (!selected) {
      alert('병원을 선택해 주세요');
      return;
    }
    fetch('/api/vendors/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hospitalId: selected.id,
        from: fromDate,
        to: toDate
      })
    })
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        alert('거래요청서가 발송되었습니다.');
      })
      .catch(err => {
        console.error(err);
        alert('발송 중 오류가 발생했습니다.');
      });
  };

  // ==== 인라인 스타일 정의 ====
  const styles = {
    container: {
      maxWidth: '960px',
      margin: '0 auto',
      fontFamily: 'Inter, sans-serif',
    },
    controls: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '12px',
      alignItems: 'center',
      marginBottom: '20px',
    },
    dropdown: {
      position: 'relative',
      width: '240px',
    },
    dropdownInput: {
      width: '100%',
      padding: '8px',
      border: '1px solid #ccc',
      borderRadius: '4px',
    },
    dropdownList: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      maxHeight: '200px',
      overflowY: 'auto',
      background: '#fff',
      border: '1px solid #ccc',
      zIndex: 10,
    },
    dropdownItem: {
      padding: '8px',
      cursor: 'pointer',
    },
    dropdownItemHover: {
      background: '#f0f0f0',
    },
    btn: {
      padding: '8px 16px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    primary: {
      background: '#475be8',
      color: '#fff',
    },
    secondary: {
      background: '#6b7280',
      color: '#fff',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    thTd: {
      padding: '8px',
      border: '1px solid #ddd',
      textAlign: 'center',
    },
  };

  return (
    <div style={styles.container}>
      <h2>병원 거래조회 (Vendor)</h2>

      <div style={styles.controls}>
        {/* 병원 검색 드롭다운 */}
        <div style={styles.dropdown}>
          <input
            type="text"
            placeholder="병원명 또는 코드 검색"
            value={query}
            onChange={e => { setQuery(e.target.value); setDropdownOpen(true); }}
            onFocus={() => setDropdownOpen(true)}
            onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
            style={styles.dropdownInput}
          />
          {dropdownOpen && (
            <ul style={styles.dropdownList}>
              {filtered.slice(0, 100).map(h => (
                <li
                  key={h.id}
                  onClick={() => {
                    setSelected(h);
                    setQuery(h.name);
                    setDropdownOpen(false);
                  }}
                  style={styles.dropdownItem}
                  onMouseOver={e => e.currentTarget.style.background = '#f0f0f0'}
                  onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                >
                  {h.name} ({h.code})
                </li>
              ))}
              {filtered.length === 0 && (
                <li style={styles.dropdownItem}>검색 결과 없음</li>
              )}
            </ul>
          )}
        </div>

        {/* 기간 선택 */}
        <label>
          기간:
          <input
            type="date"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
          />
          ~
          <input
            type="date"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
          />
        </label>

        <button
          onClick={fetchLedger}
          style={{ ...styles.btn, ...styles.primary }}
        >
          조회
        </button>
        <button
          onClick={sendRequest}
          style={{ ...styles.btn, ...styles.secondary }}
        >
          거래요청서 보내기
        </button>
      </div>

      {loading && <p>로딩 중...</p>}

      {/* 거래장부 테이블 */}
      {!loading && ledger.length > 0 && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.thTd}>날짜</th>
              <th style={styles.thTd}>주문번호</th>
              <th style={styles.thTd}>수량</th>
              <th style={styles.thTd}>단가</th>
              <th style={styles.thTd}>금액</th>
              <th style={styles.thTd}>비고</th>
            </tr>
          </thead>
          <tbody>
            {ledger.map((row, idx) => (
              <tr key={idx}>
                <td style={styles.thTd}>{row.date}</td>
                <td style={styles.thTd}>{row.orderId}</td>
                <td style={styles.thTd}>{row.qty}</td>
                <td style={styles.thTd}>{row.unitPrice}</td>
                <td style={styles.thTd}>{row.amount}</td>
                <td style={styles.thTd}>{row.remarks || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 결과 없을 때 */}
      {!loading && selected && ledger.length === 0 && (
        <p>해당 기간에 거래 내역이 없습니다.</p>
      )}
    </div>
  );
};

export default VendorLedger;
