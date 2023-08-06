import { createContext, useContext, useState, useEffect } from "react"
import { axiosInstance } from "../config"
import { useUser } from "./UserContext"

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart debe estar dentro del proveedor CartProvider")
  }
  return context
}

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null)
  const { user } = useUser()

  const getCart = async () => {
    try {
      const { data } = await axiosInstance.get("/cart")
      setCart(data)
      return data
    } catch (error) {
      console.log(error)
    }
  }

  const deleteCart = async (id) => {
    try {
      const { data } = await axiosInstance.delete(`/cart/${id}`)
      setCart(null)
    } catch (error) {
      console.log(error)
    }
  }

  const totalItemsInCart = cart?.products?.reduce(
    (acc, item) => Number(acc) + Number(item.quantity),
    0
  )
  const totalPrice = cart?.products?.reduce(
    (acc, item) => Number(acc) + Number(item.price),
    0
  )

  const handleAddToCart = async (productId, quantity) => {
    try {
      const { data } = await axiosInstance.post(`/cart`, {
        productId,
        quantity,
      })
      if (data) {
        setCart(data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleRemoveFromCart = async (productId) => {
    try {
      const { data } = await axiosInstance.delete(
        `/cart/${cart._id}/products/${productId}`
      )
      if (data) {
        setCart(data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const checkout = async (cartId) => {
    try {
      const { data } = await axiosInstance.post(`/cart/${cartId}/purchase`)
      if (data) {
        setCart(null)

        return data
      }
      return null
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (user) {
      getCart()
    } else {
      setCart(null)
    }
  }, [user])

  return (
    <CartContext.Provider
      value={{
        cart,
        deleteCart,
        handleAddToCart,
        checkout,
        totalItemsInCart,
        totalPrice,
        handleRemoveFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export default CartProvider
