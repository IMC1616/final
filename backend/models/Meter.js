const mongoose = require('mongoose')
const mongooseDelete = require('mongoose-delete')

const MeterScheme = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Properties',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Categories',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

MeterScheme.plugin(mongooseDelete, { overrideMethods: 'all' })
module.exports = mongoose.model('Meters', MeterScheme)
