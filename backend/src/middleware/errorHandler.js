import { StatusCodes, getReasonPhrase } from "http-status-codes";

export const notFound = (req, res, _next) => {
  res
    .status(StatusCodes.NOT_FOUND)
    .json({ message: `Route not found: ${req.originalUrl}` });
};

export const errorHandler = (err, req, res, _next) => {
  console.error(err);
  const status = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || getReasonPhrase(status);
  res.status(status).json({ message });
};
