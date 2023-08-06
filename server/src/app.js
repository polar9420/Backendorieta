import express from "express"
import cookieParser from "cookie-parser"
import session from "express-session"
import cors from "cors"
import MongoStore from "connect-mongo"
import { engine } from "express-handlebars"
import initializePassport from "./auth/passport.js"
import __dirname from "./utils.js"
import { handleError } from "./middlewares/error.js"

import { MONGO_URL, TTL, SESSION_SECRET } from "./config.js"

import cartRouter from "./routes/cart.routes.js"
import productsRouter from "./routes/products.routes.js"
import viewsRouter from "./routes/views.routes.js"
import sessionsRouter from "./routes/sessions.routes.js"
import usersRouter from "./routes/users.routes.js"
import morgan from "morgan"
import passport from "passport"
import swaggerJsdoc from "swagger-jsdoc"
import swaggerUiExpress from "swagger-ui-express"
import { updateLastActive } from "./middlewares/tracking.js"

// Crear servidor express
const app = express()

//middlewares
app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
)
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(morgan("dev"))
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: MONGO_URL,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: TTL,
    }),
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
  })
)
initializePassport()
app.use(passport.initialize())
app.use(passport.session())
app.use(updateLastActive)

//view engine
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", `${__dirname}/views`)

// Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Ecommerce API",
      description: "Documentacion de la API de Ecommerce",
      version: "1.0.0",
    },
  },
  apis: ["./**/*.yaml"],
}

const specs = swaggerJsdoc(swaggerOptions)
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

// Crear grupos de rutas
app.use("/api/sessions", sessionsRouter)
app.use("/api/users", usersRouter)
app.use("/api/products", productsRouter)
app.use("/api/cart", cartRouter)
app.use("/views", viewsRouter)
app.use("/", viewsRouter)
app.use(handleError)

export { app }
