const handleHttpError = (res, message = "Something happened", code = 500) => {
  res.status(code).json({
    success: false,
    error: {
      message,
      code,
    },
  });
};

module.exports = { handleHttpError };
