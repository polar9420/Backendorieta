import mongoose from "mongoose"

const ticketSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    purchaser: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const Ticket = mongoose.model("Ticket", ticketSchema)

export default Ticket
