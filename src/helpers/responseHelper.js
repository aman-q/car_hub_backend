export const sendSuccess = (res, message, data = {}, statusCode = 200) => {
    return res.status(statusCode).json({
      message,
      ...data,
    });
  };

  export const sendError = (res, message, error = null, statusCode = 500) => {
    return res.status(statusCode).json({
      message,
      error,
    });
  }