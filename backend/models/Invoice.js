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
      required: true,
    },
    consumption: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Consumptions',
    },
    user: {
      type: Schema.Types.ObjectId,
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
