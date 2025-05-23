// routes/Medicines.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');

const Medicine = require('../models/Medicine');  // ← 이거 맞게 가져와줘

// 엑셀 업로드용 multer 설정
const upload = multer({ dest: path.join(__dirname, '../uploads/') });

// 1. 전체 의약품 목록 조회
router.get('/', async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ error: 'DB 조회 실패' });
  }
});

// 2. 엑셀 업로드(파싱해서 DB에 저장)
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);

    // 한 번에 모두 지우고 다시 저장 (원하면 바꿀 수 있음)
    await Medicine.deleteMany({});
    await Medicine.insertMany(rows);

    res.json({ success: true, count: rows.length });
  } catch (err) {
    res.status(500).json({ error: '엑셀 파싱/저장 실패', detail: err.message });
  }
});

module.exports = router;
