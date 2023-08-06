import { Router } from "express"
import {
  deleteAllProductsFromCart,
  deleteProductFromCart,
  getCartById,
  getCartByEmail,
  updateCartProducts,
  updateProductQuantityInCart,
  purchaseCart,
  addItemToCart,
} from "../controllers/cart.controllers.js"
import { checkRoleAuth } from "../middlewares/auth.js"
const router = Router()

router.post("/", checkRoleAuth(["user", "admin", "superadmin"]), addItemToCart) // Agregar un producto al carrito - POST - http://localhost:5173/api/cart
router.get("/", checkRoleAuth(["user", "admin", "superadmin"]), getCartByEmail) // Obtener el carrito por email - GET - http://localhost:5173/api/cart
router.get("/:cid", checkRoleAuth(["user", "admin", "superadmin"]), getCartById) // Obtener el carrito por id - GET - http://localhost:5173/api/cart/:cid
router.delete(
  "/:cid/products/:pid",
  checkRoleAuth(["user", "admin", "superadmin"]),
  deleteProductFromCart
) // Eliminar un producto del carrito - DELETE - http://localhost:5173/api/cart/:cid/products/:pid
router.delete(
  "/:cid",
  checkRoleAuth(["user", "admin", "superadmin"]),
  deleteAllProductsFromCart
) // Eliminar todos los productos del carrito - DELETE - http://localhost:5173/api/cart/:cid
router.put(
  "/:cid",
  checkRoleAuth(["user", "admin", "superadmin"]),
  updateCartProducts
) // Actualizar los productos del carrito - PUT - http://localhost:5173/api/cart/:cid
router.patch(
  "/:cid/products/:pid",
  checkRoleAuth(["user", "admin", "superadmin"]),
  updateProductQuantityInCart
) // Actualizar la cantidad de un producto del carrito - PATCH - http://localhost:5173/api/cart/:cid/products/:pid
router.post(
  "/:cid/purchase",
  checkRoleAuth(["user", "admin", "superadmin"]),
  purchaseCart
) // Comprar el carrito - POST - http://localhost:5173/api/cart/:cid/purchase

export default router
