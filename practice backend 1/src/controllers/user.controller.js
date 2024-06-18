import User from "../models/user.model.js";
import uploadOnCloudinary from "../utils/Cloudinary.util.js";
import ApiError from "../utils/apiError.util.js";
import ApiResponce from "../utils/apiResponce.util.js";
import asyncHandler from "../utils/asyncHandler.util.js";

const generateAccessTokenAndRefreshToken = async (userId) => {
  const user = await User.findById(userId);
  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  user.refreshToke = refreshToken;

  user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const registerUser = asyncHandler(async (req, res, next) => {
  // get data from frontend
  const { userName, email, password, fullName } = req.body;
  //Validate the data
  if (
    [userName, email, password, fullName].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  //check the user is already exist or not

  const existsUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existsUser) {
    throw new ApiError(400, "User is already exists");
  }

  //get the local file path
  if (!Array.isArray(req.files.avatar)) {
    throw new ApiError(400, "Avatar is required");
  }
  const avatarLocalPath = req?.files?.avatar[0]?.path;

  let coverImageLocalPath;
  if (Array.isArray(req?.files?.coverImage)) {
    coverImageLocalPath = req?.files?.coverImage[0]?.path;
  }

  // get url from cloudinary

  const avatarCloudinaryResponce = await uploadOnCloudinary(avatarLocalPath);
  const coverImageCloudinaryResponce =
    await uploadOnCloudinary(coverImageLocalPath);
  if (!avatarCloudinaryResponce) {
    throw new ApiError(400, "Avatar is required from Cloudinary");
  }

  // Create database
  const createUser = await User.create({
    userName: userName.toLowerCase(),
    fullName,
    email,
    password,
    coverImage: coverImageCloudinaryResponce?.url || "",
    avatar: avatarCloudinaryResponce?.url,
  });

  const user = await User.findById(createUser._id).select(
    "-password -refreshToke"
  );

  res
    .status(200)
    .json(new ApiResponce(200, user, "User register successfully"));
});

const loginUser = asyncHandler(async (req, res, next) => {
  // get the data
  const { userName, email, password } = req.body;

  if (!(userName || email)) {
    throw new ApiError(400, "Username or email is required");
  }
  //find user
  const user = await User.findOne({
    $or: [{ userName }, { email }],
  });
  //validate password
  const validatePassword = await user.isPasswordCorrect(password);

  if (!validatePassword) {
    throw new ApiError(400, "Invalid user crdentials");
  }
  if (!user) {
    throw new ApiError(400, "User does not exists");
  }

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToke"
  );

  //access token refresh token
  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);
  const option = {
    httpOnly: true,
    secure: true,
  };
  //send it in cookies
  res
    .status(201)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
      new ApiResponce(
        200,
        { user: { accessToken, refreshToken, loggedInUser } },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res, next) => {
//   const user = await User.findByIdAndUpdate(
//     req.user?._id,
//     {
//       $set: { refreshToke: undefined },
//     },
//     { new: true }
//   );

    const user = await User.findById(req?.user?._id).select("-password");
    user.refreshToke = undefined;
    user.save({ validateBeforeSave: false });

  const option = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(new ApiResponce(200, {}, "User logged out successfully"));
});

export { registerUser, loginUser, logoutUser };
