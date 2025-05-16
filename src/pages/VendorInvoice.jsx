import React, { useState } from 'react';

const InvoiceUpload = () => {
  const [file, setFile] = useState(null);
  const [hospitalName, setHospitalName] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');

  const handleUpload = async () => {
    if (!file) {
      alert('PDF 파일을 선택하세요!');
      return;
    }

    const formData = new FormData();
    formData.append('invoice', file);

    try {
      const res = await fetch('http://localhost:5000/api/upload-invoice', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`서버 응답 오류: ${res.status}\n${errorText}`);
      }

      const data = await res.json();
      setHospitalName(data.hospitalName);
      setPdfUrl(data.pdfUrl);
    } catch (err) {
      console.error('❌ 업로드 실패:', err);
      alert(`업로드 중 오류 발생: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>명세서 업로드</h2>
      <input type="file" accept=".pdf" onChange={e => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>업로드</button>

      {hospitalName && <p>🏥 병원명: <strong>{hospitalName}</strong></p>}
      {pdfUrl && (
        <p>
          📄 생성된 PDF: <a href={`http://localhost:5000${pdfUrl}`} target="_blank" rel="noreferrer">다운로드</a>
        </p>
      )}
    </div>
  );
};

export default InvoiceUpload;
