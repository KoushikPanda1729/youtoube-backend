import asyncHandler from "../utils/asyncHandler.util.js";
import ApiError from "./../utils/apiError.util.js";
import { User } from "./../models/user.model.js";
import uploadOnCloudinary, {
  deleteFromCloudinary,
} from "./../utils/cloudinary.util.js";
import ApiResponce from "./../utils/apiResponce.util.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessTokenAndRefreshToken = async (userId) => {
  const user = await User.findById(userId);
  const refreshToken = user.refreshTokenGenerate();
  const accessToken = user.accessTokenGenerate();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

const registerUser = asyncHandler(async (req, res) => {
  //get data from frontend
  const { userName, fullName, email, password } = req.body;

  //validate the data
  if (
    [userName, fullName, email, password].some(
      (field) => field?.trim().length === 0
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  //is user exists or not
  const existsUser = await User.findOne({
    $or: [{ userName }, { email }],
  });
  if (existsUser) {
    throw new ApiError(400, "User already exists");
  }

  // image local path
  if (!(req.files && Array.isArray(req.files?.avatar))) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;

  let coverImageLocalPath;
  if (req.files && Array.isArray(req.files?.coverImage)) {
    coverImageLocalPath = req.files?.coverImage[0]?.path;
  }

  // upload on cloudinary
  const avatarURL = await uploadOnCloudinary(avatarLocalPath);
  const coverImageURL = await uploadOnCloudinary(coverImageLocalPath);

  //create database
  const user = await User.create({
    userName: userName.toLowerCase(),
    email,
    fullName,
    password,
    avatar: avatarURL?.url,
    coverImage: coverImageURL?.url || "",
  });

  //created user
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  res
    .status(200)
    .json(new ApiResponce(200, createdUser, "user registerd successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;

  if (!(userName || email)) {
    throw new ApiError(400, "Username or email is required");
  }

  const user = await User.findOne({
    $or: [{ userName }, { email }],
  });

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid credincials");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponce(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User Logged in successfully"
      )
    );
});

const loggedOutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $unset: { refreshToken: null },
    },
    {
      new: true,
    }
  );

  // const user = await User.findById(req.user?._id);
  // user.refreshToken = undefined;
  // await user.save({ validateBeforeSave: false });

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponce(200, {}, "User logout successful"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incommingToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incommingToken) {
    throw new ApiError(400, "Unauthorized requests");
  }

  const decodedToken = jwt.verify(
    incommingToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decodedToken?._id);

  if (!user) {
    throw new ApiError(400, "Invalid User");
  }
  if (incommingToken !== user?.refreshToken) {
    throw new ApiError(400, "Expire token");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user?._id);

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponce(
        200,
        { accessToken, refreshToken },
        "Access token refreshed successfully"
      )
    );
});

const changePassword = asyncHandler(async (req, res) => {
  const { newPassword, confirmPassword, oldPassword } = req.body;

  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "Password must match");
  }
  const user = await User.findById(req.user?._id);

  const isPasswordValid = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponce(200, user, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);
  return res
    .status(200)
    .json(new ApiResponce(200, user, "Get current user successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName } = req.body;

  if (!fullName) {
    throw new ApiError(400, "Fullname is required");
  }

  // const user = await User.findById(req.user?._id);
  // user.fullName = fullName;
  // await user.save({ validateBeforeSave: false });

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: { fullName } },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponce(200, user, "Update user successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatarURL = await uploadOnCloudinary(avatarLocalPath);

  if (!avatarURL?.url) {
    throw new ApiError(400, "Cloudinary avatar is required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: { avatar: avatarURL?.url } },
    { new: true }
  );

  // console.log("New avatar >> ",avatarURL?.url);
  // console.log("Old avatar >> ",req.user?.avatar);

  if (req.user?.avatar) {
    const publicId = req.user.avatar.split("/").pop().split(".")[0];
    await deleteFromCloudinary(publicId);
  }

  return res
    .status(200)
    .json(new ApiResponce(200, user, "Avatar update successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;
  if (!coverImageLocalPath) {
    throw new ApiError(400, "cover image is required");
  }

  const coverImageURL = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImageURL?.url) {
    throw new ApiError(400, "Cloudinary coverImage is required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: { coverImage: coverImageURL?.url } },
    { new: true }
  );

  // console.log("New image >> ", coverImageURL?.url);
  // console.log("Old image >> ", req.user?.coverImage);

  if (req.user?.coverImage) {
    const publicId = req.user.coverImage.split("/").pop().split(".")[0];
    await deleteFromCloudinary(publicId);
  }

  return res
    .status(200)
    .json(new ApiResponce(200, user, "cover image update successfully"));
});

const getUserProfileDetail = asyncHandler(async (req, res) => {
  const { userName } = req.params;

  if (!userName) {
    throw new ApiError(400, "Username not found");
  }

  // Aggregate pipeline to fetch user profile details
  const channel = await User.aggregate([
    {
      $match: { userName: userName?.toLowerCase() }, // Match the username (case insensitive)
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribeTo", // Populate subscribeTo array
      },
    },
    {
      $addFields: {
        subscriberCount: {
          $size: "$subscribers", // Count the number of subscribers
        },
        subscribeToCount: {
          $size: "$subscribeTo", // Count the number of subscriptions
        },
        isSubscribe: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] }, // Check if user is subscribed
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        userName: 1,
        email: 1,
        avatar: 1,
        coverImage: 1,
        subscriberCount: 1,
        subscribeToCount: 1,
        isSubscribe: 1,
      },
    },
  ]);

  if (!channel?.length) {
    throw new ApiError(400, "Channel does not exist");
  }

  // Send the fetched channel details as a JSON response
  return res
    .status(200)
    .json(new ApiResponce(200, channel[0], "Channel fetched successfully"));
});

const getWatchHistory = asyncHandler(async (req, res) => {

  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user?._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    userName: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              woner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponce(200, user[0].watchHistory, "Get watch history successfully"));
});

export {
  registerUser,
  loginUser,
  loggedOutUser,
  refreshAccessToken,
  changePassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserProfileDetail,
  getWatchHistory,
};
