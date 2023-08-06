import ProductDao from "../dao/product.dao.js"

class ProductRepository {
  getProducts = async () => {
    try {
      const products = await ProductDao.getAllProducts()
      return products
    } catch (error) {
      console.log(`Error en getProducts: ${error.message}`)
    }
  }

  getProductById = async (id) => {
    try {
      const product = await ProductDao.getProductById(id)
      return product
    } catch (error) {
      console.log(`Error en getProductById: ${error.message}`)
    }
  }

  addProduct = async (product, userEmail) => {
    try {
      const newProduct = await ProductDao.addProduct(product, userEmail)
      return newProduct
    } catch (error) {
      console.log(`Error en addProduct: ${error.message}`)
    }
  }

  updateProduct = async (id, product, userEmail) => {
    try {
      const updatedProduct = await ProductDao.updateProduct(
        id,
        product,
        userEmail
      )
      return updatedProduct
    } catch (error) {
      console.log(`Error en updateProduct: ${error.message}`)
    }
  }

  deleteProduct = async (id, userEmail) => {
    try {
      const deletedProduct = await ProductDao.deleteProduct(id, userEmail)
      return deletedProduct
    } catch (error) {
      console.log(`Error en deleteProduct: ${error.message}`)
    }
  }
}

const productRepository = new ProductRepository()

export default productRepository
