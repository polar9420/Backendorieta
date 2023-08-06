import { Router } from "express"
import {
  register,
  login,
  restore,
  logout,
  recoverPassword,
  newPassword,
  changePremiumRole,
  getUserController,
} from "../controllers/sessions.controllers.js"
import passport from "passport"
import { checkRoleAuth } from "../middlewares/auth.js"

const router = Router()

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "failRegister",
  }),
  register
)

router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email"],
  })
)

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    req.session.user = req.user
    res.json({ status: "ok", data: req.user })
  }
)

router.get("/failRegister", (req, res) => {
  console.log("Failed Register")
  return res.send({ status: "error", error: "authentication error" })
})

router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "failLogin",
  }),
  login
)

router.get("/failLogin", (req, res) => {
  res.send({ status: "error", error: "failed login" })
})

router.put("/restore", checkRoleAuth(["superadmin"]), restore)

router.post("/logout", logout)

router.get("/getuser", getUserController)

router.get("/recovery-password", recoverPassword)

router.post("/new-password", newPassword)

router.post(
  "/premium/:id",
  checkRoleAuth(["superadmin", "admin"]),
  changePremiumRole
)

export default router
