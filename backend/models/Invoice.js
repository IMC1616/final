const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const InvoiceSchema = new mongoose.Schema(
  {
    // TODO: agregar número de factura
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
    consumption: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Consumptions",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Users",
    },
    registeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

InvoiceSchema.plugin(mongooseDelete, { overrideMethods: "all" });
module.exports = mongoose.model("Invoices", InvoiceSchema);
