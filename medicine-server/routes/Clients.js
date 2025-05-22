// src/routes/Clients.js

const express = require('express');
const router = express.Router();
const xlsx = require('xlsx');
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: path.join(__dirname, '../uploads/') });

const fieldMapping = {
  '거래처구분': 'classification',
  '코드': 'code',
  '상호내부명': 'nameInternal',
  '사업자원어명': 'nameOriginal',
  '대표자': 'representative',
  '생년월일': 'dob',
  '사업자번호': 'businessNumber',
  '전화번호': 'phone',
  '팩스번호': 'fax',
  '우편번호': 'zip',
  '사업장주소': 'address',
  '영업담당': 'salesRep',
  '부서장': 'deptHead',
  '단가적용처': 'priceApply',
  '재고적용처': 'stockApply',
  '계산서발행': 'invoiceIssue',
  '업태': 'businessType',
  '종목': 'item',
  '거래처종류': 'clientType',
  '거래처그룹': 'clientGroup',
  '계약구분': 'contractType',
  '배송구분': 'deliveryType',
  '약사성함': 'pharmacist',
  '면허번호': 'licenseNo',
  '요양기관번호': 'careNo',
  '마약류취급자식별번호': 'narcoticsId',
  '의료기기거래처코드': 'deviceClient',
  '거래처담당자': 'contact',
  '이메일': 'email',
  '계산서담당자': 'invoiceManager',
  '담당자핸드폰': 'managerPhone',
  '여신한도': 'creditLimit',
  '최대회전일': 'maxTurnDays',
  '월결재예상일': 'monthlyEstimate',
  '거래개시일': 'startDate',
  '비고1': 'note1',
  '비고2': 'note2',
  '거래여부': 'active',
  '전자거래명세서': 'eInvoice',
  '명세서전송시스템': 'invoiceSystem',
  '외부연동등록제외': 'externalExclude',
  '선결제유무': 'prePayment',
};

function convertKeys(row) {
  const newRow = {};
  for (const key in row) {
    if (fieldMapping[key]) {
      newRow[fieldMapping[key]] = row[key];
    }
  }
  return newRow;
}

// [1] 엑셀 업로드 → 변환 후 global._clients에 저장
router.post(
  '/upload',
  upload.single('file'),
  (req, res) => {
    try {
      const workbook = xlsx.readFile(req.file.path);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = xlsx.utils.sheet_to_json(sheet);

      // 한글 → 영어 key 변환
      const convertedRows = rows.map(convertKeys);

      global._clients = convertedRows;
      return res.json({ success: true });
    } catch (err) {
      console.error('Clients.upload error:', err);
      return res.status(500).json({ error: '파싱 실패' });
    }
  }
);

// [2] 거래처 목록 조회
router.get('/', (req, res) => {
  try {
    // global._clients가 없으면 빈 배열
    res.json(global._clients || []);
  } catch (err) {
    return res.status(500).json({ error: '조회 실패' });
  }
});

module.exports = router;
