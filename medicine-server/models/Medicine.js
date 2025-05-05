// models/Medicine.js

const mongoose = require('mongoose');

// 1) 스키마 정의
const MedicineSchema = new mongoose.Schema({
  no:               Number,
  supplier:         String,
  manufacturer:     String,
  code:             String,
  name:             String,
  spec:             String,
  basePrice:        Number,
  location:         String,
  prevStock:        Number,
  prevAmount:       Number,
  inQty:            Number,
  inAmount:         Number,
  outQty:           Number,
  outAmount:        Number,
  stockQty:         Number,
  purchasedQty:     Number,
  unitPrice:        Number,
  basePricePercent: Number,
  stockAmount:      Number,
  basePriceCode:    String,
  remarks:          String,
  standardCode:     String,
  productLocation:  String
}, {
  timestamps: true
});

// 2) 모델 생성 및 내보내기
module.exports = mongoose.model('Medicine', MedicineSchema);
