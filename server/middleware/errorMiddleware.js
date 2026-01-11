const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    ok: false,
    error: {
      code: 'SERVER_ERROR',
      message: err.message || 'Internal Server Error'
    }
  });
};

const notFound = (req, res, next) => {
  res.status(404).json({
    ok: false,
    error: {
      code: 'NOT_FOUND',
      message: `Not Found - ${req.originalUrl}`
    }
  });
};

module.exports = { errorHandler, notFound };
