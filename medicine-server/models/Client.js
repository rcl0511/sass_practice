// models/Client.js
const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  classification: String,
  code: String,
  nameOriginal: String,
  representative: String,
  businessNumber: String,
  phone: String,
  vendorId: { type: String }, // ObjectId 아님! 테스트용 String
}, { timestamps: true });

module.exports = mongoose.model('Client', ClientSchema); // 컬렉션명: clients
