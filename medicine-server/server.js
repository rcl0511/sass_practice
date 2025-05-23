// app.js
const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB 연결 (테스트 DB)
mongoose.connect('mongodb://localhost:27017/medicines', {

})
  .then(() => console.log('MongoDB 연결 성공'))
  .catch(err => console.log('MongoDB 연결 실패:', err));

// 정적 파일 서빙 예시 (생략해도 무방)
app.use('/exports', express.static(path.join(__dirname, 'exports')));

// 거래처 API 라우터
const clientsRouter = require('./routes/Clients');
app.use('/api/vendors/clients', clientsRouter);


const medicinesRouter = require('./routes/Medicines');
app.use('/api/medicines', medicinesRouter);


const invoiceRouter = require('./routes/invoiceRouter');
app.use('/api', invoiceRouter);


// 서버 실행
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
