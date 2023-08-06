import {
  addProductService,
  deleteProductService,
  getAllProductsService,
  getProductByIdService,
  updateProductService,
} from "../services/product.services.js"

const getAllProducts = async (req, res) => {
  try {
    const products = await getAllProductsService()
    return res.status(200).json(products)
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg:
        error.message ||
        "Server internal error. Please contact with admin server",
    })
  }
}

const getProductById = async (req, res) => {
  const { id } = req.params
  try {
    const product = await getProductByIdService(id)
    return res.status(200).json(product)
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg:
        error.message ||
        "Server internal error. Please contact with admin server",
    })
  }
}

const addProduct = async (req, res) => {
  const userEmail = req.session.user.email
  try {
    const newProduct = await addProductService(req.body, userEmail)
    return res.status(201).json(newProduct)
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg:
        error.message ||
        "Server internal error. Please contact with admin server",
    })
  }
}

const updateProduct = async (req, res) => {
  const { id } = req.params
  const userEmail = req.session.user.email
  try {
    const updatedProduct = await updateProductService(id, req.body, userEmail)
    return res.status(200).json(updatedProduct)
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg:
        error.message ||
        "Server internal error. Please contact with admin server",
    })
  }
}

const deleteProduct = async (req, res) => {
  const { id } = req.params
  const userEmail = req.session.user.email
  console.log(userEmail)

  try {
    const deletedProduct = await deleteProductService(id, userEmail)
    return res.status(200).json(deletedProduct)
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg:
        error.message ||
        "Server internal error. Please contact with admin server",
    })
  }
}

export {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
}
