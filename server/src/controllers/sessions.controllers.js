import { ADMIN_EMAIL } from "../config.js"
import UserDto from "../dto/user.dto.js"
import userRepository from "../repositories/users.repository.js"
import {
  changePremiumRoleService,
  newPasswordService,
  recoverPasswordService,
  restoreService,
} from "../services/user.services.js"

const register = async (req, res) => {
  res.status(200).json(req.user)
}

const login = async (req, res) => {
  try {
    const { user } = req

    if (!user) {
      return res.status(401).json({ status: "error", error: "Unauthorized" })
    }

    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
      role: req.user.role,
      id: req.user._id,
    }

    if (user.email === ADMIN_EMAIL) {
      req.session.user.role = "superadmin"
    }

    res.status(200).json({
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
      role: req.user.role,
      id: req.user._id,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const restore = async (req, res) => {
  try {
    const { email, password } = req.body

    const response = await restoreService(email, password)

    return res.status(200).json(response)
  } catch (error) {
    console.log(error)
  }
}

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return res.status(400).json({ error: err.message })
    req.session.destroy((err) => next(err))
    res.redirect("/login")
  })
}

const recoverPassword = async (req, res) => {
  try {
    const { email } = req.query
    if (!email) {
      return res
        .status(400)
        .json({ status: "error", error: "email is required" })
    }
    const response = await recoverPasswordService(email)
    return res.status(200).json(response)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message })
  }
}

const newPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body
    console.log(req.body)
    const response = await newPasswordService(token, newPassword)
    return res.status(200).json(response)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message })
  }
}

const changePremiumRole = async (req, res) => {
  try {
    const userEmail = req.session.user.email
    const { id } = req.params
    const response = await changePremiumRoleService(id, userEmail)
    return res.status(200).json(response)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message })
  }
}

const getUserController = async (req, res) => {
  const { user } = req.session
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" })
  }
  const userDto = new UserDto(user)
  return res.status(200).json(userDto)
}

export {
  register,
  login,
  restore,
  logout,
  recoverPassword,
  newPassword,
  changePremiumRole,
  getUserController,
}
