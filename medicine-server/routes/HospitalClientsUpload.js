// routes/HospitalClientsUpload.js
const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const Client = require('../models/Client');
const { requireLogin } = require('../middleware/auth');
const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', requireLogin, upload.single('file'), async (req, res) => {
  try {
    const vendorId = req.user._id;
    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);

    // 예시: 기존 코드와 중복이면 업데이트, 아니면 신규
    for (const row of rows) {
      await Client.findOneAndUpdate(
        { code: row['코드'], vendorId },
        { ...row, vendorId },
        { upsert: true }
      );
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: '엑셀 업로드 실패' });
  }
});
module.exports = router;
