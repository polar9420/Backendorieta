import winston from "winston"
import { ENVIROMENT } from "../config.js"

const levels = {
  fatal: 0,
  error: 1,
  warning: 2,
  info: 3,
  http: 4,
  debug: 5,
}

const level = () => {
  const isDevelopment = ENVIROMENT.toUpperCase() === "DEVELOPMENT"
  return isDevelopment ? "debug" : "info"
}

const colors = {
  fatal: "red",
  error: "red",
  warning: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
}

winston.addColors(colors)

const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
)

const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: "logs/error.log",
    level: "error",
  }),
  new winston.transports.File({
    filename: "logs/all.log",
  }),
]

export const Logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
})
