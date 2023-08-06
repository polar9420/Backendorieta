import mongoose, { Schema } from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

const collectionName = "carts"

const cartSchema = Schema({
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "products",
        required: true,
      },
      quantity: { type: Number, required: true },
    },
  ],
})
cartSchema.plugin(mongoosePaginate)

const Cart = mongoose.model(collectionName, cartSchema)

export default Cart
