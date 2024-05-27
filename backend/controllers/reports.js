const Invoice = require("../models/Invoice");
const ReconnectionInvoice = require("../models/ReconnectionInvoice");

// const getReport = async (req, res) => {
//   try {
//     const {
//       startDate,
//       endDate,
//       offset = 0,
//       limit = 10,
//       sort = "invoiceDate",
//       select = "",
//     } = req.query;

//     if (!startDate || !endDate) {
//       return res.status(400).json({
//         success: false,
//         message: "Se requieren las fechas de inicio y fin",
//       });
//     }

//     const query = {
//       invoiceDate: {
//         $gte: new Date(startDate),
//         $lte: new Date(endDate),
//       },
//       paymentStatus: "paid",
//     };

//     const queryBuilder = Invoice.find(query)
//       .skip(parseInt(offset))
//       .limit(parseInt(limit))
//       .sort(sort)
//       .populate({
//         path: "user",
//         select: "name lastName",
//       })
//       .populate({
//         path: "consumption",
//         populate: {
//           path: "meter",
//           select: "code",
//         },
//       });

//     if (select) {
//       const fields = select.split(",").join(" ");
//       queryBuilder.select(fields);
//     }

//     const paidInvoices = await queryBuilder.exec();
//     const totalRecords = await Invoice.countDocuments(query);
//     const totalPages = Math.ceil(totalRecords / parseInt(limit));

//     const report = paidInvoices.map((invoice) => ({
//       invoiceId: invoice._id,
//       meterCode: invoice.consumption ? invoice.consumption.meter.code : null,
//       date: invoice.invoiceDate,
//       userName: `${invoice.user.name} ${invoice.user.lastName}`,
//       amount: invoice.totalAmount,
//     }));

//     res.status(200).json({
//       success: true,
//       data: {
//         reports: report,
//         offset: parseInt(offset),
//         limit: parseInt(limit),
//         sort,
//         select,
//         totalPages,
//         totalRecords,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Hubo un error al obtener el reporte",
//     });
//   }
// };

const getReport = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      offset = 0,
      limit = 10,
      sort = "invoiceDate",
      select = "",
    } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Se requieren las fechas de inicio y fin",
      });
    }

    const query = {
      invoiceDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
      paymentStatus: "paid",
    };

    // Consultar facturas pagadas
    const invoiceQueryBuilder = Invoice.find(query)
      .skip(parseInt(offset))
      .limit(parseInt(limit))
      .sort(sort)
      .populate({
        path: "user",
        select: "name lastName",
      })
      .populate({
        path: "consumption",
        populate: {
          path: "meter",
          select: "code",
        },
      });

    if (select) {
      const fields = select.split(",").join(" ");
      invoiceQueryBuilder.select(fields);
    }

    const paidInvoices = await invoiceQueryBuilder.exec();

    // Consultar facturas de reconexión pagadas
    const reconnectionInvoiceQueryBuilder = ReconnectionInvoice.find(query)
      .skip(parseInt(offset))
      .limit(parseInt(limit))
      .sort(sort)
      .populate({
        path: "meter",
        populate: [
          {
            path: "property",
            populate: {
              path: "user",
              select: "name lastName",
            },
          },
          {
            path: "category", // Assuming 'category' is directly under 'meter' and doesn't need further nesting
          },
        ],
      });

    if (select) {
      const fields = select.split(",").join(" ");
      reconnectionInvoiceQueryBuilder.select(fields);
    }

    const paidReconnectionInvoices =
      await reconnectionInvoiceQueryBuilder.exec();

    // Combinar y procesar datos
    const combinedInvoices = [
      ...paidInvoices.map((invoice) => ({
        invoiceId: invoice._id,
        meterCode: invoice.consumption ? invoice.consumption.meter.code : null,
        date: invoice.invoiceDate,
        userName: `${invoice.user.name} ${invoice.user.lastName}`,
        amount: invoice.totalAmount,
        invoiceType: "Regular",
      })),
      ...paidReconnectionInvoices.map((invoice) => ({
        invoiceId: invoice._id,
        meterCode: invoice.meter.code,
        date: invoice.invoiceDate,
        userName: `${invoice.meter.property.user.name} ${invoice.meter.property.user.lastName}`,
        amount: invoice.totalAmount,
        invoiceType: "Reconnection",
      })),
    ];

    const totalRecords = combinedInvoices.length;
    const totalPages = Math.ceil(totalRecords / parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        reports: combinedInvoices,
        offset: parseInt(offset),
        limit: parseInt(limit),
        sort,
        select,
        totalPages,
        totalRecords,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Hubo un error al obtener el reporte",
    });
  }
};

