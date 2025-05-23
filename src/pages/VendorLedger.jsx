// src/pages/VendorLedger.jsx
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import '../css/VendorLedger.css';

const VendorLedger = () => {
  const [hospitals, setHospitals] = useState([]);
  const [query, setQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [fromDate, setFromDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [toDate, setToDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(false);

  // 병원명/코드로 서버 검색
  useEffect(() => {
    if (!query.trim()) {
      setHospitals([]);
      return;
    }
    fetch(`/api/vendors/clients?q=${encodeURIComponent(query)}`)

      .then(res => res.json())
      .then(setHospitals)
      .catch(console.error);
  }, [query]);

  // 거래내역 조회
  const fetchLedger = () => {
    if (!selected) {
      alert('병원을 선택해 주세요');
      return;
    }
    setLoading(true);
    fetch(
      `/api/vendors/ledger?hospitalId=${selected._id || selected.id}` +
      `&from=${fromDate}&to=${toDate}`
    )
      .then(res => res.json())
      .then(setLedger)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  // 거래요청서 보내기
  const sendRequest = () => {
    if (!selected) {
      alert('병원을 선택해 주세요');
      return;
    }
    fetch('/api/vendors/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hospitalId: selected._id || selected.id,
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

  return (
    <div className="container">
      <h2 className="title">병원 거래조회 (Vendor)</h2>

      <div className="controls">
        {/* 병원 검색 드롭다운 */}
        <div className="dropdown">
          <input
            type="text"
            placeholder="병원명 또는 코드 검색"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setDropdownOpen(true);
            }}
            onFocus={() => setDropdownOpen(true)}
            onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
            className="dropdownInput"
            autoComplete="off"
          />
          {dropdownOpen && (
            <ul className="dropdownList">
              {hospitals.length > 0 ? (
                hospitals.slice(0, 100).map(h => (
                  <li
                    key={h._id || h.id}
                    onClick={() => {
                      setSelected(h);
                      setQuery(h.nameOriginal); // nameOriginal로!
                      setDropdownOpen(false);
                    }}
                    className="dropdownItem"
                  >
                    {h.nameOriginal} ({h.code})
                  </li>
                ))
              ) : (
                <li className="dropdownItem">검색 결과 없음</li>
              )}
            </ul>
          )}
        </div>

        {/* 기간 선택 */}
        <div className="dateRange">
          <label>기간:</label>
          <input
            type="date"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
          />
          <span>~</span>
          <input
            type="date"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
          />
        </div>

        <button onClick={fetchLedger} className="btn primary">
          조회
        </button>
        <button onClick={sendRequest} className="btn secondary">
          거래요청서 보내기
        </button>
      </div>

      {loading && <p className="loading">로딩 중...</p>}

      {!loading && ledger.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th className="thTd">날짜</th>
              <th className="thTd">주문번호</th>
              <th className="thTd">수량</th>
              <th className="thTd">단가</th>
              <th className="thTd">금액</th>
              <th className="thTd">비고</th>
            </tr>
          </thead>
          <tbody>
            {ledger.map((row, idx) => (
              <tr key={idx}>
                <td className="thTd">{row.date}</td>
                <td className="thTd">{row.orderId}</td>
                <td className="thTd">{row.qty}</td>
                <td className="thTd">{row.unitPrice}</td>
                <td className="thTd">{row.amount}</td>
                <td className="thTd">{row.remarks || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && selected && ledger.length === 0 && (
        <p className="noData">해당 기간에 거래 내역이 없습니다.</p>
      )}
    </div>
  );
};

export default VendorLedger;
