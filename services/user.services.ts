import { UserInterface } from "../types";
import User from "../models/user.model";
import {
  UserLoginRequestDto,
  UserLoginResponseDto,
  UserSignupRequestDto,
  UserSignupResponseDto,
} from "../dto/user.dto";
import bcrypt from "bcrypt";
import { createToken } from "../utils/token";
import { GenerateOTP } from "../utils/otp";

export const createUser: (
  user: UserSignupRequestDto,
) => Promise<UserSignupResponseDto> = async (user) => {
  try {
    const fetchedUser = await getUserByEmailOrPhone(user.email, user.phone);

    if (fetchedUser) {
      return {
        message: "Email or Phone No is already in use.",
        success: false,
      } as UserSignupResponseDto;
    }

    // Hash the password before saving to the database
    const salt: string = await bcrypt.genSalt(10);
    const hashedPassword: string = await bcrypt.hash(user.password, salt);
    const otp: string = GenerateOTP();

    const username = user.name.concat(otp).split(" ").join("").toLowerCase();

    const newUser = await User.create({
      ...user,
      username,
      password: hashedPassword,
      userType: "user",
      accountCreationDate: new Date(),
      lastLoginDate: new Date(),
      isVerified: false,
    });

    // Generate the jwt token
    const token: string = createToken(newUser._id, newUser.email);

    const response: UserSignupResponseDto = {
      message: "User Created",
      success: true,
      token,
      otp,
    };

    return response;
  } catch (e) {
    console.log("Error while creating user", e);
    throw e;
  }
};

export const loginUser = async (user: UserLoginRequestDto) => {
  try {
    const fetchedUser = await getUserByEmailOrPhone(
      user.emailOrPhone,
      user.emailOrPhone,
    );
    if (!fetchedUser) {
      return {
        message: "Invalid credentials.",
        success: false,
      } as UserLoginResponseDto;
    }

    const isMatch: boolean = await bcrypt.compare(
      fetchedUser.password,
      user.password,
    );
    if (!isMatch) {
      return {
        message: "Invalid Credentials",
        success: false,
      };
    }
    const token: string = createToken(fetchedUser._id, fetchedUser.email);

    const response: UserLoginResponseDto = {
      message: "User Created",
      success: true,
      token,
    };

    return response;
  } catch (e) {
    console.log("Error while logging in user", e);
    throw e;
  }
};

export const getUserByEmail = async (email: UserInterface["email"]) => {
  try {
    return User.findOne({ email });
  } catch (e) {
    console.log("Error while fetching user", e);
    throw e;
  }
};

export const getUserByEmailOrPhone = async (
  email: UserInterface["email"],
  phone: UserInterface["phone"],
) => {
  try {
    return User.findOne({
      $or: [{ email }, { phone }],
    });
  } catch (e) {
    console.log("Error while fetching user", e);
    throw e;
  }
};

export const getUser = async (userId: UserInterface["_id"]) => {
  try {
    return User.findById(userId);
  } catch (e) {
    console.log("Error while fetching user", e);
    throw e;
  }
};

export const getUserExceptPasswordAndOTP = async (
  userId: UserInterface["_id"],
) => {
  try {
    return User.findById(userId).select("-password -otp");
  } catch (e) {
    console.log("Error while fetching user", e);
    throw e;
  }
};
