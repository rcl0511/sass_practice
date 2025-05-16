console.log('✅ invoiceRouter.js 로딩됨');

const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const PdfReader = require('pdfreader').PdfReader;
const { generateInvoiceHtml } = require('../templates/invoiceTemplate');
const { htmlToPdf } = require('../utils/htmlToPdf');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload-invoice', upload.single('invoice'), async (req, res) => {
  const filePath = req.file.path;
  const rows = {};

  try {
    // 1. PDF 텍스트 파싱
    await new Promise((resolve, reject) => {
      new PdfReader().parseFileItems(filePath, (err, item) => {
        if (err) return reject(err);
        if (!item) return resolve(); // 끝
        if (item.text) {
          const y = Math.round(item.y * 10) / 10;
          const row = rows[y] || [];
          row.push(item.text);
          rows[y] = row;
        }
      });
    });

    // 2. 줄 조립
    const lines = Object.keys(rows)
      .sort((a, b) => parseFloat(a) - parseFloat(b))
      .map(y => rows[y].join(' ').trim())
      .filter(line => line && line !== '☆☆☆ 이하여백 ☆☆☆');

    // 3. 병원명 추출
    const hospitalLine = lines.find(l => l.includes('병원') || l.includes('의원'));
    const hospitalName = hospitalLine || '병원명 없음';

    // 4. 제품 블록 추출 (8줄 단위)
    const items = [];
    for (let i = 0; i < lines.length - 7; i++) {
      const block = lines.slice(i, i + 8);
      const [unitPrice, standardCode, qty, expireDate, productCode, manufacturer, name, total] = block;

      if (
        /^\d{1,3}(,\d{3})*$/.test(unitPrice) &&
        /^\d{6,}$/.test(standardCode) &&
        /^\d+$/.test(qty) &&
        /^\d{8}$/.test(expireDate) &&
        /^[A-Z]{3}\d+/.test(productCode) &&
        name.length > 2 &&
        /^\d{1,3}(,\d{3})*$/.test(total)
      ) {
        items.push({ name, qty, unitPrice, total });
        i += 7; // 다음 제품 블록으로 건너뛰기
      }
    }

    // 5. HTML → PDF 변환
    const html = generateInvoiceHtml(hospitalName, items);
    const filename = `${Date.now()}_invoice.pdf`;
    const exportsDir = path.join(__dirname, '../exports');
    if (!fs.existsSync(exportsDir)) fs.mkdirSync(exportsDir);
    const pdfPath = path.join(exportsDir, filename);
    await htmlToPdf(html, pdfPath);

    // 6. 응답
    res.json({
      message: '성공',
      hospitalName,
      items,
      pdfUrl: `/exports/${filename}`
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'PDF 파싱 실패', detail: err.message });
  }
});

module.exports = router;