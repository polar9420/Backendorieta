import UserModel from "../models/User.js"

function checkLogged(req, res, next) {
  if (!req.session.user) return res.redirect("/login")
  next()
}

function checkSession(req, res, next) {
  if (req.session.user) return res.redirect("/")
  next()
}

const checkRoleAuth = (roles) => async (req, res, next) => {
  try {
    const user = req.session.user

    if (roles.includes(user.role)) return next()

    res.status(401).json({ message: "NOT AUTHORIZED" })
  } catch (error) {
    console.error(error)
    res.status(401).json({ message: "ERROR_CHECK_ROLE_AUTH" })
  }
}

export { checkLogged, checkSession, checkRoleAuth }
