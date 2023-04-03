const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const UserScheme = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "reader", "admin"],
      default: "user",
    },
    resetPasswordToken: {
      type: String,
      unique: true,
      sparse: true,
    },
    resetPasswordTokenSentAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

UserScheme.method("toJSON", function () {
  const { password, ...object } = this.toObject();
  return object;
});

UserScheme.plugin(mongooseDelete, { overrideMethods: "all" });
module.exports = mongoose.model("Users", UserScheme);
