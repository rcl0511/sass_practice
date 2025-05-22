// src/components/VendorInvoice.jsx
import React, { useState } from 'react';

const VendorInvoice = () => {
  const [files,   setFiles]   = useState([]);
  const [results, setResults] = useState([]);

  const handleFileChange = e => {
    setFiles(Array.from(e.target.files));
    setResults([]);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert('업로드할 PDF 파일을 선택하세요!');
      return;
    }

    const formData = new FormData();
    files.forEach(f => formData.append('invoices', f));

    try {
      const res = await fetch('http://localhost:5000/api/upload-invoices', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`서버 오류 ${res.status}\n${errText}`);
      }

      const { files: uploaded } = await res.json();
      setResults(uploaded);

    } catch (err) {
      console.error('다중 업로드 실패:', err);
      alert(`업로드 중 오류 발생: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>다중 명세서 업로드 & 파싱</h2>

      <input
        type="file"
        accept=".pdf"
        multiple
        onChange={handleFileChange}
      />
      <button onClick={handleUpload} style={{ marginLeft: 12 }}>
        업로드 시작
      </button>

      {results.length > 0 && (
        <div style={{ marginTop: 24 }}>
          {results.map((r, i) => {
            // pdfUrl 예: "/exports/한진수정형외과_20250516.pdf"
            const filename = r.pdfUrl.split('/').pop();
            return (
              <div key={i} style={{ marginBottom: 32, border: '1px solid #ddd', padding: 16 }}>
                <h3>원본: {r.originalName}</h3>
                <p>
                  생성된 PDF:{' '}
                  <a
                    href={`http://localhost:5000${r.pdfUrl}`}
                    download={filename}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {filename}
                  </a>
                </p>
                <h4>파싱 결과:</h4>
                <pre style={{
                  whiteSpace: 'pre-wrap',
                  background: '#f9f9f9',
                  padding: '8px',
                  borderRadius: '4px',
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}>
                  {r.parsedText}
                </pre>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VendorInvoice;
