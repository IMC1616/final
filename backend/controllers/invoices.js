const Meter = require("../models/Meter");
const Consumption = require("../models/Consumption");
const Invoice = require("../models/Invoice");
const ReconnectionInvoice = require("../models/ReconnectionInvoice");

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

    const invoicesQuery = Invoice.find(query)
      .populate({
        path: "consumption",
        populate: { path: "meter", populate: { path: "category" } },
      })
      .populate("user")
      .skip(offsetNumber)
      .limit(limitPerPage);

    const reconnectionInvoicesQuery = ReconnectionInvoice.find({
      meter: meter._id,
    }).populate("meter");

    const [invoices, reconnectionInvoices] = await Promise.all([
      invoicesQuery,
      reconnectionInvoicesQuery,
    ]);

    const mappedInvoices = invoices.map((invoice) => ({
      ...invoice.toObject(),
      invoiceType: "Regular",
    }));

    const mappedReconnectionInvoices = reconnectionInvoices.map((invoice) => ({
      ...invoice.toObject(),
      invoiceType: "Reconnection",
    }));

    const combinedInvoices = [...mappedReconnectionInvoices, ...mappedInvoices];
    const paginatedInvoices = combinedInvoices.slice(
      offsetNumber,
      offsetNumber + limitPerPage
    );
    const totalInvoices = combinedInvoices.length;
    const totalPages = Math.ceil(totalInvoices / limitPerPage);

    res.status(200).json({
      success: true,
      data: {
        invoices: paginatedInvoices,
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
    let invoiceType = null;

    // Try to find the invoice in the Invoice collection first
    let invoice = await Invoice.findById(id)
      .populate({
        path: "consumption",
        populate: { path: "meter", populate: { path: "category" } },
      })
      .populate("user");

    if (invoice) {
      invoice = { ...invoice.toObject(), invoiceType: "Regular" };
    } else {
      // If not found, search in the ReconnectionInvoice collection
      invoice = await ReconnectionInvoice.findById(id).populate({
        path: "meter",
        populate: [
          {
            path: "property",
            populate: {
              path: "user",
            },
          },
          {
            path: "category", // Assuming 'category' is directly under 'meter' and doesn't need further nesting
          },
        ],
      });

      if (invoice) {
        invoice = {
          ...invoice.toObject(),
          user: invoice.meter.property.user,
          invoiceType: "Reconnection",
        };
      }
    }

    if (!invoice) {
      return res.status(404).json({
        message: "No se encontró la factura con el ID proporcionado",
      });
    }

    // Add the invoice type to the invoice object before sending it back

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
    const { id, invoiceType } = req.params; // Assuming invoiceType is passed as a URL parameter

    // Determine the model based on the invoiceType
    let Model;
    if (invoiceType === "reconnection") {
      Model = ReconnectionInvoice;
    } else if (invoiceType === "regular") {
      Model = Invoice;
    } else {
      return res.status(400).json({
        message: "Tipo de factura inválido",
      });
    }

    const invoice = await Model.findById(id);
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

    // Update payment status and date
    invoice.paymentStatus = "paid";
    invoice.paymentDate = new Date();
    invoice.registeredBy = req.user._id; // Assuming the user's ID is attached to the request

    await invoice.save();

    res.status(200).json({
      success: true,
      message: "Factura pagada exitosamente",
      data: invoice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al pagar la factura" });
  }
};

module.exports = {
  getInvoicesByMeter,
  getInvoiceById,
  payInvoice,
};