const getIncomes = async (req, res) => {
  try {
    const { startDate, endDate } = req.query; // estas fechas las recibes en el formato YYYY-MM-DD

    const unpaidInvoices = await Invoice.find({
      invoiceDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
      paymentStatus: "paid",
    }).populate("user");

    const usersDebts = unpaidInvoices.reduce((acc, invoice) => {
      if (!acc[invoice.user._id]) {
        acc[invoice.user._id] = {
          userInfo: invoice.user,
          totalAmount: 0,
          monthlyDetails: {},
        };
      }

      acc[invoice.user._id].totalAmount += invoice.totalAmount;

      const invoiceMonth = invoice.invoiceDate.getMonth() + 1; // getMonth() devuelve un índice base 0
      if (!acc[invoice.user._id].monthlyDetails[invoiceMonth]) {
        acc[invoice.user._id].monthlyDetails[invoiceMonth] = 0;
      }
      acc[invoice.user._id].monthlyDetails[invoiceMonth] += invoice.totalAmount;

      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: Object.values(usersDebts),
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_INCOMES");
  }
};

const getUnpaid = async (req, res) => {
  try {
    const { startDate, endDate } = req.query; // estas fechas las recibes en el formato YYYY-MM-DD

    const unpaidInvoices = await Invoice.find({
      invoiceDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
      paymentStatus: "pending",
    }).populate("user");

    const usersDebts = unpaidInvoices.reduce((acc, invoice) => {
      if (!acc[invoice.user._id]) {
        acc[invoice.user._id] = {
          userInfo: invoice.user,
          totalDebt: 0,
          monthlyDetails: {},
        };
      }

      acc[invoice.user._id].totalDebt += invoice.totalAmount;

      const invoiceMonth = invoice.invoiceDate.getMonth() + 1; // getMonth() devuelve un índice base 0
      if (!acc[invoice.user._id].monthlyDetails[invoiceMonth]) {
        acc[invoice.user._id].monthlyDetails[invoiceMonth] = 0;
      }
      acc[invoice.user._id].monthlyDetails[invoiceMonth] += invoice.totalAmount;

      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: Object.values(usersDebts),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Hubo un error al obtener los informes de impagos",
    });
  }
};

const getSummary = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const unpaidInvoicesCount = await Invoice.countDocuments({
      invoiceDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
      paymentStatus: "pending",
    });

    const unpaidInvoicesAmount = await Invoice.aggregate([
      {
        $match: {
          invoiceDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
          paymentStatus: "pending",
        },
      },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const paidInvoicesAmount = await Invoice.aggregate([
      {
        $match: {
          invoiceDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
          paymentStatus: "paid",
        },
      },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    res.json({
      unpaidInvoicesCount,
      unpaidInvoicesAmount:
        unpaidInvoicesAmount.length > 0 ? unpaidInvoicesAmount[0].total : 0,
      paidInvoicesAmount:
        paidInvoicesAmount.length > 0 ? paidInvoicesAmount[0].total : 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// const getDelinquentUsersReport = async (req, res) => {
//   try {
//     const { startDate, endDate } = req.query;

//     if (!startDate || !endDate) {
//       return res.status(400).json({
//         success: false,
//         message: "Start and end dates are required",
//       });
//     }

//     // Find all unpaid invoices within the given date range
//     const unpaidInvoices = await Invoice.find({
//       invoiceDate: { $gte: new Date(startDate), $lt: new Date(endDate) },
//       paymentStatus: "pending",
//     }).populate({
//       path: "user",
//       select: "name lastName",
//     });

//     // Find any related unpaid reconnection invoices
//     const reconnectionInvoices = await ReconnectionInvoice.find({
//       invoiceDate: { $gte: new Date(startDate), $lt: new Date(endDate) },
//       paymentStatus: "pending",
//     }).populate({
//       path: "meter",
//       populate: [
//         {
//           path: "property",
//           populate: {
//             path: "user",
//           },
//         },
//         {
//           path: "category", // Assuming 'category' is directly under 'meter' and doesn't need further nesting
//         },
//       ],
//     });

//     // Combine and reduce the data
//     const combinedInvoices = [
//       ...unpaidInvoices.map((invoice) => ({
//         ...invoice.toJSON(),
//         invoiceType: "Regular",
//       })),
//       ...reconnectionInvoices.map((invoice) => ({
//         ...invoice.toJSON(),
//         user: invoice.meter.property.user, // Flatten the structure
//         invoiceType: "Reconnection",
//       })),
//     ];

//     const userDebts = combinedInvoices.reduce((acc, invoice) => {
//       const userId = invoice.user._id.toString();
//       const dateFormatted =
//         `${invoice.invoiceDate.getMonth() + 1}`.padStart(2, "0") +
//         `/${invoice.invoiceDate.getFullYear()}`;
//       if (!acc[userId]) {
//         acc[userId] = {
//           name: `${invoice.user.name} ${invoice.user.lastName}`,
//           amounts: [],
//         };
//       }

//       // Add each invoice with the new date format
//       acc[userId].amounts.push({
//         date: dateFormatted,
//         amount: invoice.totalAmount,
//         invoiceType: invoice.invoiceType,
//       });

//       return acc;
//     }, {});

//     const result = Object.values(userDebts).map((user) => ({
//       ...user,
//       amounts: user.amounts.sort((a, b) => new Date(a.date) - new Date(b.date)), // Sort by date for better readability
//     }));

//     res.status(200).json({
//       success: true,
//       data: result,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "An error occurred while obtaining the report",
//     });
//   }
// };

const getDelinquentUsersReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Start and end dates are required",
      });
    }

    // Find all unpaid invoices within the given date range
    const unpaidInvoices = await Invoice.find({
      invoiceDate: { $gte: new Date(startDate), $lt: new Date(endDate) },
      paymentStatus: "pending",
    }).populate({
      path: "user",
      select: "name lastName",
    });

    // Check if there are less than 3 unpaid invoices
    if (unpaidInvoices.length < 3) {
      return res.status(200).json({
        success: true,
        message: "Not enough unpaid invoices to generate the report",
      });
    }

    // Find any related unpaid reconnection invoices
    const reconnectionInvoices = await ReconnectionInvoice.find({
      invoiceDate: { $gte: new Date(startDate), $lt: new Date(endDate) },
      paymentStatus: "pending",
    }).populate({
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

    // Combine and reduce the data
    const combinedInvoices = [
      ...unpaidInvoices.map((invoice) => ({
        ...invoice.toJSON(),
        invoiceType: "Regular",
      })),
      ...reconnectionInvoices.map((invoice) => ({
        ...invoice.toJSON(),
        user: invoice.meter.property.user, // Flatten the structure
        invoiceType: "Reconnection",
      })),
    ];

    const userDebts = combinedInvoices.reduce((acc, invoice) => {
      const userId = invoice.user._id.toString();
      const dateFormatted =
        `${invoice.invoiceDate.getMonth() + 1}`.padStart(2, "0") +
        `/${invoice.invoiceDate.getFullYear()}`;
      if (!acc[userId]) {
        acc[userId] = {
          name: `${invoice.user.name} ${invoice.user.lastName}`,
          amounts: [],
        };
      }

      // Add each invoice with the new date format
      acc[userId].amounts.push({
        date: dateFormatted,
        amount: invoice.totalAmount,
        invoiceType: invoice.invoiceType,
      });

      return acc;
    }, {});

    const result = Object.values(userDebts).map((user) => ({
      ...user,
      amounts: user.amounts.sort((a, b) => new Date(a.date) - new Date(b.date)), // Sort by date for better readability
    }));

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while obtaining the report",
    });
  }
};

module.exports = {
  getReport,
  getIncomes,
  getUnpaid,
  getSummary,
  getDelinquentUsersReport,
};
