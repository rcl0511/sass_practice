const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const Medicine = require('../models/Medicine'); // DB 스키마 경로

const router = express.Router();
const upload = multer({ dest: 'uploads/' });


router.post('/upload', upload.single('file'), (req, res, next) => {
  console.log('⚡ POST /api/medicines/upload 호출됨, req.file:', req.file);
  next();
}, async (req, res) => {
  try {
    // 워크북 읽기
    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    // JSON으로 변환
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    // 원하는 열만 매핑
    const medicines = jsonData.map(row => ({
      name: row['제품명'],           // ← 제품명
      code: row['코드'],             // ← 코드
      manufacturer: row['제조사'],   // ← 제조사
      price: row['금액'],            // ← 금액
      stock: row['재고'],            // ← 재고
      standardCode: row['표준코드']  // ← 표준코드
    }));

    // DB에 저장
    const result = await Medicine.insertMany(medicines);
    res.status(200).json({ message: '엑셀 업로드 및 저장 성공', count: result.length });
  } catch (err) {
    console.error('❌ POST /upload 에러:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
