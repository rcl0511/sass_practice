// src/pages/VendorClientManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/VendorClientManagement.css';

// 1) 폼에 들어갈 모든 필드 정의
const clientFields = [
  { name: 'classification', label: '거래처구분', type: 'text' },
  { name: 'code',           label: '코드',      type: 'text' },
  { name: 'nameInternal',   label: '상호내부명', type: 'text' },
  { name: 'nameOriginal',   label: '사업자원어명', type: 'text' },
  { name: 'representative', label: '대표자',     type: 'text' },
  { name: 'dob',            label: '생년월일',   type: 'date' },
  { name: 'businessNumber', label: '사업자번호', type: 'text' },
  { name: 'phone',          label: '전화번호',   type: 'text' },
  { name: 'fax',            label: '팩스번호',   type: 'text' },
  { name: 'zip',            label: '우편번호',   type: 'text' },
  { name: 'address',        label: '사업장주소', type: 'text' },
  { name: 'salesRep',       label: '영업담당',   type: 'text' },
  { name: 'deptHead',       label: '부서장',     type: 'text' },
  { name: 'priceApply',     label: '단가적용처', type: 'text' },
  { name: 'stockApply',     label: '재고적용처', type: 'text' },
  { name: 'invoiceIssue',   label: '계산서발행', type: 'checkbox' },
  { name: 'businessType',   label: '업태',       type: 'text' },
  { name: 'item',           label: '종목',       type: 'text' },
  { name: 'clientType',     label: '거래처종류', type: 'text' },
  { name: 'clientGroup',    label: '거래처그룹', type: 'text' },
  { name: 'contractType',   label: '계약구분',   type: 'text' },
  { name: 'deliveryType',   label: '배송구분',   type: 'text' },
  { name: 'pharmacist',     label: '약사성함',   type: 'text' },
  { name: 'licenseNo',      label: '면허번호',   type: 'text' },
  { name: 'careNo',         label: '요양기관번호', type: 'text' },
  { name: 'narcoticsId',    label: '마약류취급자식별번호', type: 'text' },
  { name: 'deviceClient',   label: '의료기기거래처코드',   type: 'text' },
  { name: 'contact',        label: '거래처담당자', type: 'text' },
  { name: 'email',          label: '이메일',     type: 'text' },
  { name: 'invoiceManager', label: '계산서담당자', type: 'text' },
  { name: 'managerPhone',   label: '담당자핸드폰', type: 'text' },
  { name: 'creditLimit',    label: '여신한도',   type: 'number' },
  { name: 'maxTurnDays',    label: '최대회전일', type: 'number' },
  { name: 'monthlyEstimate',label: '월결재예상일', type: 'number' },
  { name: 'startDate',      label: '거래개시일', type: 'date' },
  { name: 'note1',          label: '비고1',      type: 'text' },
  { name: 'note2',          label: '비고2',      type: 'text' },
  { name: 'active',         label: '거래여부',   type: 'checkbox' },
  { name: 'eInvoice',       label: '전자거래명세서', type: 'checkbox' },
  { name: 'invoiceSystem',  label: '명세서전송시스템', type: 'text' },
  { name: 'externalExclude',label: '외부연동제외', type: 'checkbox' },
  { name: 'prePayment',     label: '선결제유무', type: 'checkbox' },
];

// 컴포넌트 시작
export default function VendorClientManagement() {
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState(
    clientFields.reduce((acc, f) => {
      acc[f.name] = f.type === 'checkbox' ? false : '';
      return acc;
    }, {})
  );
  const [showForm, setShowForm] = useState(false);

  // 엑셀 업로드를 위한 상태
  const [excelFile, setExcelFile] = useState(null);

  // 1) 최초 로딩
useEffect(() => {
  if (clients.length > 0) {
    console.log('실제 받은 clients[0]:', clients[0]);
  }
}, [clients]);

  // 거래처 목록 조회
const loadClients = async () => {
  try {
    const res = await axios.get('/api/vendors/clients');
    console.log("✅ 클라이언트 목록 조회 데이터:", res.data);
    setClients(Array.isArray(res.data) ? res.data : []);
  } catch (err) {
    console.error(err);
    alert('엑셀 업로드 실패: ' + (err?.response?.data?.error || err.message));
  }
};



  // 3) 엑셀 파일 선택 핸들러
  const handleFileChange = e => {
    setExcelFile(e.target.files[0]);
  };

  // 4) 엑셀 업로드 및 파싱 요청
  const handleUpload = async () => {
  if (!excelFile) {
    alert('파일을 선택해 주세요');
    return;
  }
  const formData = new FormData();
  formData.append('file', excelFile);
  try {
    await axios.post('/api/vendors/clients/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    alert('엑셀 업로드 성공');
    loadClients(); // 성공 후 즉시 목록 조회!
  } catch (err) {
    console.error(err);
    alert('엑셀 업로드 실패: ' + (err?.response?.data?.error || err.message));
  }
};
    


  // 5) 폼 입력 핸들러
  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setNewClient(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // 6) 신규 거래처 저장
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('/api/vendors/clients', newClient);
      await loadClients();
      setShowForm(false);
      // 폼 초기화
      setNewClient(
        clientFields.reduce((acc, f) => {
          acc[f.name] = f.type === 'checkbox' ? false : '';
          return acc;
        }, {})
      );
    } catch (err) {
      console.error(err);
      alert('거래처 추가 실패');
    }
  };

  return (
    <div className="client-mgmt-container">
      <h2>거래처 관리</h2>

      {/* 엑셀 업로드 UI */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
        />
        <button className="btn primary" onClick={handleUpload}>
          엑셀 업로드
        </button>
      </div>

      {/* 신규 거래처 추가 */}
      <button
        className="btn primary"
        onClick={() => setShowForm(true)}
      >
        신규 거래처 추가
      </button>

      {/* 거래처 테이블 */}
<table className="client-table">
  <thead>
    <tr>
      <th>코드</th>
      <th>사업자원어명</th>
      <th>대표자</th>
      <th>사업자번호</th>
      <th>사업장주소</th>
      <th>이메일</th>
    </tr>
  </thead>
  <tbody>
    {Array.isArray(clients) && clients.length > 0 ? (
      clients.map((c, index) => (
        <tr key={c.code || index}>
          <td>{c.code}</td>
          <td>{c.nameOriginal}</td>
          <td>{c.representative}</td>
          <td>{c.businessNumber}</td>
          <td>{c.address}</td>
          <td>{c.email}</td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="6" style={{ textAlign: 'center' }}>
          조회된 거래처가 없습니다.
        </td>
      </tr>
    )}
  </tbody>
</table>

      {/* 모달 폼 */}
      {showForm && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>신규 거래처 입력</h3>
            <form
              onSubmit={handleSubmit}
              className="client-form"
            >
              {clientFields.map(f => (
                <div className="form-group" key={f.name}>
                  <label>
                    {f.type === 'checkbox' && (
                      <input
                        type="checkbox"
                        name={f.name}
                        checked={newClient[f.name]}
                        onChange={handleChange}
                      />
                    )}
                    {f.label}
                  </label>
                  {f.type !== 'checkbox' && (
                    <input
                      type={f.type}
                      name={f.name}
                      value={newClient[f.name]}
                      onChange={handleChange}
                    />
                  )}
                </div>
              ))}
              <div style={{ marginTop: 16 }}>
                <button
                  type="submit"
                  className="btn primary"
                >
                  저장
                </button>
                <button
                  type="button"
                  className="btn secondary"
                  onClick={() => setShowForm(false)}
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
