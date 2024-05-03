const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const ReconnectionScheme = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    amount: {
      type: Number,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

ReconnectionScheme.plugin(mongooseDelete, { overrideMethods: "all" });
module.exports = mongoose.model("Reconnections", ReconnectionScheme);
