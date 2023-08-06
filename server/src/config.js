import mongoose from "mongoose"
import "dotenv/config"

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/ecommerce"
const TTL = process.env.TTL || 60 * 60 * 24 * 7
const SESSION_SECRET = process.env.SESSION_SECRET || "secret"
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET
const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
const MAIL_USER = process.env.MAIL_USER
const MAIL_PASSWORD = process.env.MAIL_PASSWORD
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
const ADMIN_PHONE_NUMBER = process.env.ADMIN_PHONE_NUMBER
const PROFESSOR_PHONE_NUMBER = process.env.PROFESSOR_PHONE_NUMBER
const ENVIROMENT = process.env.ENVIROMENT || "development"
const PORT = process.env.PORT || 8080
const CLUSTER = process.env.CLUSTER || "true"
const JWT_SECRET = process.env.JWT_SECRET || "secret"
const NODE_ENV = process.env.NODE_ENV || "development"
const MONGO_URL_TEST =
  process.env.MONGO_URL_TEST || "mongodb://127.0.0.1:27017/diegorietatesting"

const connectDB = async () => {
  try {
    if (NODE_ENV === "test") {
      await mongoose.connect(MONGO_URL_TEST)
      console.log("Base de datos conectada")
      return
    }
    await mongoose.connect(MONGO_URL)
    console.log("Base de datos conectada")
  } catch (error) {
    console.log("Error al inicia la conexion con la DB", error)
  }
}

const disconnectDB = async () => {
  try {
    await mongoose.disconnect()
  } catch (error) {
    console.error("Error al desconectarse de la DB", error)
  }
}

export {
  connectDB,
  disconnectDB,
  MONGO_URL,
  TTL,
  SESSION_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  MAIL_USER,
  MAIL_PASSWORD,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  ADMIN_PHONE_NUMBER,
  PROFESSOR_PHONE_NUMBER,
  ENVIROMENT,
  PORT,
  CLUSTER,
  JWT_SECRET,
  NODE_ENV,
}
