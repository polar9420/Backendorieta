import request from "supertest"
import { app } from "../app.js"
import { connectDB, disconnectDB } from "../config.js"
import UserModel from "../models/User.js"

const newUser = {
  first_name: "Pepito",
  last_name: "Perez",
  email: "pepitoperez@gmail.com",
  age: 30,
  password: "1234",
}

let agent = request.agent(app)

describe("Users endpoints", () => {
  beforeAll(async () => {
    await connectDB()
  })

  beforeEach(async () => {
    await UserModel.deleteMany()
  })

  afterAll(async () => {
    await UserModel.deleteMany()
    await disconnectDB()
  })

  describe("POST /api/sessions/register", () => {
    test("should create a new user", async () => {
      const response = await request(app)
        .post("/api/sessions/register")
        .send(newUser)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty("first_name", newUser.first_name)
      expect(response.body).toHaveProperty("last_name", newUser.last_name)
      expect(response.body).toHaveProperty("email", newUser.email)
      expect(response.body).toHaveProperty("age", newUser.age)
      expect(response.body).toHaveProperty("role", "user")
    })

    test("should return an error if the user already exists", async () => {
      await request(app).post("/api/sessions/register").send(newUser)

      const response = await request(app)
        .post("/api/sessions/register")
        .send(newUser)

      expect(response.status).toBe(302)
    })
  })

  describe("POST /api/sessions/login", () => {
    test("should login a user", async () => {
      await request(app).post("/api/sessions/register").send(newUser)

      const response = await request(app)
        .post("/api/sessions/login")
        .send(newUser)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty("first_name", newUser.first_name)
      expect(response.body).toHaveProperty("last_name", newUser.last_name)
      expect(response.body).toHaveProperty("email", newUser.email)
      expect(response.body).toHaveProperty("age", newUser.age)
      expect(response.body).toHaveProperty("role", "user")
    })

    test("should return an error if the user does not exist", async () => {
      const response = await request(app)
        .post("/api/sessions/login")
        .send(newUser)

      expect(response.status).toBe(302)
    })
  })

  describe("GET /api/sessions/getuser", () => {
    test("should return the user logged in", async () => {
      await request(app).post("/api/sessions/register").send(newUser)

      await agent.post("/api/sessions/login").send(newUser)

      const response = await agent.get("/api/sessions/getuser")

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty("first_name", newUser.first_name)
      expect(response.body).toHaveProperty("last_name", newUser.last_name)
      expect(response.body).toHaveProperty("email", newUser.email)
      expect(response.body).toHaveProperty("age", newUser.age)
      expect(response.body).toHaveProperty("role", "user")
    })

    test("should return an error if the user is not logged in", async () => {
      const response = await request(app).get("/api/sessions/getuser")

      expect(response.status).toBe(401)
      expect(response.body).toHaveProperty("error")
    })
  })

  describe("POST /api/sessions/logout", () => {
    test("should return an error if the user is not logged in", async () => {
      const response = await request(app).post("/api/sessions/logout")

      expect(response.status).toBe(302)
    })
  })
})
