// src/components/VendorStocks.jsx
import React, { useEffect, useState } from 'react';

const VendorStocks = () => {
  const [medicines, setMedicines] = useState([]);
  const [file, setFile] = useState(null);

  // 의약품 리스트 조회 함수
  const fetchMedicines = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/medicines');
      if (!res.ok) throw new Error('데이터 조회 실패');
      const data = await res.json();
      setMedicines(data);
    } catch (e) {
      console.error(e);
      alert(e.message);
    }
  };

  // 컴포넌트 마운트 시 조회
  useEffect(() => {
    fetchMedicines();
  }, []);

  // 파일 선택 핸들러
  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // 업로드 핸들러
  const onUpload = async () => {
    if (!file) return alert('엑셀 파일을 선택하세요.');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('업로드 실패');
      alert('업로드 성공!');
      fetchMedicines();
    } catch (e) {
      console.error(e);
      alert(e.message);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>재고관리</h2>

      <div style={{ marginBottom: 16 }}>
        <input type="file" accept=".xlsx,.xls" onChange={onFileChange} />
        <button onClick={onUpload} style={{ marginLeft: 8 }}>업로드</button>
      </div>

      <table border="1" style={{ width: '100%', textAlign: 'center' }}>
        <thead>
          <tr>
            <th>제품명</th><th>코드</th><th>제조사</th>
            <th>기준가</th><th>재고수량</th><th>표준코드</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map((m, i) => (
            <tr key={i}>
              <td>{m.name}</td>
              <td>{m.code}</td>
              <td>{m.manufacturer}</td>
              <td>{m.basePrice?.toLocaleString()}</td>
              <td>{m.stockQty}</td>
              <td>{m.standardCode}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VendorStocks;
