const handleError = (err, errorCode, req, res, next) => {
  if (err) {
    res.status(errorCode || 500).json({
      status: "error",
      message: err.message,
    })
  }
}

export { handleError }
