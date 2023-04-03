const mongoose = require('mongoose')
const mongooseDelete = require('mongoose-delete')

const MeterScheme = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    pricePerkWh: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

MeterScheme.plugin(mongooseDelete, { overrideMethods: 'all' })
module.exports = mongoose.model('Meters', MeterScheme)
