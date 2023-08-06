import { JWT_SECRET } from "../config.js"
import {
  sendMailChangedPassword,
  sendMailResetPassword,
  sendMailUserDeleted,
} from "../libs/mailer.js"
import UserModel from "../models/User.js"
import { createHash } from "../utils.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

export const restoreService = async (email, password) => {
  try {
    const user = await UserModel.findOne({ email })
    if (!user) {
      throw new Error("user does not exist")
    }

    const hashedPassword = createHash(password)

    const updateUser = await UserModel.updateOne(
      { email },
      { password: hashedPassword },
      {
        new: true,
      }
    )

    return updateUser
  } catch (error) {
    throw new Error(error)
  }
}

export const recoverPasswordService = async (email) => {
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
    // Probar con el objeto URI
    const parsedToken = token.replace(/\./g, "dot")

    await sendMailResetPassword(email, parsedToken)

    return { status: "ok", message: "email sent" }
  } catch (error) {
    throw new Error(error)
  }
}

export const newPasswordService = async (token, newPassword) => {
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
    return { status: "ok", message: "password changed" }
  } catch (error) {
    throw new Error(error)
  }
}

export const changePremiumRoleService = async (id, userEmail) => {
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

    return { status: "ok", message: "role changed" }
  } catch (error) {
    throw new Error(error)
  }
}

export const getAllUsersService = async () => {
  try {
    const users = await UserModel.find(
      {},
      { password: 0, age: 0, cartId: 0, resetToken: 0 }
    )
    return users
  } catch (error) {
    throw new Error(error)
  }
}

export const deleteInactiveUsersService = async () => {
  try {
    // Eliminamos los usuarios inactivos por 2 dias que tengan rol de user y premium y enviamos un email
    const users = await UserModel.find({
      role: { $in: ["user", "premium"] },
      lastActive: { $lt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    })

    const deletedUsers = await UserModel.deleteMany({
      role: { $in: ["user", "premium"] },
      lastActive: { $lt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    })

    await Promise.all(
      users.map(async (user) => {
        await sendMailUserDeleted(user.email)
      })
    )

    return users
  } catch (error) {
    throw new Error(error)
  }
}

export const getUserByIdService = async (id) => {
  try {
    const user = await UserModel.findById(id, {
      password: 0,
      age: 0,
      cartId: 0,
      resetToken: 0,
    })
    if (!user) {
      throw new Error("user does not exist")
    }

    return user
  } catch (error) {
    throw new Error(error)
  }
}

export const deleteUserByIdService = async (id) => {
  try {
    const user = await UserModel.findByIdAndDelete(id)
    if (!user) {
      throw new Error("user does not exist")
    }

    return user
  } catch (error) {
    throw new Error(error)
  }
}

export const updateUserByIdService = async (id, data) => {
  try {
    const user = await UserModel.findByIdAndUpdate(id, data, {
      new: true,
    })
    if (!user) {
      throw new Error("user does not exist")
    }

    return user
  } catch (error) {
    throw new Error(error)
  }
}
