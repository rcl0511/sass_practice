// routes/invoiceRouter.js
console.log('✅ invoiceRouter.js 로딩됨');

const express    = require('express');
const multer     = require('multer');
const fs         = require('fs');
const path       = require('path');
const pdfParse   = require('pdf-parse');
const { mergePdfWithTemplate } = require('../utils/mergePdfWithTemplate');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// ─── 단일 파일 업로드 ───────────────────────────────────────────────────────
router.post('/upload-invoice', upload.single('invoice'), async (req, res) => {
  try {
    const uploadedPath = req.file.path;
    const rawBuffer    = fs.readFileSync(uploadedPath);

    // 1) PDF 파싱 + 연속 중복 제거
    const { text: rawText } = await pdfParse(rawBuffer);
    const lines = rawText.split(/\r?\n/);
    const seen  = new Set();
    const parsedLines = lines.filter(l => {
      const t = l.trim();
      if (!t || seen.has(t)) return false;
      seen.add(t);
      return true;
    });
    const parsedText = parsedLines.join('\n');

    // 2) 병원명 추출 (괄호付き 이름 처리)
    const hospMatch = parsedText.match(
      /(?:\([^\)]*\)\s*)?([가-힣]+(?:의원|병원|클리닉|정형외과|내과|이비인후과))/
    );
    const hospitalName = hospMatch
      ? hospMatch[1]
      : path.basename(req.file.originalname, '.pdf');

    // 3) 주문날짜 추출 (YYYY-MM-DD 또는 YY/MM/DD)
    let orderDate = '';
    const ymd = parsedText.match(/(\d{4}[\/\-]\d{2}[\/\-]\d{2})/);
    if (ymd) {
      orderDate = ymd[1].replace(/[\/\-]/g, '');
    } else {
      const y2 = parsedText.match(/(\d{2}\/\d{2}\/\d{2})/);
      if (y2) {
        const [yy, mm, dd] = y2[1].split('/');
        orderDate = `20${yy}${mm}${dd}`;
      } else {
        orderDate = `${Date.now()}`;
      }
    }

    // 4) 안전한 파일명 생성
    const safeHosp = hospitalName.replace(/[^가-힣a-zA-Z0-9_-]/g, '');
    const safeDate = orderDate;
    const finalFilename = `${safeHosp}_${safeDate}.pdf`;

    // 5) 병합 결과 저장
    const exportsDir   = path.join(__dirname, '../exports');
    if (!fs.existsSync(exportsDir)) fs.mkdirSync(exportsDir);
    const finalPdfPath = path.join(exportsDir, finalFilename);

    // 6) 템플릿 경로 & 병합 실행
    const templatePath = path.join(__dirname, '../templates/거래명세서_양식.pdf');
    await mergePdfWithTemplate(templatePath, uploadedPath, finalPdfPath);

    // 7) 응답
    return res.json({
      message:    '성공',
      pdfUrl:     `/exports/${finalFilename}`,
      parsedText,
    });

  } catch (err) {
    console.error('🚨 invoiceRouter 오류:', err);
    return res.status(500).json({ error: '처리 실패', detail: err.message });
  }
});

// ─── 다중 파일 업로드 ───────────────────────────────────────────────────────
router.post('/upload-invoices', upload.array('invoices', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: '업로드할 파일이 없습니다.' });
    }

    const exportsDir = path.join(__dirname, '../exports');
    if (!fs.existsSync(exportsDir)) fs.mkdirSync(exportsDir);

    const results = [];

    for (const file of req.files) {
      const uploadedPath = file.path;
      const rawBuffer    = fs.readFileSync(uploadedPath);

      // 1) 파싱 + 중복 제거
      const { text: rawText } = await pdfParse(rawBuffer);
      const lines = rawText.split(/\r?\n/);
      const seen  = new Set();
      const parsedLines = lines.filter(l => {
        const t = l.trim();
        if (!t || seen.has(t)) return false;
        seen.add(t);
        return true;
      });
      const parsedText = parsedLines.join('\n');

      // 2) 병원명 추출
      const hospMatch = parsedText.match(
        /(?:\([^\)]*\)\s*)?([가-힣]+(?:의원|병원|클리닉|정형외과|내과|이비인후과))/
      );
      const hospitalName = hospMatch
        ? hospMatch[1]
        : path.basename(file.originalname, '.pdf');

      // 3) 주문날짜 추출
      let orderDate = '';
      const ymd = parsedText.match(/(\d{4}[\/\-]\d{2}[\/\-]\d{2})/);
      if (ymd) {
        orderDate = ymd[1].replace(/[\/\-]/g, '');
      } else {
        const y2 = parsedText.match(/(\d{2}\/\d{2}\/\d{2})/);
        if (y2) {
          const [yy, mm, dd] = y2[1].split('/');
          orderDate = `20${yy}${mm}${dd}`;
        } else {
          orderDate = `${Date.now()}`;
        }
      }

      // 4) 안전한 파일명 생성
      const safeHosp = hospitalName.replace(/[^가-힣a-zA-Z0-9_-]/g, '');
      const safeDate = orderDate;
      const finalFilename = `${safeHosp}_${safeDate}_${Date.now()}.pdf`;

      // 5) 병합 결과 저장
      const finalPdfPath = path.join(exportsDir, finalFilename);
      const templatePath = path.join(__dirname, '../templates/거래명세서_양식.pdf');
      await mergePdfWithTemplate(templatePath, uploadedPath, finalPdfPath);

      // 6) 결과 누적
      results.push({
        originalName: file.originalname,
        pdfUrl:       `/exports/${finalFilename}`,
        parsedText,
      });
    }

    return res.json({ message: '다중 업로드 완료', files: results });
  } catch (err) {
    console.error('🚨 다중 업로드 오류:', err);
    return res.status(500).json({ error: '처리 실패', detail: err.message });
  }
});

module.exports = router;
