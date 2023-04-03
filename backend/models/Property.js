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
    user: {
      type: Schema.Types.ObjectId,
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
