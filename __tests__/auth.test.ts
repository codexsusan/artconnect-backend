import request from "supertest";
import bcrypt from "bcrypt";

import { app } from "../index";
import User from "../models/user.model";
import server from "../index";
import { dbConnection } from "../db_connection/connection";

let token = "";

describe("Register User", () => {
  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    await dbConnection();
    await User.deleteMany({});
  });

  const requestBody = {
    name: "John Doe",
    email: "susankhadka@gmail.com",
    phone: "7622070652",
    password: "12345678",
    deviceToken:
      "fLoYl44LSC-0NY7oUA_GVy:APA91bEZrRbHtIg_KemkiFyjXhX9f9V-1h1cyl_7ps4duzeeG1kg3feRsSIs8wJCNQlfQr5zUyR3_smG2Dnl88bJhB1v_jTicl6FHKedTPh_m8FRPyadeoqxJR4fVIFNdKYuyBFLlaKa",
  };

  it("should register a new user and store in the database", async () => {
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(requestBody);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "User Created",
        success: true,
        token: expect.any(String),
        otp: expect.any(String),
      })
    );
    const user = await User.findOne({ email: requestBody.email });
    expect(user).toBeTruthy();
    expect(user?.name).toBe(requestBody.name);
    expect(user?.phone).toBe(`+91 ${requestBody.phone}`);
  });

  it("Shouldn't register the user with existing email, phone", async () => {
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(requestBody);

    expect(response.status).toBe(400);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Email or Phone No is already in use.",
        success: false,
      })
    );
  });
});

describe("Login User", () => {
  it("should login the user", async () => {
    const requestBody = {
      email: "susankhadka@gmail.com",
      password: "12345678",
    };

    const response = await request(app)
      .post("/api/v1/auth/login")
      .send(requestBody);

    token = response.body.token;

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Login Successful",
        success: true,
        token: expect.any(String),
      })
    );
  });

  it("shouldn't login the user with wrong email/password", async () => {
    const requestBody = {
      email: "susankhadka@gmail.com",
      password: "123456789",
    };

    const response = await request(app)
      .post("/api/v1/auth/login")
      .send(requestBody);

    expect(response.status).toBe(401);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Invalid Credentials",
        success: false,
      })
    );
  });
});

describe("Password Manager", () => {
  it("Allow logged in user to reset password", async () => {
    const requestBody = { oldPassword: "12345678", newPassword: "1234567890" };

    const response = await request(app)
      .post("/api/v1/auth/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send(requestBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Password updated successfully.",
        success: true,
      })
    );

    const updatedUser = await User.findOne({ email: "susankhadka@gmail.com" });
    const isPasswordUpdated = await bcrypt.compare(
      requestBody.newPassword,
      updatedUser.password
    );
    expect(isPasswordUpdated).toBe(true);
  });

  it("Allow user to reset if user forgot pasword", async () => {
    const requestBody = { email: "susankhadka@gmail.com" };

    const response = await request(app)
      .post("/api/v1/auth/forget-password")
      .send(requestBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "OTP sent to your email",
      success: true,
      otp: expect.any(String),
    });

    const verifyOTPResponse = await request(app)
      .post("/api/v1/auth/verify-otp")
      .send({ ...requestBody, otp: response.body.otp });

    expect(verifyOTPResponse.status).toBe(200);
    expect(verifyOTPResponse.body).toEqual({
      message: "User Verified",
      success: true,
    });

    const resetPasswordResponse = await request(app)
      .post("/api/v1/auth/reset-password")
      .send({ ...requestBody, password: "12345678" });

    expect(resetPasswordResponse.status).toBe(200);
    expect(resetPasswordResponse.body).toEqual({
      message: "Password updated successfully.",
      success: true,
    });

    const user = await User.findOne({ email: "susankhadka@gmail.com" });
    const isPasswordUpdated = await bcrypt.compare("12345678", user.password);
    expect(isPasswordUpdated).toBe(true);
  });

  it("Allow user to regenerate OTP", async () => {
    const requestBody = {
      email: "susankhadka@gmail.com",
    };

    const response = await request(app)
      .post("/api/v1/auth/regenerate-otp")
      .send(requestBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "OTP sent to your email",
      success: true,
      otp: expect.any(String),
    });
  });
  afterAll((done) => {
    server.close(done);
  });
});
