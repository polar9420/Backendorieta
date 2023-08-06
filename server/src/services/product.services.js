import ProductModel from "../models/Product.js"
import UserModel from "../models/User.js"
import CartModel from "../models/Cart.js"
import { sendMailProductDeleted } from "../libs/mailer.js"

const getAllProductsService = async () => {
  try {
    const products = await ProductModel.find()
    return products
  } catch (error) {
    console.error(error)
    throw new Error(error)
  }
}

const getProductByIdService = async (id) => {
  try {
    const product = await ProductModel.findById(id)
    if (!product) {
      throw new Error("El id del producto no existe")
    }

    return product
  } catch (error) {
    console.error(error)
    throw new Error(error)
  }
}

const addProductService = async (product, userEmail) => {
  try {
    const user = await UserModel.findOne({ email: userEmail })
    if (user.role === "premium") {
      const newProduct = {
        ...product,
        owner: user._id,
      }
      const createdProduct = await ProductModel.create(newProduct)
      return createdProduct
    }

    const newProduct = await ProductModel.create(product)
    return newProduct
  } catch (error) {
    console.error(error)
    throw new Error(error)
  }
}

const updateProductService = async (id, product, userEmail) => {
  try {
    const user = await UserModel.findOne({ email: userEmail })
    if (user.role === "premium") {
      const product = await ProductModel.findOne({ _id: id })
      if (!product) {
        throw new Error("No existe el producto que quieres actualizar")
      }
      if (product.owner.toString() !== user._id.toString()) {
        throw new Error("No tienes permisos para actualizar este producto")
      }

      const productUpdated = await ProductModel.findByIdAndUpdate(id, product, {
        new: true,
      })
      return productUpdated
    }

    const productUpdated = await ProductModel.findByIdAndUpdate(id, product, {
      new: true,
    })
    return productUpdated
  } catch (error) {
    console.error(error)
    throw new Error(error)
  }
}

const deleteProductService = async (id, userEmail) => {
  try {
    const user = await UserModel.findOne({ email: userEmail })
    if (user.role === "premium") {
      const product = await ProductModel.findOne({ _id: id })
      if (!product) {
        throw new Error("No existe el producto que quieres eliminar")
      }
      if (product.owner.toString() !== user._id.toString()) {
        throw new Error("No tienes permisos para eliminar este producto")
      }

      const productDeleted = await ProductModel.findByIdAndDelete(id)
      // Eliminar el producto de todos los carritos
      const carts = await CartModel.find()
      carts.forEach(async (cart) => {
        const products = cart.products.filter((product) => {
          return product.productId.toString() !== id.toString()
        })
        cart.products = products
        await cart.save()
      })

      sendMailProductDeleted(userEmail, product)
      return productDeleted
    }

    const product = await ProductModel.findByIdAndDelete(id)
    // Eliminar el producto de todos los carritos
    const carts = await CartModel.find()
    carts.forEach(async (cart) => {
      const products = cart.products.filter((product) => {
        return product.productId.toString() !== id.toString()
      })
      cart.products = products
      await cart.save()
    })
    return product
  } catch (error) {
    console.error(error)
    throw new Error(error)
  }
}

export {
  getAllProductsService,
  getProductByIdService,
  addProductService,
  updateProductService,
  deleteProductService,
}
