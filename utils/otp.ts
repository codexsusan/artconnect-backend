import otpGenerator from "otp-generator";

export const GenerateOTP = () => {
  return otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
  });
};
