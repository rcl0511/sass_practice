require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const xlsx = require('xlsx');
const mongoose = require('mongoose');

const Medicine = require('./models/Medicine');
const uploadRouter = require('./routes/upload');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());
app.use('/api/upload', uploadRouter); // 파일 업로드 라우터 연결

// MongoDB 연결
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/medicine-db';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// 엑셀 업로드 및 저장
app.post('/upload', upload.single('file'), async (req, res) => {
  const workbook = xlsx.readFile(req.file.path);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = xlsx.utils.sheet_to_json(sheet);

  try {
    await Medicine.insertMany(jsonData);
    res.status(200).json({ message: '엑셀 업로드 및 저장 성공' });
  } catch (error) {
    res.status(500).json({ error: 'DB 저장 실패', detail: error.message });
  }
});

// 약 이름으로 검색
app.get('/api/medicines', async (req, res) => {
  const { name } = req.query;
  const results = await Medicine.find({ name: new RegExp(name, 'i') });
  res.json(results);
});

// 서버 실행
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중`);
});
