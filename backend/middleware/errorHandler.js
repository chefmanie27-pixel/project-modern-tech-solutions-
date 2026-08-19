// middleware/errorHandler.js
// Catches errors thrown/passed via next(err) anywhere in the app
// and returns a consistent JSON response instead of a raw stack trace.
// Must be registered LAST in server.js, after all routes.

function errorHandler(err, req, res, next) {
  console.error(err);

  const status = err.status || 500;
  const message =
    process.env.NODE_ENV === "production" && status === 500
      ? "Something went wrong"
      : err.message;

  res.status(status).json({ message });
}

module.exports = errorHandler;
