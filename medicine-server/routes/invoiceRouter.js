// routes/invoiceRouter.js
console.log('✅ invoiceRouter.js 로딩됨');

const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { mergePdfWithTemplate } = require('../utils/mergePdfWithTemplate');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload-invoice', upload.single('invoice'), async (req, res) => {
  try {
    const uploadedPath = req.file.path;

    // 병합 결과 저장 경로 설정
    const exportsDir = path.join(__dirname, '../exports');
    if (!fs.existsSync(exportsDir)) fs.mkdirSync(exportsDir);

    const finalFilename = `${Date.now()}_merged.pdf`;
    const finalPdfPath = path.join(exportsDir, finalFilename);

    // 템플릿 PDF 경로
    const templatePath = path.join(__dirname, '../templates/거래명세서_양식.pdf');

    // 병합 실행
    await mergePdfWithTemplate(templatePath, uploadedPath, finalPdfPath);

    // 응답
    return res.json({
      message: '성공',
      pdfUrl: `/exports/${finalFilename}`
    });

  } catch (err) {
    console.error('🚨 invoiceRouter 오류:', err);
    return res.status(500).json({ error: '처리 실패', detail: err.message });
  }
});

module.exports = router;
