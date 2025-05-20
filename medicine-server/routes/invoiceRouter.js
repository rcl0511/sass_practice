// routes/invoiceRouter.js
console.log('✅ invoiceRouter.js 로딩됨');

const express       = require('express');
const multer        = require('multer');
const fs            = require('fs');
const path          = require('path');
const { PdfReader } = require('pdfreader');
const Tabula        = require('tabula-js');
const csvParse      = require('csv-parse/lib/sync');
const { generateInvoiceHtml } = require('../templates/invoiceTemplate');
const { htmlToPdf }           = require('../utils/htmlToPdf');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload-invoice', upload.single('invoice'), async (req, res) => {
  try {
    const filePath = req.file.path;

    // ─────────────────────────────────────────────────────────────────────────────
    // 1) Header OCR (PdfReader 로 상단 5줄만 추출해서 정규식으로 메타 뽑기)
    // ─────────────────────────────────────────────────────────────────────────────
    const headerRaw = [];
    await new Promise((resolve, reject) => {
      new PdfReader().parseFileItems(filePath, (err, item) => {
        if (err) return reject(err);
        if (!item) return resolve();
        // 상단 5줄만
        if (item.text && headerRaw.length < 5) {
          headerRaw.push(item.text);
        }
      });
    });
    const headerText = headerRaw.join(' ');
    // 정규식: 한글·영문 병원명, 주소, 날짜
    const issuerMatch  = headerText.match(/([\p{L}\s]+?(?:병원|의원|의료원|Clinic|Hospital))/iu);
    const addressMatch = headerText.match(/주소[:\s]*([\p{L}0-9,\-\s]+)/iu);
    const dateMatch    = headerText.match(/(\d{4}\.\d{2}\.\d{2})/);
    const metadata = {
      issuer:  issuerMatch  ? issuerMatch[1].trim() : '병원명 없음',
      address: addressMatch ? addressMatch[1].trim() : '',
      date:    dateMatch    ? dateMatch[1]           : ''
    };

    // ─────────────────────────────────────────────────────────────────────────────
    // 2) Tabula → CSV → 파싱 (격자 모드로 표 감지 정확도 높임)
    // ─────────────────────────────────────────────────────────────────────────────
    const tabulaCsv = await Tabula(filePath, {
      pages:   'all',      // 전체 페이지
      lattice: true,       // 셀 경계 모드
      guess:   false       // 자동 추측 끄기
    }).extractCsv();

    // CSV → 2D 배열
    const rows = csvParse(tabulaCsv, { trim: true });
    if (rows.length < 2) {
      // 표가 하나도 없으면 빈 배열 처리
      throw new Error('표를 감지하지 못했습니다.');
    }
    // 첫 줄 헤더, 나머지 제품 데이터
    const items = rows.slice(1).map(cols => ({
      name:         cols[0] || '',
      spec:         cols[1] || '',
      manufacturer: cols[2] || '',
      qty:          cols[3] || '',
      unit_price:   cols[4] || '',
      total:        cols[5] || ''
    }));

    // ─────────────────────────────────────────────────────────────────────────────
    // 3) HTML → PDF 변환 & 저장
    // ─────────────────────────────────────────────────────────────────────────────
    const html     = generateInvoiceHtml(metadata, items);
    const filename = `${Date.now()}_invoice.pdf`;
    const exportsDir = path.join(__dirname, '../exports');
    if (!fs.existsSync(exportsDir)) fs.mkdirSync(exportsDir);

    const pdfPath = path.join(exportsDir, filename);
    await htmlToPdf(html, pdfPath);

    // ─────────────────────────────────────────────────────────────────────────────
    // 4) 응답
    // ─────────────────────────────────────────────────────────────────────────────
    return res.json({
      message:  '성공',
      metadata,
      items,
      pdfUrl:   `/exports/${filename}`
    });
  } catch (err) {
    console.error('🚨 invoiceRouter 오류:', err);
    return res.status(500).json({ error: '처리 실패', detail: err.message });
  }
});

module.exports = router;
