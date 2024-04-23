import request from "supertest";

import server, { app } from "../index";

import { dbConnection } from "../db_connection/connection";
import Admin from "../models/admin.model";

describe("Register Admin", () => {
  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    await dbConnection();
    await Admin.deleteMany({});
  });

  const requestBody = {
    name: "Susan Khadka",
    email: "susankhadka@gmail.com",
    password: "12345678",
  };

  it("should register a new admin and store in the database", async () => {
    const response = await request(app)
      .post("/api/v1/admin/register")
      .send(requestBody);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "Admin Created",
      success: true,
      token: expect.any(String),
      otp: expect.any(String),
    });
  });

  it("Shouldn't register the admin with existing email", async () => {
    const response = await request(app)
      .post("/api/v1/admin/register")
      .send(requestBody);

    expect(response.status).toBe(400);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Admin already exists",
        success: false,
      })
    );
  });
});

describe("Login Admin", () => {
  it("Should login the admin", async () => {
    const requestBody = {
      email: "susankhadka@gmail.com",
      password: "12345678",
    };

    const response = await request(app)
      .post("/api/v1/admin/login")
      .send(requestBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Login Successful",
        success: true,
        token: expect.any(String),
      })
    );
  });

  it("Shouldn't login the admin with invalid credentials", async () => {
    const requestBody = {
      email: "susankhadka1@gmail.com",
      password: "12345678",
    };

    const response = await request(app)
      .post("/api/v1/admin/login")
      .send(requestBody);

    expect(response.status).toBe(401);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Invalid Credentials",
        success: false,
      })
    );
  });
  afterAll((done) => {
    server.close(done);
  });
});
