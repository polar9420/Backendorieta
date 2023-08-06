import { useState } from "react"
import { useCart } from "../context/CartContext"
import { useNavigate } from "react-router-dom"

const CartPage = () => {
  const { cart, checkout, handleRemoveFromCart } = useCart()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    setIsLoading(true)
    const order = await checkout(cart._id)
    if (order) {
      navigate("/checkout", { state: { order } })
    } else {
      alert("No se pudo realizar la compra")
    }
    setIsLoading(false)
  }

  return (
    <div>
      <h1 className="text-5xl font-bold text-center">Carrito</h1>
      <div className="flex gap-4">
        {cart &&
          cart?.products?.length > 0 &&
          cart?.products?.map(
            ({
              productId: {
                title,
                description,
                code,
                _id,
                price,
                stock,
                status,
                owner,
                category,
                thumbnail,
              },
              quantity,
            }) => {
              return (
                <div
                  key={_id}
                  className="flex flex-col gap-4 bg-red-400 p-4 rounded-md my-4"
                >
                  <img src={thumbnail} alt={title} width={250} height={200} />
                  <h2 className="text-2xl font-bold">{title}</h2>
                  <p>{description}</p>
                  <p>Codigo: {code}</p>
                  <p>${price}</p>
                  <p>Stock: {stock}</p>
                  <p>
                    Disponibilidad {status ? "Disponible" : "No disponible"}
                  </p>
                  <p>Agregado por: {owner}</p>
                  <p>Categoria: {category}</p>
                  <p>
                    Cantidad: <span className="font-bold">{quantity}</span>
                  </p>
                  <button
                    className="bg-red-700 hover:bg-red-900 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleRemoveFromCart(_id)}
                  >
                    Eliminar del carrito
                  </button>
                </div>
              )
            }
          )}

        {cart?.products?.length < 1 && (
          <h2 className="text-center text-3xl mt-6 w-full text-red-500 font-bold">
            No hay productos en el carrito
          </h2>
        )}
      </div>
      {cart && cart?.products?.length > 0 && (
        <div className="flex justify-center items-center py-10">
          <button
            className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ${
              isLoading && "cursor-not-allowed opacity-50"
            }`}
            onClick={handleCheckout}
            disabled={isLoading}
          >
            Proceder al pago
          </button>
        </div>
      )}
    </div>
  )
}

export default CartPage
