import { User } from "../models/user.model.js";
import ApiError from "../utils/apiError.util.js";
import ApiResponce from "../utils/apiResponce.util.js";
import asyncHandler from "../utils/asyncHandler.util.js";
import uploadOnCloudinary from "../utils/cloudinary.utils.js";
import jwt from "jsonwebtoken";

const accessTokeAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToke = await user.generateRefreshToken();

    user.refreshToke = refreshToke;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToke };
  } catch (error) {
    throw new ApiError(
      400,
      "Somthing went wrong while genaration access token and refresh token"
    );
  }
};

const registerUserController = asyncHandler(async (req, res, next) => {
  //get data from frontend
  const { userName, email, password, fullName } = req.body;

  //valudate the data

  if (
    [userName, email, password, fullName].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  //find the use is exist or not
  const existUser = await User.findOne({
    $or: [{ userName }, { email }],
  });
  if (existUser) {
    throw new ApiError(400, "User is already exists");
  }

  // get local file path
  if (!Array.isArray(req.files.avatar)) {
    throw new ApiError(400, "Avatar is required");
  }
  const avatarLocalPath = req?.files?.avatar[0]?.path;

  let coverImageLocalPath;
  if (Array.isArray(req?.files?.coverImage)) {
    coverImageLocalPath = req?.files?.coverImage[0]?.path;
  }

  // Upload them on cloudinary

  const avatarCloudinaryResponce = await uploadOnCloudinary(avatarLocalPath);
  const coverImageCloudinaryResponce =
    await uploadOnCloudinary(coverImageLocalPath);

  if (!avatarCloudinaryResponce) {
    throw new ApiError(400, "Avatar response does not get from cloudinary");
  }
  // Create Database

  const createUser = await User.create({
    fullName,
    userName: userName.toLowerCase(),
    email,
    password,
    avatar: avatarCloudinaryResponce?.url,
    coverImage: coverImageCloudinaryResponce?.url || "",
  });

  const user = await User.findById(createUser._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .json(new ApiResponce(200, user, "User registered successfully"));
});

const loginUserController = asyncHandler(async (req, res, next) => {
  //get data
  const { userName, email, password } = req.body;

  //validate
  if (!(userName || email)) {
    throw new ApiError(400, "userName or password is required");
  }

  // find user
  const user = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (!user) {
    throw new ApiError(400, "User does not exists");
  }

  //validate password
  const validatePassword = await user.isPasswordCorrect(password);
  if (!validatePassword) {
    throw new ApiError(400, "Wrong user credencials");
  }

  // access token and refresh token
  const { accessToken, refreshToke } = await accessTokeAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const option = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToke", refreshToke, option)
    .json(
      new ApiResponce(
        200,
        {
          user: { accessToken, refreshToke, loggedInUser },
        },
        "User logged in successfully"
      )
    );
});

const logOutUserController = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToke: undefined },
    },
    {
      new: true,
    }
  );
  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToke", option)
    .json(new ApiResponce(200, {}, "User logged Out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res, next) => {
  try {
    const incomingRefreshToken =
      req?.cookies?.refreshToke || req.body.refreshToke;

    if (!incomingRefreshToken) {
      throw new ApiError(400, "Unauthorized request");
    }

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);
console.log(decodedToken);
    if (!user) {
      throw new ApiError(400, "Invalide refresh Token");
    }
    // console.log(incomingRefreshToken);
    // console.log(user?.refreshToken);
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(400, "Refresh token is expired");
    }

    const option = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, newRefreshToke } = await accessTokeAndRefreshToken(
      user?._id
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, option)
      .cookie("refreshToke", newRefreshToke, option)
      .json(
        new ApiResponce(
          200,
          { accessToken, refreshToke: newRefreshToke },
          "Refresh token generate successfully"
        )
      );
  } catch (error) {
    throw new ApiError(
      400,
      error.message || "Somthing went wrong while generating refresh token"
    );
  }
});
export default registerUserController;
export { loginUserController, logOutUserController, refreshAccessToken };
