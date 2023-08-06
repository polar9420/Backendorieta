import { Router } from "express"
import multer from "multer"
const upload = multer({ dest: "public/images/products" })
import { checkRoleAuth } from "../middlewares/auth.js"

import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/product.controllers.js"

// instancio mi router en este archivo
const router = Router()

router.get("/", getAllProducts) //http://localhost:8080/api/products
router.get("/:id", getProductById) //http://localhost:8080/api/products/:id
router.post(
  "/",
  checkRoleAuth(["superadmin", "admin", "premium"]),
  upload.single("thumbnail"),
  addProduct
) //http://localhost:8080/api/products
router.patch(
  "/:id",
  checkRoleAuth(["superadmin", "admin", "premium"]),
  updateProduct
) // http://localhost:8080/api/products/:id
router.delete(
  "/:id",
  checkRoleAuth(["superadmin", "admin", "premium"]),
  deleteProduct
) // http://localhost:8080/api/products/:id

export default router
