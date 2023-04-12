import supertest from "supertest";
import dotenv from "dotenv";
import mongoose from "mongoose";
import server from "../src/server.js";
import ProductsModel from "../src/api/products/model.js";

dotenv.config();

const client = supertest(server);

const validProduct = {
  name: "iPhone",
  description: "Good phone",
  price: 10000,
};

const invalidProduct = {
  description: "Good phone",
  price: 10000,
};

let validProductID;

// runs before all the tests
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST_URL);
  const product = new ProductsModel(validProduct);
  const { _id } = await product.save();
  validProductID = _id.toString();
});

// runs after all the tests are done
afterAll(async () => {
  await ProductsModel.deleteMany();
  await mongoose.connection.close();
});

describe("Test Products API", () => {
  // test & it does the same thing
  test("is MONGO_TEST_URL is defined", () => {
    expect(process.env.MONGO_TEST_URL).toBeDefined();
  });

  test("creating a product is successful & returns status code 201", async () => {
    const res = await client.post("/products").send(validProduct).expect(201);
    expect(res.body._id).toBeDefined();
  });

  test("posting an invalid product returns status code 400", async () => {
    await client.post("/products").send(invalidProduct).expect(400);
  });

  test("check a product with the specific id is existed & returns it after found with a status 200", async () => {
    const res = await client.get(`/products/${validProductID}`).expect(200);
    expect(res.body._id).toBe(validProductID);
  });
});
