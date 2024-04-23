import request from "supertest";

import { app } from "../index";
import server from "../index";

import { dbConnection } from "../db_connection/connection";
import Artwork from "../models/artworks.model";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjI3MDE5MGFlYTczNGYyMTk1ODVhZDkiLCJlbWFpbCI6InN1c2Fua2hhZGthQGdtYWlsLmNvbSIsImlhdCI6MTcxMzgzMjMzNywiZXhwIjoxNzE0NDM3MTM3fQ.rv73sgZwR_tTHfoRdN99_JW9wzhN-pKwHKyi_V0_3AQ";

let artworkId = "";
describe("Artwork", () => {
  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    await dbConnection();
    await Artwork.deleteMany({});
  });
  it("should create a new artwork", async () => {
    const requestBody = {
      content: "Watercolor paintings",
      imageUrls: [
        "1708664292521-1.jpg",
        "1708664292539-Screenshot-from-2024-02-05-23-10-25.png",
      ],
      quantity: "3",
      isForSale: true,
      price: "80",
      categoryIds: ["65d868ed8c8eaa25489a4de8"],
    };

    const response = await request(app)
      .post("/api/v1/artwork/create")
      .set("Authorization", `Bearer ${token}`)
      .send(requestBody);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "Artwork has been created successfully.",
      success: true,
    });

    // artworkId = response.body.data._id;
  });

  it("should only allow authenticated users to create a new artwork", async () => {
    const requestBody = {
      content: "Watercolor paintings",
      imageUrls: [
        "1708664292521-1.jpg",
        "1708664292539-Screenshot-from-2024-02-05-23-10-25.png",
      ],
      quantity: "3",
      isForSale: true,
      price: "80",
      categoryIds: ["65d868ed8c8eaa25489a4de8"],
    };

    const response = await request(app)
      .post("/api/v1/artwork/create")
      .set("Authorization", `${token}`)
      .send(requestBody);

    expect(response.status).toBe(401 || 404);
    expect(response.body).toEqual({
      message: "Unauthorized" || "User not found.",
      success: false,
    });
  });

  it("should fetch all artworks", async () => {
    const response = await request(app)
      .get("/api/v1/artwork/fetch?page=1&limit=20")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Artworks fetched successfully.",
      success: true,
      limit: 20,
      page: 1,
      totalPages: expect.any(Number),
      total: expect.any(Number),
      data: expect.any(Array),
    });

    artworkId = response.body.data[0]._id;
  });

  it("should fetch artwork by id", async () => {
    const response = await request(app)
      .get(`/api/v1/artwork/fetch/${artworkId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Artwork fetched successfully.",
      success: true,
      data: expect.any(Object),
    });
  });

  it("should delete the artwork by artist only", async () => {
    const response = await request(app)
      .delete(`/api/v1/artwork/delete/${artworkId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Artwork deleted successfully.",
      success: true,
    });
  });

  it("switch like on an artwork", async () => {
    const requestBody = {
      artworkId,
    };

    const response = await request(app)
      .post("/api/v1/artwork/switch-like")
      .set("Authorization", `Bearer ${token}`)
      .send(requestBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Like removed successfully." || "Like added successfully.",
      success: true,
    });
  });

  afterAll((done) => {
    server.close(done);
  });
});
