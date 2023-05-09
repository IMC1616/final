const mongoose = require('mongoose')
const mongooseDelete = require('mongoose-delete')

const InvoiceScheme = new mongoose.Schema(
  {
    invoiceDate: {
      type: Date,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid'],
      required: true,
    },
    consumption: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Consumptions',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Users',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

InvoiceScheme.plugin(mongooseDelete, { overrideMethods: 'all' })
module.exports = mongoose.model('Invoices', InvoiceScheme)
