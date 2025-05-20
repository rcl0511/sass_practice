require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const xlsx = require('xlsx');
const mongoose = require('mongoose');

const Medicine = require('./models/Medicine');
const invoiceRouter = require('./routes/invoiceRouter'); // ✅ PDF 처리 라우터

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());
app.use('/api', invoiceRouter); // ✅ 라우터 등록
app.use('/exports', express.static('exports')); // ✅ 생성된 PDF 접근 경로

// MongoDB 연결
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/medicine-db';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// 엑셀 업로드 (기존 로직)
function mapRow(row) {
  const toNum = v => (typeof v === 'string' ? parseFloat(v.replace(/,/g, '')) : v || 0);
  return {
    no: row['No'],
    supplier: row['입고처'],
    manufacturer: row['제조사'],
    code: row['코드'],
    name: row['제품명'],
    spec: row['규격'],
    basePrice: toNum(row['기준가']),
    location: row['재고위치'],
    prevStock: toNum(row['전일재고']),
    prevAmount: toNum(row['전일금액']),
    inQty: toNum(row['입고수량']),
    inAmount: toNum(row['입고금액']),
    outQty: toNum(row['출고수량']),
    outAmount: toNum(row['출고금액']),
    stockQty: toNum(row['재고수량']),
    purchasedQty: toNum(row['매입처집계수량']),
    unitPrice: toNum(row['단가']),
    basePricePercent: toNum(row['기준가%']),
    stockAmount: toNum(row['재고금액']),
    basePriceCode: row['기준가코드'],
    remarks: row['비고'],
    standardCode: row['표준코드'],
    productLocation: row['제품위치'],
  };
}

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const wb = xlsx.readFile(req.file.path);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const raw = xlsx.utils.sheet_to_json(sheet, { defval: '' });
    const medicines = raw.map(mapRow);
    await Medicine.insertMany(medicines);
    return res.json({ message: '✅ 업로드 및 저장 성공', count: medicines.length });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: '파일 처리 실패', detail: err.message });
  }
});

app.get('/api/medicines', async (req, res) => {
  try {
    const { name } = req.query;
    const filter = name ? { name: new RegExp(name, 'i') } : {};
    const docs = await Medicine.find(filter).lean();
    return res.json(docs);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: '조회 실패', detail: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 서버 실행 중: http://localhost:${PORT}`));


console.log('✅ index.js 실행됨');