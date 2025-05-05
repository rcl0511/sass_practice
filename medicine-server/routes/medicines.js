// routes/medicines.js
const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const Medicine = require('../models/Medicine');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// 엑셀 행(row)을 DB 스키마에 맞춰 매핑하는 함수
function mapRow(row) {
  const toNum = v => typeof v === 'string'
    ? parseFloat(v.replace(/,/g, ''))
    : v || 0;

  return {
    no:               parseInt(row['No'], 10),
    supplier:         row['입고처'],
    manufacturer:     row['제조사'],
    code:             row['코드'],
    name:             row['제품명'],
    spec:             row['규격'],
    basePrice:        toNum(row['기준가']),
    location:         row['재고위치'],
    prevStock:        toNum(row['전일재고']),
    prevAmount:       toNum(row['전일금액']),
    inQty:            toNum(row['입고수량']),
    inAmount:         toNum(row['입고금액']),
    outQty:           toNum(row['출고수량']),
    outAmount:        toNum(row['출고금액']),
    stockQty:         toNum(row['재고수량']),
    purchasedQty:     toNum(row['매입처집계수량']),
    unitPrice:        toNum(row['단가']),
    basePricePercent: toNum(row['기준가%']),
    stockAmount:      toNum(row['재고금액']),
    basePriceCode:    row['기준가코드'],
    remarks:          row['비고'],
    standardCode:     row['표준코드'],
    productLocation:  row['제품위치']
  };
}

// POST /api/medicines/upload — 엑셀 파일 업로드 및 저장
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const wb    = xlsx.readFile(req.file.path);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const raw   = xlsx.utils.sheet_to_json(sheet, { defval: '' });

    // No 값이 숫자로 파싱되는 행만 필터링하여 요약 행(합계 등) 제거
    const filtered = raw.filter(row => !isNaN(parseInt(row['No'], 10)));

    const docs = filtered.map(mapRow);
    await Medicine.insertMany(docs);

    res.json({ message: '엑셀 업로드 및 저장 성공', count: docs.length });
  } catch (err) {
    console.error('❌ POST /api/medicines/upload 에러:', err);
    res.status(500).json({
      error:  '파일 처리 실패',
      detail: err.message,
      stack:  err.stack
    });
  }
});

// GET /api/medicines — 전체 조회 또는 ?name=검색어
router.get('/', async (req, res) => {
  try {
    const { name } = req.query;
    const filter = name ? { name: new RegExp(name, 'i') } : {};
    const list = await Medicine.find(filter).lean();
    res.json(list);
  } catch (err) {
    console.error('❌ GET /api/medicines 에러:', err);
    res.status(500).json({ error: '조회 실패', detail: err.message });
  }
});

module.exports = router;
