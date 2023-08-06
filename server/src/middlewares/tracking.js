import UserModel from "../models/User.js"

export async function updateLastActive(req, res, next) {
  if (req.cookies.lastActive && req.user) {
    req.user.lastActive = req.cookies.lastActive
  }
  if (req.isAuthenticated()) {
    res.cookie("lastActive", Date.now(), {
      httpOnly: true,
    })

    await UserModel.updateOne(
      { _id: req.user._id },
      { lastActive: req.cookies.lastActive }
    )

    next()
  } else {
    next()
  }
}
