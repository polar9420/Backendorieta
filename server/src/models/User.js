import mongoose from "mongoose"

const userCollection = "Users"

const userSchema = new mongoose.Schema(
  {
    first_name: String,
    last_name: String,
    email: { type: String, unique: true, required: true },
    age: Number,
    password: String,
    role: {
      type: String,
      enum: ["admin", "user", "superadmin", "premium"],
      default: "user",
    },
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      default: null,
    },
    resetToken: {
      type: String,
      default: null,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: {
      transform: function (_doc, ret) {
        delete ret.password
        delete ret.__v
      },
    },
  }
)

const User = mongoose.model(userCollection, userSchema)

export default User
