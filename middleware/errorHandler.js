//Express needs the err to be there to use this as an error handler
export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500; // Demand a status code
  res.status(statusCode);

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack, //When you deploy NODE_ENV will be "production". Stack here is a stack trace.
    // You don't want a detailed response in production -- the user will see this.
  });
};
