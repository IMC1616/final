const mongoose = require('mongoose')
const mongooseDelete = require('mongoose-delete')

const CategoryScheme = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    pricePerCubicMeter: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

CategoryScheme.plugin(mongooseDelete, { overrideMethods: 'all' })
module.exports = mongoose.model('Categories', CategoryScheme)
