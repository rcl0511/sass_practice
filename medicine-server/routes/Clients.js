// src/routes/Clients.js

const express = require('express');
const router = express.Router();
const xlsx = require('xlsx');
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: path.join(__dirname, '../uploads/') });
const Hospital = require('../models/HospitalClient');

// ✅ 사용 필드만 매핑
const fieldMapping = {
  '거래처구분': 'classification',
  '코드': 'code',
  '사업자원어명': 'nameOriginal',
  '대표자': 'representative',
  '사업자번호': 'businessNumber',
  '전화번호': 'phone',
};

// 키 변환 함수
function convertKeys(row, vendorId) {
  const newRow = {};
  for (const key in row) {
    if (fieldMapping[key]) {
      newRow[fieldMapping[key]] = row[key];
    }
  }
  if (vendorId) newRow.vendorId = vendorId;
  return newRow;
}

// 거래처 목록 조회 (GET /api/vendors/clients)
router.get('/', async (req, res) => {
  try {
    const hospitals = await Hospital.find({});
    res.json(hospitals);
  } catch (err) {
    res.status(500).json({ error: '조회 실패', detail: err.message });
  }
});

// 파일 업로드 (POST /api/vendors/clients/upload)
router.post(
  '/upload',
  // requireLogin, // 필요 시 주석 해제
  upload.single('file'),
  async (req, res) => {
    try {
      const workbook = xlsx.readFile(req.file.path);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = xlsx.utils.sheet_to_json(sheet);

      const convertedRows = rows.map(row => convertKeys(row));
      await Hospital.insertMany(convertedRows);
      res.json({ success: true });
    } catch (err) {
      console.error('Clients.upload error:', err);
      res.status(500).json({ error: '파싱 실패', detail: err.message });
    }
  }
);

module.exports = router;
