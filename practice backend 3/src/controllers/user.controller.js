import asyncHandler from "./../utils/asyncHandler.util.js";
import ApiError from "./../utils/apiError.util.js";
import { User } from "./../models/user.model.js";
import uplodaOnCloudinary from "../utils/cloudinary.util.js";
import ApiResponce from "./../utils/apiResponce.util.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, userName, email, password } = req.body;

  if (
    [fullName, userName, email, password].some(
      (field) => field.trim().length === 0
    )
  ) {
    throw new ApiError(200, "All fields are required");
  }

  const existsUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existsUser) {
    throw new ApiError(400, "User already exists");
  }

  //   console.log(req.files.avatar[0].path);
  if (!req.files && Array.isArray(req.files.avatar)) {
    throw new ApiError(400, "Avatar is required");
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;

  let coverImageLocalPath;
  if (req.files && Array.isArray(req.files.coverImage)) {
    coverImageLocalPath = req.files?.coverImage[0]?.path;
  }

  const avatarCloudinaryURL = await uplodaOnCloudinary(avatarLocalPath);
  const coverImageCloudinaryURL = await uplodaOnCloudinary(coverImageLocalPath);

  if (!avatarCloudinaryURL.url) {
    throw new ApiError(400, "Avatar url is required ");
  }

  const user = await User.create({
    fullName,
    email,
    password,
    userName: userName.toLowerCase(),
    avatar: avatarCloudinaryURL.url,
    coverImage: coverImageCloudinaryURL?.url || "",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(400, "Somthing went wrong while creating user");
  }

  return res
    .status(200)
    .json(new ApiResponce(200, "User register successfully", createdUser));
});

export default registerUser;
