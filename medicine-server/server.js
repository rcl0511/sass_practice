const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB 연결 성공'))
  .catch(err => console.log('MongoDB 연결 실패:', err));

// 의약품 관련 라우터
const medicineRoutes = require('./routes/medicines');
app.use('/api/medicines', medicineRoutes);

// 주문 관련 라우터
const ordersRouter = require('./routes/orders');
app.use('/api/orders', ordersRouter);

// invoiceRouter 등록 전에 static 미들웨어 추가
app.use('/exports', express.static(path.join(__dirname, 'exports')));


// ▶ invoiceRouter 등록 (이 부분을 추가)
const invoiceRouter = require('./routes/invoiceRouter');
app.use('/api', invoiceRouter);


// 서버 시작
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);});
