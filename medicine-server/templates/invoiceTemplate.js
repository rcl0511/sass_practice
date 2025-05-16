// templates/invoiceTemplate.js
function generateInvoiceHtml(hospitalName, items) {
    const rows = items.map(item => `
      <tr>
        <td>${item.name}</td><td>${item.qty}</td><td>${item.unitPrice}</td><td>${item.total}</td>
      </tr>`).join('');
  
    return `
    <html>
      <head>
        <style>
          body { font-family: 'Arial'; padding: 30px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #333; padding: 6px; text-align: center; }
          .section { margin-bottom: 50px; }
          .title { font-weight: bold; font-size: 20px; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <div class="section">
          <div class="title">거래명세서 (병원용)</div>
          <p>🏥 병원명: ${hospitalName}</p>
          <table>
            <thead><tr><th>제품명</th><th>수량</th><th>단가</th><th>금액</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
  
        <hr style="margin: 40px 0; border-top: 2px dashed #000;" />
  
        <div class="section">
          <div class="title">거래명세서 (업체보관용)</div>
          <p>🏥 병원명: ${hospitalName}</p>
          <table>
            <thead><tr><th>제품명</th><th>수량</th><th>단가</th><th>금액</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
          <p style="margin-top: 20px;">서명란: _____________________________</p>
        </div>
      </body>
    </html>`;
  }
  
  module.exports = { generateInvoiceHtml };
  