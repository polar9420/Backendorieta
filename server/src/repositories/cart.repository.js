import CartDao from "../dao/cart.dao.js"

class CartRepository {
  getItemsFromCart = async (cartId) => {
    try {
      const products = await CartDao.getItems(cartId)
      return products
    } catch (error) {
      console.log(`Error en getItemsFromCart: ${error.message}`)
    }
  }

  getCartByEmail = async (userEmail) => {
    try {
      const cart = await CartDao.getCartByEmail(userEmail)
      return cart
    } catch (error) {
      console.log(`Error en getCartByEmail: ${error.message}`)
    }
  }

  addItemToCart = async (productId, quantity, userEmail) => {
    try {
      const updatedCart = await CartDao.addItemToCart(
        productId,
        quantity,
        userEmail
      )
      return updatedCart
    } catch (error) {
      console.log(`Error en addItemToCart: ${error.message}`)
    }
  }

  deleteProductFromCart = async (cartId, productId) => {
    try {
      const updatedCart = await CartDao.deleteProductFromCart(cartId, productId)
      return updatedCart
    } catch (error) {
      console.log(`Error en deleteProductFromCart: ${error.message}`)
    }
  }

  deleteAllProductsFromCart = async (cartId) => {
    try {
      const updatedCart = await CartDao.deleteAllProductsFromCart(cartId)
      return updatedCart
    } catch (error) {
      console.log(`Error en deleteAllProductsFromCart: ${error.message}`)
    }
  }

  updateCartProducts = async (cartId, products) => {
    try {
      const updatedCart = await CartDao.updateCartProducts(cartId, products)
      return updatedCart
    } catch (error) {
      console.log(`Error en updateCartProducts: ${error.message}`)
    }
  }

  updateProductQuantityInCart = async (cartId, productId, quantity) => {
    try {
      const updatedCart = await CartDao.updateProductQuantityInCart(
        cartId,
        productId,
        quantity
      )
      return updatedCart
    } catch (error) {
      console.log(`Error en updateProductQuantityInCart: ${error.message}`)
    }
  }

  purchaseCart = async (cartId) => {
    try {
      const { ticket, productsWithStock, productsWithoutStock } =
        await CartDao.purchaseCart(cartId)
      return { ticket, productsWithStock, productsWithoutStock }
    } catch (error) {
      console.log(`Error en purchaseCart Repository: ${error.message}`)
    }
  }
}

const cartRepository = new CartRepository()

export default cartRepository
