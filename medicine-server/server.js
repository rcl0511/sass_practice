const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB 연결 (선택 사항)
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/medicines')
  .then(() => console.log('MongoDB 연결 성공'))
  .catch(err => console.log('MongoDB 연결 실패:', err));

// 정적 파일 (PDF 다운로드용)
app.use('/exports', express.static(path.join(__dirname, 'exports')));

// PDF 병합 라우터
const invoiceRouter = require('./routes/invoiceRouter');
app.use('/api', invoiceRouter);


// ✅ 아래 코드 추가
const clientsRouter = require('./routes/Clients');
app.use('/api/vendors/clients', clientsRouter);

// 서버 시작
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
