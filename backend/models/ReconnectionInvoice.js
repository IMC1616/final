const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const ReconnectionInvoiceSchema = new mongoose.Schema(
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
      enum: ["pending", "paid"],
      required: true,
    },
    paymentDate: {
      type: Date,
    },
    meter: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Meters",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Users",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

ReconnectionInvoiceSchema.plugin(mongooseDelete, { overrideMethods: "all" });
module.exports = mongoose.model(
  "ReconnectionInvoices",
  ReconnectionInvoiceSchema
);
