const asyncHandler = (requestHandler) => async (req, res, next) => {
  Promise.resolve(requestHandler(req, res, next)).catch((error) => {
    console.log("Error occured at async Handler : ", error);
  });
};

export default asyncHandler;
