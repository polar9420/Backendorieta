export const errorMiddleware = (error, req, res, next) => {
  res.json({
    status: error.status,
    message: error.message,
    cause: error.cause,
  })
}
