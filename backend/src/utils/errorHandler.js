const errorHandler = {
    handleError: (error, req, res, next) => {
      console.error(error.stack);
      res.status(error.status || 500).json({
        message: error.message || 'Internal server error',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  };
  
  module.exports = errorHandler;