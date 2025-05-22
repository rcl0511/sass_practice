// routes/Vendor.js
const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const Hospital = require('../models/HospitalClient'); // 병원 모델명에 맞게 수정!
const { requireLogin } = require('../middleware/auth'); // JWT 로그인 미들웨어 가정

const clientsRouter = require('./routes/Clients');
app.use('/api/vendors/clients', clientsRouter);

// 거래처 목록 (검색/필터)
router.get('/', requireLogin, async (req, res) => {
  try {
    const { q } = req.query;
    const vendorId = req.user._id;
    const filter = { vendorId };
    if (q) {
      filter['$or'] = [
        { nameOriginal: { $regex: q, $options: 'i' } },
        { code: { $regex: q, $options: 'i' } },
        { businessNumber: { $regex: q, $options: 'i' } },
      ];
    }
    const clients = await Client.find(filter).sort({ createdAt: -1 });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: '조회 오류' });
  }
});


// 거래처 등록
router.post('/', requireLogin, async (req, res) => {
  try {
    const client = new Client({ ...req.body, vendorId: req.user._id });
    await client.save();
    res.json(client);
  } catch (err) {
    res.status(400).json({ error: '저장 실패' });
  }
});

// 거래처 수정 (by _id)
router.patch('/:id', requireLogin, async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findOneAndUpdate(
      { _id: id, vendorId: req.user._id },
      req.body,
      { new: true }
    );
    if (!client) return res.status(404).json({ error: '거래처 없음' });
    res.json(client);
  } catch (err) {
    res.status(400).json({ error: '수정 실패' });
  }
});
// 병원 리스트(검색, 최대 100개)
router.get('/hospitals', /* requireLogin, */ async (req, res) => {
  try {
    const q = req.query.q || '';
    let filter = {};
    if (q) {
      filter = {
        $or: [
          { nameOriginal: { $regex: q, $options: 'i' } }, // ← nameOriginal
          { code: { $regex: q, $options: 'i' } }
        ]
      };
    }
    const hospitals = await Hospital.find(filter).limit(100);
    res.json(hospitals);
  } catch (err) {
    res.status(500).json({ error: '병원 조회 오류', detail: err.message });
  }
});

module.exports = router;
