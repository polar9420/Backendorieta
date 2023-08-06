import { useEffect, useState } from "react"
import { axiosInstance } from "../config"
import { useCart } from "../context/CartContext"
import { useUser } from "../context/UserContext"

const HomePage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { handleAddToCart } = useCart()
  const { user } = useUser()

  useEffect(() => {
    setLoading(true)
    axiosInstance
      .get("/products")
      .then((res) => {
        setProducts(res.data)
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Loading...</div>

  if (error) return <div>{error}</div>

  return (
    <div>
      <h1 className="text-5xl font-bold text-center">Productos</h1>
      <div className="flex gap-4">
        {products.map((product) => (
          <div key={product._id} className="bg-red-500 rounded-lg p-4 my-4">
            <img
              src={product.thumbnail}
              alt={product.title}
              width={250}
              height={200}
            />
            <h2>{product.title}</h2>
            <p>{product.description}</p>
            <p>${product.price}</p>
            <p>Stock: {product.stock}</p>
            {user && (
              <button onClick={() => handleAddToCart(product._id, 1)}>
                Agregar al carrito
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default HomePage
