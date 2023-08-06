import request from "supertest"
import { app } from "../app.js"
import { connectDB, disconnectDB } from "../config.js"
import UserModel from "../models/User.js"
import ProductModel from "../models/Product.js"

const newUser = {
  first_name: "Pepito",
  last_name: "Perez",
  email: "pepitoperez2@gmail.com",
  age: 30,
  password: "1234",
}

const newProduct = {
  title: "Producto de prueba",
  description: "Descripción de prueba",
  price: 100,
  category: "deporte",
  stock: 10,
  code: "1234",
  thumbnail:
    "https://cdn3.iconfinder.com/data/icons/education-209/64/bus-vehicle-transport-school-128.png",
}

let agent = request.agent(app)

describe("Products endpoints", () => {
  beforeAll(async () => {
    await connectDB()
  })

  beforeEach(async () => {
    await UserModel.deleteMany()
    await ProductModel.deleteMany()
  })

  afterEach(async () => {
    await UserModel.deleteMany()
    await ProductModel.deleteMany()
  })

  afterAll(async () => {
    await UserModel.deleteMany()
    await ProductModel.deleteMany()
    await disconnectDB()
  })

  describe("GET /api/products", () => {
    test("should get all products", async () => {
      const response = await request(app).get("/api/products")

      expect(response.status).toBe(200)
    })
  })

  describe("POST /api/products", () => {
    test("should create a new product", async () => {
      const response = await request(app)
        .post("/api/sessions/register")
        .send(newUser)

      await UserModel.findByIdAndUpdate(response.body._id, { role: "admin" })

      const loginResponse = await agent
        .post("/api/sessions/login")
        .send(newUser)

      const productResponse = await agent.post("/api/products").send(newProduct)

      expect(productResponse.status).toBe(201)
      expect(productResponse.body).toHaveProperty("title", newProduct.title)
      expect(productResponse.body).toHaveProperty(
        "description",
        newProduct.description
      )
      expect(productResponse.body).toHaveProperty("price", newProduct.price)
      expect(productResponse.body).toHaveProperty("stock", newProduct.stock)
      expect(productResponse.body).toHaveProperty("code", newProduct.code)
      expect(productResponse.body).toHaveProperty(
        "thumbnail",
        newProduct.thumbnail
      )
    })
  })

  describe("GET /api/products/:id", () => {
    let productId
    beforeEach(async () => {
      const doc = await ProductModel.create(newProduct)
      productId = doc._id
    })

    test("should get a product by id", async () => {
      const response = await request(app).get(`/api/products/${productId}`)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty("title", newProduct.title)
      expect(response.body).toHaveProperty(
        "description",
        newProduct.description
      )
      expect(response.body).toHaveProperty("price", newProduct.price)
      expect(response.body).toHaveProperty("stock", newProduct.stock)
      expect(response.body).toHaveProperty("code", newProduct.code)
      expect(response.body).toHaveProperty("thumbnail", newProduct.thumbnail)
    })
  })
})
