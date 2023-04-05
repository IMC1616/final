const mongoose = require('mongoose')
const mongooseDelete = require('mongoose-delete')

const ConsumptionScheme = new mongoose.Schema(
  {
    readingDate: {
      type: Date,
      required: true,
    },
    previousReading: {
      type: Number,
      required: true,
    },
    currentReading: {
      type: Number,
      required: true,
    },
    consumptionCubicMeters: {
      type: Number,
      required: true,
    },
    meter: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Meters',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

ConsumptionScheme.plugin(mongooseDelete, { overrideMethods: 'all' })
module.exports = mongoose.model('Consumptions', ConsumptionScheme)
