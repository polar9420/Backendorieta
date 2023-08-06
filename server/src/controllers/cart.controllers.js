import {
  getCartByIdService,
  getCartByEmailService,
  addItemToCartService,
  deleteProductFromCartService,
  deleteAllProductsFromCartService,
  updateCartProductsService,
  updateProductQuantityInCartService,
  purchaseCartService,
} from "../services/cart.services.js"

export const getCartById = async (req, res) => {
  try {
    const { cid } = req.params
    console.log(`cid: ${cid}`)

    const products = await getCartByIdService(cid)

    res.status(200).json(products)
  } catch (error) {
    console.error(error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}

export const getCartByEmail = async (req, res) => {
  try {
    const cart = await getCartByEmailService(req.session.user.email)
    res.status(200).json(cart)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server error" })
  }
}

export const addItemToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body
    const updatedCart = await addItemToCartService(
      productId,
      quantity,
      req.session.user.email
    )
    res.status(200).json(updatedCart)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Something went wrong" })
  }
}

export const deleteProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params
    const updatedCart = await deleteProductFromCartService(cid, pid)
    res.status(200).json(updatedCart)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server error" })
  }
}
export const deleteAllProductsFromCart = async (req, res) => {
  try {
    const { cid } = req.params
    const updatedCart = await deleteAllProductsFromCartService(cid)
    res.status(200).json({ message: "Cart cleared successfully", updatedCart })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server error" })
  }
}

export const updateCartProducts = async (req, res) => {
  try {
    const { cid } = req.params
    const { products } = req.body
    const updatedCart = await updateCartProductsService(cid, products)
    res.status(200).json({ message: "Cart updated successfully", updatedCart })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server error" })
  }
}

export const updateProductQuantityInCart = async (req, res) => {
  try {
    const { cid, pid } = req.params
    const { quantity } = req.body
    const updatedCart = await updateProductQuantityInCartService(
      cid,
      pid,
      quantity
    )
    res
      .status(200)
      .json({ message: "Product quantity updated successfully", updatedCart })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server error" })
  }
}

export const purchaseCart = async (req, res) => {
  try {
    const { cid } = req.params

    const { ticket, productsWithStock, productsWithoutStock } =
      await purchaseCartService(cid)

    return res.status(200).json({
      message: "Purchase completed",
      ticket,
      productsPurchased: productsWithStock,
      productsNotPurchased: productsWithoutStock,
    })
  } catch (error) {
    console.error(error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
