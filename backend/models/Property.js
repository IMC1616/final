const mongoose = require('mongoose')
const mongooseDelete = require('mongoose-delete')

const PropertyScheme = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Users',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

PropertyScheme.plugin(mongooseDelete, { overrideMethods: 'all' })
module.exports = mongoose.model('Properties', PropertyScheme)
