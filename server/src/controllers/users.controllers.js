import {
  deleteInactiveUsersService,
  deleteUserByIdService,
  getAllUsersService,
  getUserByIdService,
  updateUserByIdService,
} from "../services/user.services.js"

export const getAllUsersController = async (req, res, next) => {
  try {
    const users = await getAllUsersService()
    res.status(200).json(users)
  } catch (error) {
    next(error)
  }
}

export const deleteInactiveUsersController = async (req, res, next) => {
  try {
    const users = await deleteInactiveUsersService()
    res.status(200).json(users)
  } catch (error) {
    next(error)
  }
}

export const getUserByIdController = async (req, res, next) => {
  try {
    const user = await getUserByIdService(req.params.id)
    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}

export const deleteUserByIdController = async (req, res, next) => {
  try {
    const user = await deleteUserByIdService(req.params.id)
    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}

export const updateUserByIdController = async (req, res, next) => {
  try {
    const user = await updateUserByIdService(req.params.id, req.body)
    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}
