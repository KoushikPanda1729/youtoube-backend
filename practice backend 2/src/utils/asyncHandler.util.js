const asyncHandler = (requestHandler) => async (req, res, next) => {
  Promise.resolve(requestHandler(req, res, next)).catch((error) => {
    console.log("Error occured at asyncHandler :: ", error);
    return next(error);
  });
};



// ============================
// const asyncHandler = (requestHandler) => async (req, res, next) => {
//   try {
//     await requestHandler(req, res, next);
//   } catch (error) {
//     // res.status(400).json({
//     //   success: false,
//     //   message: error.message || "somthing went wrong",
//     // });
//     return next(error);
//   }
// };

export default asyncHandler;
