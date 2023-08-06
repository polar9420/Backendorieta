import CartModel from "../models/Cart.js"
import ProductModel from "../models/Product.js"
import UserModel from "../models/User.js"
import TicketModel from "../models/Ticket.js"
import { sendSMS } from "../libs/sms.js"

class CartDao {
  addItemToCart = async (productId, quantity, userEmail) => {
    try {
      // Buscamos el usuario por email y comprobamos si tiene carrito
      const user = await UserModel.findOne({ email: userEmail })
      if (!user) {
        throw new Error(`No existe un usuario con email ${userEmail}`)
      }

      if (!user.cartId) {
        // Si no tiene carrito, creamos uno nuevo
        const newCart = await CartModel.create({
          products: [{ productId, quantity }],
        })

        // Asignamos el id del carrito al usuario
        user.cartId = newCart._id
        await user.save()

        return newCart
      } else {
        // Si el usuario es premium, comprobamos que el producto no sea suyo
        if (user.role === "premium") {
          const product = await ProductModel.findOne({ _id: productId })
          if (!product) {
            throw new Error("No existe el producto que quieres añadir")
          }
          if (product.owner.toString() === user._id.toString()) {
            throw new Error("No puedes añadir a tu carrito un producto propio")
          }
        }

        // Si tiene carrito, lo buscamos y añadimos el producto
        const cart = await CartModel.findById(user.cartId)
        if (!cart) {
          throw new Error(`No existe un carrito con id ${user.cartId}`)
        }

        const existingProductIndex = cart.products.findIndex(
          (p) => p.productId.toString() === productId
        )

        if (existingProductIndex >= 0) {
          cart.products[existingProductIndex].quantity += quantity
        } else {
          cart.products.push({ productId, quantity })
        }

        const updatedCart = await cart.save()

        return updatedCart
      }
    } catch (error) {}
  }

  getItems = async (cartId) => {
    // HAY UN ERROR EN ESTE ENDPOINT
    // Error en getItems: Cast to ObjectId failed for value "undefined" (type string) at path "_id" for model "carts"
    try {
      const cart = await CartModel.findById(cartId)
      if (!cart) {
        throw new Error(`No existe un carrito con id ${cartId}`)
      }

      const productIds = cart.products.map((product) => product.productId)

      const products = await ProductModel.find({ _id: { $in: productIds } })
      console.log(products)

      return products
    } catch (error) {
      console.log(`Error en getItems: ${error.message}`)
    }
  }

  getCartByEmail = async (userEmail) => {
    try {
      const user = await UserModel.findOne({ email: userEmail })
      if (!user) {
        throw new Error(`No existe un usuario con email ${userEmail}`)
      }

      const cart = await CartModel.findById(user.cartId)
      if (!cart) {
        throw new Error(`No existe un carrito con id ${user.cartId}`)
      }

      return cart
    } catch (error) {
      console.error(`Error en getCartByEmail: ${error.message}`)
    }
  }

  deleteProductFromCart = async (cartId, productId) => {
    try {
      const cart = await CartModel.findById(cartId)
      if (!cart) {
        throw new Error(`No existe un carrito con id ${cartId}`)
      }

      const existingProductIndex = cart.products.findIndex(
        (p) => p.productId.toString() === productId
      )

      if (existingProductIndex >= 0) {
        cart.products.splice(existingProductIndex, 1)
      }

      const updatedCart = await cart.save()

      return updatedCart
    } catch (error) {
      console.log(`Error en deleteProductFromCart: ${error.message}`)
    }
  }

  deleteAllProductsFromCart = async (cartId) => {
    try {
      const cart = await CartModel.findById(cartId)
      if (!cart) {
        throw new Error(`No existe un carrito con id ${cartId}`)
      }

      cart.products = []

      const updatedCart = await cart.save()

      return updatedCart
    } catch (error) {
      console.log(`Error en deleteAllProductsFromCart: ${error.message}`)
    }
  }

  updateCartProducts = async (cartId, products) => {
    try {
      const cart = await CartModel.findById(cartId)
      if (!cart) {
        throw new Error(`No existe un carrito con id ${cartId}`)
      }

      cart.products = products

      const updatedCart = await cart.save()

      return updatedCart
    } catch (error) {
      console.log(`Error en updateCartProducts: ${error.message}`)
    }
  }

  updateProductQuantityInCart = async (cartId, productId, quantity) => {
    try {
      const cart = await CartModel.findById(cartId)
      if (!cart) {
        throw new Error(`No existe un carrito con id ${cartId}`)
      }

      const existingProductIndex = cart.products.findIndex(
        (p) => p.productId.toString() === productId
      )

      if (existingProductIndex >= 0) {
        cart.products[existingProductIndex].quantity = quantity
      }

      const updatedCart = await cart.save()

      return updatedCart
    } catch (error) {
      console.log(`Error en updateProductQuantityInCart: ${error.message}`)
    }
  }

  purchaseCart = async (cartId) => {
    try {
      const cart = await CartModel.findById(cartId)

      if (!cart) {
        throw new Error(`No existe un carrito con id ${cartId}`)
      }

      const productIds = cart.products.map((product) => product.productId)

      const products = await ProductModel.find({ _id: { $in: productIds } })

      const productsWithStock = products.filter(
        (product) =>
          product.stock >=
          cart.products.find(
            (cartProduct) =>
              cartProduct.productId.toString() === product._id.toString()
          ).quantity
      )

      const productsWithoutStock = products.filter(
        (product) =>
          product.stock <
          cart.products.find(
            (cartProduct) =>
              cartProduct.productId.toString() === product._id.toString()
          ).quantity
      )

      // Restamos el stock de los productos que tienen stock
      productsWithStock.forEach((product) => {
        const cartProduct = cart.products.find(
          (cartProduct) =>
            cartProduct.productId.toString() === product._id.toString()
        )
        product.stock -= cartProduct.quantity
      })

      // Creamos el ticket de compra
      // code - amount - purchaser (email)
      const amount = productsWithStock.reduce(
        (acc, product) =>
          acc +
          product.price *
            cart.products.find(
              (cartProduct) =>
                cartProduct.productId.toString() === product._id.toString()
            ).quantity,
        0
      )

      // Creamos el ticket
      const user = await UserModel.findOne({ cartId: cart._id }).exec()

      const newTicket = {
        code: Math.floor(Math.random() * 1000000),
        amount,
        purchaser: user.email,
      }

      const ticket = await TicketModel.create(newTicket)

      // Vaciamos los productos comprados del carrito
      cart.products = cart.products.filter(
        (product) =>
          !productsWithStock.find(
            (productWithStock) =>
              productWithStock._id.toString() === product.productId.toString()
          )
      )

      // Guardamos el carrito
      await cart.save()

      // * FALTAN LAS CREDENCIALES DEL MAIL EN EL .ENV
      // await sendMail(user, ticket, productsWithStock, productsWithoutStock)
      await sendSMS(user)

      return { ticket, productsWithStock, productsWithoutStock }
    } catch (error) {
      console.log(`Error en purchaseCart DAO: ${error.message}`)
    }
  }
}

const cartDao = new CartDao()

export default cartDao
