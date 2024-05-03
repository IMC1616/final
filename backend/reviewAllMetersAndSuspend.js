const cron = require("node-cron");
const Meters = require("./models/Meter");
const Invoices = require("./models/Invoice");
const ReconnectionInvoices = require("./models/ReconnectionInvoice");

const checkPendingInvoicesAndSuspend = async (meter) => {
  try {
    // Contar facturas pendientes asociadas al medidor
    const pendingCount = await Invoices.countDocuments({
      meter: meter._id,
      paymentStatus: "pending",
    });

    if (pendingCount > 2) {
      // Verificar si ya existe una factura de reconexión pendiente para este medidor
      const existingReconnectionInvoice = await ReconnectionInvoices.findOne({
        meter: meter._id,
        paymentStatus: "pending",
      });

      if (existingReconnectionInvoice) {
        return {
          success: false,
          message:
            "An unpaid reconnection invoice already exists. No new invoice created.",
        };
      }

      // Cambiar estado del medidor a 'suspended'
      await Meters.updateOne(
        { _id: meter._id },
        { $set: { status: "suspended" } }
      );

      // Crear una factura de reconexión
      const reconnectionInvoice = new ReconnectionInvoices({
        invoiceDate: new Date(), // Fecha actual
        totalAmount: meter.reconnection.amount, // Monto de reconexión
        paymentStatus: "pending", // Estado inicial de la factura
        meter: meter._id,
      });

      await reconnectionInvoice.save();

      return {
        success: true,
        message: "Meter suspended and reconnection invoice created.",
      };
    } else {
      return {
        success: false,
        message: "Not enough pending invoices to suspend.",
      };
    }
  } catch (error) {
    console.error("Error checking invoices and updating meter:", error);
    return { success: false, message: error.message };
  }
};

async function reviewAllMetersAndSuspend() {
  try {
    const meters = await Meters.find({}).populate("reconnection"); // Obtener todos los medidores

    for (let meter of meters) {
      const result = await checkPendingInvoicesAndSuspend(meter);
      console.log(`Meter ID ${meter._id}: ${result.message}`);
    }
  } catch (error) {
    console.error("Error processing all meters:", error);
  }
}

// Ejecuta el cron-job el día 10 de cada mes a las 00:00 horas.
cron.schedule("0 0 10 * *", () => {
  console.log("Ejecutando cron-job para revisar y suspender medidores.");
  reviewAllMetersAndSuspend();
});

// ejecuta el cron-job inmediatamente al iniciar el servidor
reviewAllMetersAndSuspend();

module.exports = { reviewAllMetersAndSuspend };
