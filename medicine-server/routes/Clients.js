// routes/Clients.js
const express = require('express');
const router = express.Router();
const xlsx = require('xlsx');
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: path.join(__dirname, '../uploads/') });
const Client = require('../models/Client');

// 엑셀 헤더 → 필드 매핑
const fieldMapping = {
  '거래처구분': 'classification',
  '코드': 'code',
  '사업자원어명': 'nameOriginal',
  '대표자': 'representative',
  '사업자번호': 'businessNumber',
  '전화번호': 'phone',
};

// key 변환 함수 (vendorId는 기본값으로)
function convertKeys(row) {
  const newRow = {};
  for (const key in row) {
    if (fieldMapping[key]) {
      newRow[fieldMapping[key]] = row[key];
    }
  }
  newRow.vendorId = 'testVendorId';
  return newRow;
}

// 거래처 목록/검색/분류별 조회 (GET /api/vendors/clients)
router.get('/', async (req, res) => {
  try {
    const { q, classification } = req.query;
    let filter = { vendorId: 'testVendorId' };
    if (classification) filter.classification = classification;
    if (q) {
      filter['$or'] = [
        { nameOriginal: { $regex: q, $options: 'i' } },
        { code: { $regex: q, $options: 'i' } },
        { businessNumber: { $regex: q, $options: 'i' } },
      ];
    }
    
    const clients = await Client.find(filter).sort({ createdAt: -1 }).limit(200);
    
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: '조회 오류', detail: err.message });
  }
});



// 거래처 등록 (POST /api/vendors/clients)
router.post('/', async (req, res) => {
  try {
    const client = new Client({ ...req.body, vendorId: 'testVendorId' });
    await client.save();
    res.json(client);
  } catch (err) {
    res.status(400).json({ error: '저장 실패', detail: err.message });
  }
});

// 거래처 수정 (PATCH /api/vendors/clients/:id)
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findOneAndUpdate(
      { _id: id, vendorId: 'testVendorId' },
      req.body,
      { new: true }
    );
    if (!client) return res.status(404).json({ error: '거래처 없음' });
    res.json(client);
  } catch (err) {
    res.status(400).json({ error: '수정 실패', detail: err.message });
  }
});

// 거래처 삭제 (DELETE /api/vendors/clients/:id)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Client.deleteOne({ _id: id, vendorId: 'testVendorId' });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: '삭제 실패', detail: err.message });
  }
});

// 엑셀 업로드 (POST /api/vendors/clients/upload)
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);

    for (const row of rows) {
      const data = convertKeys(row);
      await Client.create(data);
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Clients.upload error:', err);
    res.status(500).json({ error: '엑셀 업로드 실패', detail: err.message });
  }
});

// 병원만 조회 (GET /api/vendors/clients/hospitals)
router.get('/hospitals', async (req, res) => {
  try {
    const { q } = req.query;
    let filter = { vendorId: 'testVendorId', classification: '병원' };
    if (q) {
      filter['$or'] = [
        { nameOriginal: { $regex: q, $options: 'i' } },
        { code: { $regex: q, $options: 'i' } }
      ];
    }
    const hospitals = await Client.find(filter).limit(100);
    res.json(hospitals);
  } catch (err) {
    res.status(500).json({ error: '병원 조회 오류', detail: err.message });
  }
});

module.exports = router;
