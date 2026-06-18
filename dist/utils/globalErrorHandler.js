const globalErrorHandler = (err, req, res, next) => {
    res.status(500).json({
        success: false,
        message: err.message,
    });
};
export default globalErrorHandler;
//# sourceMappingURL=globalErrorHandler.js.map