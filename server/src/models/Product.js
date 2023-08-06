import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

const collectionName = "products"

const productSchema = mongoose.Schema({
  code: { type: String, required: true },
  category: {
    type: String,
    enum: ["deporte", "formal", "informal", "other"],
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnail: { type: String, required: true },
  stock: { type: Number, required: true },
  status: { type: Boolean, required: true, default: true },
  owner: {
    type: mongoose.Schema.Types.Mixed,
    ref: "users",
    default: "admin",
  },
})
productSchema.plugin(mongoosePaginate)

const Product = mongoose.model(collectionName, productSchema)

export default Product
