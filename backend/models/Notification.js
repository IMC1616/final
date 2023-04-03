const mongoose = require('mongoose')
const mongooseDelete = require('mongoose-delete')

const NotificationScheme = new mongoose.Schema(
  {
    notificationDate: {
      type: Date,
      required: true,
    },
    viewedAt: {
      type: Date,
      required: true,
    },
    invoice: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Invoices',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

NotificationScheme.plugin(mongooseDelete, { overrideMethods: 'all' })
module.exports = mongoose.model('Notifications', NotificationScheme)
