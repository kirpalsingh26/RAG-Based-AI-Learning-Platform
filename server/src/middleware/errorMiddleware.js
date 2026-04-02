export const notFound = (req, res, _next) => {
  res.status(404).json({
    message: `Route not found: ${req.originalUrl}`,
  });
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (error, _req, res, _next) => {
  const statusCode = res.statusCode >= 400 ? res.statusCode : 500;

  res.status(statusCode).json({
    message: error.message || 'Unexpected server error',
    stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
  });
};
