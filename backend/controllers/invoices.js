const Meter = require("../models/Meter");
const Consumption = require("../models/Consumption");
const Invoice = require("../models/Invoice");

const getInvoicesByMeter = async (req, res) => {
  try {
    const { meterCode, startDate, endDate, pendingOnly, offset, limit } =
      req.query;
    const offsetNumber = parseInt(offset) || 0;
    const limitPerPage = parseInt(limit) || 10;

    const meter = await Meter.findOne({ code: meterCode });
    if (!meter) {
      return res.status(404).json({
        message: "No se encontró el medidor con el código proporcionado",
      });
    }

    const query = {
      consumption: {
        $in: [],
      },
    };

    if (startDate && endDate) {
      query.invoiceDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (pendingOnly === "true") {
      query.paymentStatus = "pending";
    }

    const consumptions = await Consumption.find({ meter: meter._id });
    query.consumption.$in = consumptions.map((consumption) => consumption._id);

    const invoices = await Invoice.find(query)
      .populate({
        path: "consumption",
        populate: { path: "meter", populate: { path: "category" } },
      })
      .populate("user")
      .skip(offsetNumber)
      .limit(limitPerPage);

    const totalInvoices = await Invoice.countDocuments(query);
    const totalPages = Math.ceil(totalInvoices / limitPerPage);

    res.status(200).json({
      success: true,
      data: {
        invoices,
        page: Math.ceil(offsetNumber / limitPerPage) + 1,
        limit: limitPerPage,
        totalPages,
        totalRecords: totalInvoices,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las facturas" });
  }
};

const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findById(id)
      .populate({
        path: "consumption",
        populate: { path: "meter", populate: { path: "category" } },
      })
      .populate("user");
    if (!invoice) {
      return res.status(404).json({
        message: "No se encontró la factura con el ID proporcionado",
      });
    }

    res.status(200).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las facturas" });
  }
};

const payInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return res.status(404).json({
        message: "No se encontró la factura con el ID proporcionado",
      });
    }

    if (invoice.paymentStatus === "paid") {
      return res.status(400).json({
        message: "La factura ya ha sido pagada",
      });
    }
    invoice.paymentStatus = "paid";
    invoice.paymentDate = new Date();
    invoice.registeredBy = req.user._id;

    await invoice.save();

    res.status(200).json({
      success: true,
      message: "Factura pagada exitosamente",
      data: invoice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las facturas" });
  }
};

module.exports = {
  getInvoicesByMeter,
  getInvoiceById,
  payInvoice,
};
