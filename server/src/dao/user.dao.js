import { JWT_SECRET } from "../config.js"
import {
  sendMailChangedPassword,
  sendMailResetPassword,
} from "../libs/mailer.js"
import { Logger } from "../logger/index.js"
import UserModel from "../models/User.js"
import { createHash } from "../utils.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

class UserDao {
  async getAllUsers() {
    try {
      const users = await UserModel.find()
      return users
    } catch (error) {
      console.log(`Error en getAllUsers: ${error.message}`)
    }
  }

  async getUserById(id) {
    try {
      const user = await UserModel.findById(id)
      return user
    } catch (error) {
      console.log(`Error en getUserById: ${error.message}`)
    }
  }

  async getUserByEmail(email) {
    try {
      const user = UserModel.findOne({ email })
      return user
    } catch (error) {
      console.log(`Error en getUserByEmail: ${error.message}`)
    }
  }

  async createUser(user) {
    try {
      const newUser = await UserModel.create(user)
      return newUser
    } catch (error) {
      console.log(`Error en createUser: ${error.message}`)
    }
  }

  async restoreUserPassword(email, password) {
    try {
      const user = await UserModel.findOne({ email })
      if (!user) {
        throw new Error("user does not exist")
      }

      const hashedPassword = createHash(password)

      await UserModel.updateOne({ email }, { password: hashedPassword })

      return { status: "sucess", message: "succesfully updated password" }
    } catch (error) {
      console.log(error)
    }
  }

  async recoverPassword(email) {
    try {
      const user = await UserModel.findOne({ email })
      if (!user) {
        throw new Error("user does not exist")
      }

      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
        },
        JWT_SECRET,
        { expiresIn: "1h" }
      )

      user.resetToken = token

      await user.save()

      // Replace the dot character with the string "dot" to avoid problems with url in the client
      const parsedToken = token.replace(/\./g, "dot")

      await sendMailResetPassword(email, parsedToken)

      return { status: "success", message: "email sent" }
    } catch (error) {
      Logger.error(error)
    }
  }

  async newPassword(token, newPassword) {
    try {
      const parsedToken = token.replace(/dot/g, ".")
      const user = await UserModel.findOne({ resetToken: parsedToken })
      if (!user) {
        throw new Error("Token is invalid")
      }

      const decodedToken = jwt.verify(parsedToken, JWT_SECRET)
      if (!decodedToken) {
        throw new Error("invalid token")
      }

      const comparePass = await new Promise((resolve, reject) => {
        bcrypt.compare(newPassword, user.password, (err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      })

      if (comparePass) {
        throw new Error("new password must be different from the old one")
      }

      const hashedPassword = createHash(newPassword)

      user.password = hashedPassword
      user.resetToken = null

      await user.save()

      await sendMailChangedPassword(user.email)
      return { status: "success", message: "password changed" }
    } catch (error) {
      Logger.error(error)
      return { status: "error", message: error.message }
    }
  }

  async changePremiumRole(id, userEmail) {
    try {
      const user = await UserModel.findById(id)
      if (!user) {
        throw new Error("user does not exist")
      }

      if (user.role === "premium") {
        user.role = "user"
      } else if (user.role === "user") {
        user.role = "premium"
      } else {
        throw new Error("user role is not premium or user")
      }

      await user.save()

      return { status: "success", message: "role changed" }
    } catch (error) {
      Logger.error(error)
      return { status: "error", message: error.message }
    }
  }
}

const userDao = new UserDao()

export default userDao
