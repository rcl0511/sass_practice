// medicine-server/routes/orders.js
const express = require('express');
const router  = express.Router();
const Order   = require('../models/Order');

// POST /api/orders — 신규 주문 생성 (status 기본값 'PENDING' 적용)
router.post('/', async (req, res) => {
  try {
    const { hospitalName, items } = req.body;
    if (!hospitalName || !items?.length) {
      return res.status(400).json({ error: '병원명과 아이템이 필요합니다.' });
    }
    // Order 모델 스키마에 status 필드(default: 'PENDING')가 정의되어 있어야 합니다.
    const order = new Order({ hospitalName, items });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error('POST /api/orders 에러:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders — 전체 주문 조회
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .lean();
    res.json(orders);
  } catch (err) {
    console.error('GET /api/orders 에러:', err);
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/orders/:id/accept — 주문 수락 처리
router.patch('/:id/accept', async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ error: '주문을 찾을 수 없습니다.' });

    order.status = 'ACCEPTED';
    await order.save();

    res.json(order);
  } catch (err) {
    console.error(`PATCH /api/orders/${req.params.id}/accept 에러:`, err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
