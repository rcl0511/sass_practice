// medicine-server/models/pdfUpload.js
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const path = require('path');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload-invoice', upload.single('invoice'), async (req, res) => {
  try {
    const fileBuffer = fs.readFileSync(req.file.path);
    const data = await pdfParse(fileBuffer);
    const text = data.text;

    const lines = text.split('\n').map(line => line.trim());

    // 병원명 추출 (예: '정형외과' 포함된 줄)
    const hospitalLine = lines.find(line => line.includes('병원') || line.includes('정형외과'));
    const hospitalName = hospitalLine || '병원명 추출 실패';

    res.json({ hospitalName });
  } catch (err) {
    console.error('PDF 파싱 에러:', err);
    res.status(500).json({ error: 'PDF 파싱 실패', detail: err.message });
  }
});

module.exports = router;
