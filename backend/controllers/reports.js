const Invoice = require("../models/Invoice");

const getIncomes = async (req, res) => {
  try {
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



module.exports = {
  getIncomes,
  getUnpaid,
};
