import { UserInterface } from "../types";

export interface UserDto {
  email: UserInterface["email"];
  password: UserInterface["password"];
}

export interface UserSignupRequestDto extends UserDto {
  name: UserInterface["name"];
  phone: UserInterface["phone"];
}

export interface UserSignupResponseDto {
  message: string;
  success: boolean;
  token?: string;
  otp?: string;
}

export interface UserLoginRequestDto {
  emailOrPhone: string;
  password: UserInterface["password"];
}

export interface UserLoginResponseDto {
  message: string;
  success: boolean;
  token?: string;
}
