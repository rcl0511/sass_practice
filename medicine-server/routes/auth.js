const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 회원가입
router.post('/signup', async (req, res) => {
  const { email, password, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ error: '이미 등록된 이메일입니다.' });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed, role });
  res.json({ success: true });
});

// 로그인
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: '등록된 이메일이 없습니다.' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: '비밀번호가 일치하지 않습니다.' });

  // JWT 발급
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
});

module.exports = router;
