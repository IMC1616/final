const cron = require("node-cron");
const Category = require("./models/Category");
const Consumption = require("./models/Consumption");
const Invoice = require("./models/Invoice");
const Property = require("./models/Property");
const User = require("./models/User");

const Notification = require("./models/Notification");
const sendEmail = require("./utils/sendEmail");

const calculateTotalAmount = async (consumption, categoryId) => {
  try {
    // Encuentra la categoría en la base de datos.
    const category = await Category.findById(categoryId);

    // Si la categoría tiene un precio por metro cúbico, multiplica por el consumo en metros cúbicos.
    if (category.pricePerCubicMeter) {
      return consumption.consumptionCubicMeters * category.pricePerCubicMeter;
    }

    // Si la categoría tiene un precio fijo, devuelve ese precio.
    if (category.fixedPrice) {
      return category.fixedPrice;
    }

    // Si no hay precio por metro cúbico ni precio fijo, devuelve 0.
    return 0;
  } catch (error) {
    console.error("Error al calcular el monto total de la factura:", error);
    throw error;
  }
};

const sendNotification = async (user, consumption, invoice) => {
  try {
    // Crea una nueva notificación.
    const newNotification = new Notification({
      notificationDate: new Date(),
      viewedAt: null, // La notificación no ha sido vista todavía.
      invoice: invoice._id,
      user: user._id,
    });

    // Guarda la notificación en la base de datos.
    await newNotification.save();

    // Prepara el contenido del correo electrónico.
    const emailSubject = "Nueva factura disponible";
    const emailText = `Hola, ${user.name} ${user.lastName}.\n\nSe ha generado una nueva factura por tu consumo de agua. El monto total es de ${invoice.totalAmount}. Por favor, ingresa a tu cuenta para ver más detalles y realizar el pago.\n\nGracias.`;

    // Envía un correo electrónico al usuario.
    await sendEmail(user.email, emailSubject, emailText);
  } catch (error) {
    console.error("Error al enviar la notificación:", error);
    throw error;
  }
};

const createInvoicesAndNotifications = async () => {
  try {
    // Obtén el primer día y el último día del mes actual.
    const currentDate = new Date();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const lastDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    // Obtén todos los consumos del mes actual que no tienen factura asociada.
    const consumptions = await Consumption.find({
      createdAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
    }).populate({
      path: "meter",
      populate: {
        path: "property",
        populate: {
          path: "user",
        },
      },
    });

    for (const consumption of consumptions) {
      // Extrae la propiedad y el usuario del medidor.
      const property = consumption.meter.property;
      const user = property.user;

      // Verifica si ya existe una factura para este consumo.
      const existingInvoice = await Invoice.findOne({
        consumption: consumption._id,
      });

      if (existingInvoice) {
        console.log(
          `Ya existe una factura para el consumo con ID ${consumption._id}. Se omite la creación de una nueva factura.`
        );
        continue; // Salta al siguiente ciclo del bucle for.
      }

      // Calcula el monto total de la factura.
      const totalAmount = await calculateTotalAmount(
        consumption,
        consumption.meter.category
      );

      // Crea una nueva factura.
      const newInvoice = new Invoice({
        invoiceDate: consumption.readingDate,
        totalAmount,
        paymentStatus: "pending",
        consumption: consumption._id,
        user: user._id,
      });

      // Guarda la factura en la base de datos.
      await newInvoice.save();

      // Enviar notificación al usuario.
      sendNotification(user, consumption, newInvoice);
    }
  } catch (error) {
    console.error("Error al crear facturas y notificaciones:", error);
  }
};

// Ejecuta el cron-job el día 10 de cada mes a las 00:00 horas.
cron.schedule("0 0 10 * *", () => {
  console.log("Ejecutando cron-job para crear facturas y notificaciones.");
  createInvoicesAndNotifications();
});

module.exports = { createInvoicesAndNotifications };
