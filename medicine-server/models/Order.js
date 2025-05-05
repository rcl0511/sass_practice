// medicine-server/models/Order.js
const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  code:  String,
  name:  String,
  qty:   Number
}, { _id: false });

const OrderSchema = new mongoose.Schema({
    hospitalName: { type: String, required: true },
    items:        { type: [OrderItemSchema], required: true },
    status:       { type: String, enum: ['PENDING','ACCEPTED'], default: 'PENDING' }
  }, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);


