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
  price: 1000,
};

const invalidProduct = {
  description: "Good phone",
  price: 1000,
};

const updatedProduct = {
  name: "iPad",
  description: "Great tablet",
  price: "1250",
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
  test("MONGO_TEST_URL is defined", () => {
    expect(process.env.MONGO_TEST_URL).toBeDefined();
  });

  // 1
  test("fetching all the producsts returns a response body & status code 200", async () => {
    const res = await client.get("/products").expect(200);
    expect(res.body).toBeDefined();
  });

  //2
  test("creating a product is successful & returns status code 201", async () => {
    const res = await client.post("/products").send(validProduct).expect(201);
    expect(res.body._id).toBeDefined();
  });

  test("creating an invalid product returns status code 400", async () => {
    await client.post("/products").send(invalidProduct).expect(400);
  });

  //3
  test("check a product with the specific ID is existed & returns it after found with a status 200", async () => {
    const res = await client.get(`/products/${validProductID}`).expect(200);
    expect(res.body._id).toBe(validProductID);
  });

  test("fetch with a non-existing ID returns status code 404 & response body is undefined", async () => {
    const res = await client
      .get("/products/6436b1eb07ea3ce7806d1457")
      .expect(404);
    expect(res.body.message).toBe(
      "Product with id 6436b1eb07ea3ce7806d1457 not found!"
    );
  });

  //4
  test("delete with an ID returns status code 204", async () => {
    await client.delete(`/products/${validProductID}`).expect(204);
  });

  test("delete with a non-existing ID returns status code 404", async () => {
    await client.delete("/products/6436b1eb07ea3ce7806d1457").expect(404);
  });

  //5 DOES THE ORDER MATTER???
  test("update a product with its ID returns status code 200", async () => {
    await client
      .put(`/products/${validProductID}`)
      .send(updatedProduct)
      .expect(200);
  });

  test("updating a product changes the properties of the product in DB", async () => {
    const res = await client
      .put(`/products/${validProductID}`)
      .send(updatedProduct);
    expect(res.body.name).not.toBe(validProduct.name);
  });

  test("typeof name in response body is string after updating", async () => {
    const res = await client
      .put(`/products/${validProductID}`)
      .send(updatedProduct);
    expect(typeof res.body.name).toBe("string");
  });

  test("update with a non-existing ID returns status code 404", async () => {
    await client.put("/products/6436b1eb07ea3ce7806d1457").expect(404);
  });
});
