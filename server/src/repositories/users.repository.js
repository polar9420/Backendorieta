import UserDao from "../dao/user.dao.js"

class UserRepository {
  getUsers = async () => {
    try {
      const users = await UserDao.getAllUsers()
      return users
    } catch (error) {
      console.log(`Error en getUsers: ${error.message}`)
    }
  }

  getUserById = async (id) => {
    try {
      const user = await UserDao.getUserById(id)
      return user
    } catch (error) {
      console.log(`Error en getUserById: ${error.message}`)
    }
  }

  getUserByEmail = async (email) => {
    try {
      const user = await UserDao.getUserByEmail(email)
      return user
    } catch (error) {
      console.log(`Error en getUserByEmail: ${error.message}`)
    }
  }

  createUser = async (user) => {
    try {
      const newUser = await UserDao.createUser(user)

      return newUser
    } catch (error) {
      console.log(`Error en createUser: ${error.message}`)
    }
  }

  restoreUserPassword = async (email, password) => {
    try {
      const user = await UserDao.restoreUserPassword(email, password)
      return user
    } catch (error) {
      console.log(error)
    }
  }

  recoverPassword = async (email) => {
    try {
      const res = await UserDao.recoverPassword(email)
      return res
    } catch (error) {
      console.log(error)
    }
  }

  newPassword = async (token, newPassword) => {
    try {
      const res = await UserDao.newPassword(token, newPassword)
      return res
    } catch (error) {
      console.log(error)
    }
  }

  changePremiumRole = async (id, userEmail) => {
    try {
      const res = await UserDao.changePremiumRole(id, userEmail)
      return res
    } catch (error) {
      console.log(error)
    }
  }
}

const userRepository = new UserRepository()

export default userRepository
