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
      unique: true,
      required: true,
    },
    ci: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      enum: ["customer", "reader", "admin"],
      default: "customer",
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
