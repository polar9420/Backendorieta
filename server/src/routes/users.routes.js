import { Router } from "express"
import {
  deleteInactiveUsersController,
  deleteUserByIdController,
  getAllUsersController,
  getUserByIdController,
  updateUserByIdController,
} from "../controllers/users.controllers.js"
import { checkRoleAuth } from "../middlewares/auth.js"

const router = Router()

router.get("/", checkRoleAuth(["admin", "superadmin"]), getAllUsersController)

router.delete(
  "/",
  checkRoleAuth(["admin", "superadmin"]),
  deleteInactiveUsersController
)

router.get(
  "/:id",
  checkRoleAuth(["admin", "superadmin"]),
  getUserByIdController
)

router.delete(
  "/:id",
  checkRoleAuth(["admin", "superadmin"]),
  deleteUserByIdController
)

router.patch(
  "/:id",
  checkRoleAuth(["admin", "superadmin"]),
  updateUserByIdController
)

export default router
