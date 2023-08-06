import ProductModel from "../models/Product.js"
import UserModel from "../models/User.js"

class ProductDao {
  getAllProducts = async () => {
    try {
      const products = await ProductModel.find()
      return products
    } catch (error) {
      console.log(`Error en getAllProducts: ${error.message}`)
    }
  }

  getProductById = async (id) => {
    try {
      const product = await ProductModel.findById(id)
      return product
    } catch (error) {
      console.log(`Error en getProductById: ${error.message}`)
    }
  }

  addProduct = async (product, userEmail) => {
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
      console.log(`Error en addProduct: ${error.message}`)
    }
  }

  updateProduct = async (id, product, userEmail) => {
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

        const productUpdated = await ProductModel.findByIdAndUpdate(
          id,
          product,
          {
            new: true,
          }
        )
        return productUpdated
      }

      const productUpdated = await ProductModel.findByIdAndUpdate(id, product, {
        new: true,
      })
      return productUpdated
    } catch (error) {
      console.log(`Error en updateProduct: ${error.message}`)
    }
  }

  deleteProduct = async (id, userEmail) => {
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
        return productDeleted
      }

      const product = await ProductModel.findByIdAndDelete(id)
      return product
    } catch (error) {
      console.log(`Error en deleteProduct: ${error.message}`)
    }
  }
}

const productDao = new ProductDao()

export default productDao
