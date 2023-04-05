const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const CategoryScheme = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    pricePerCubicMeter: {
      type: Number,
    },
    fixedPrice: {
      type: Number,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

CategoryScheme.pre("validate", function (next) {
  if (
    (this.pricePerCubicMeter && this.fixedPrice) ||
    (!this.pricePerCubicMeter && !this.fixedPrice)
  ) {
    next(
      new Error(
        "You must set only one of the 'pricePerCubicMeter' or 'fixedPrice' fields"
      )
    );
  } else {
    next();
  }
});

CategoryScheme.plugin(mongooseDelete, { overrideMethods: "all" });
module.exports = mongoose.model("Categories", CategoryScheme);
