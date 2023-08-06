import { Link, useLocation } from "react-router-dom"

const CheckoutPage = () => {
  const {
    state: { order },
  } = useLocation()
  return (
    <div
      className="py-12 bg-gray-700 transition duration-150 ease-in-out z-10 absolute top-0 right-0 bottom-0 left-0"
      id="modal"
    >
      <div role="alert" className="container mx-auto w-11/12 md:w-2/3 max-w-lg">
        <div className="relative py-8 px-5 md:px-10 bg-white shadow-md rounded border border-gray-400">
          <div className="w-full flex justify-start text-gray-600 mb-3"></div>
          <h1 className="text-gray-800 text-2xl text-center font-bold tracking-normal leading-tight mb-4">
            Gracias por su compra!
          </h1>
          <p
            htmlFor="name"
            className="text-gray-800 text-sm font-bold leading-tight tracking-normal"
          >
            Productos comprados
          </p>
          {order?.productsPurchased?.length > 0 ? (
            <div className="flex items-center gap-4">
              {order?.productsPurchased?.map((p) => (
                <div
                  key={p._id}
                  className="text-black font-bold border border-black p-4 my-4 gap-4"
                >
                  <img
                    src={p.thumbnail}
                    alt={p.title}
                    className="w-16 h-16 mx-auto"
                  />
                  <p>{p.title}</p>
                  <p>${p.price}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-bold text-red-600">
              No se puedo comprar ningun producto debido a que no estaban en
              stock al momento de realizar la compra.
            </p>
          )}
          <p
            htmlFor="email2"
            className="text-gray-800 text-sm font-bold leading-tight tracking-normal"
          >
            Productos no disponibles
          </p>
          <small className="text-black">
            Son los productos que estaban en su carrito y no estaban disponibles
            al momento de realizar la compra.
          </small>
          {order?.productsNotPurchased?.length > 0 ? (
            <div className="flex items-center gap-4">
              {order?.productsNotPurchased?.map((p) => (
                <div
                  key={p._id}
                  className="text-black font-bold border border-black p-4 my-4"
                >
                  <img
                    src={p.thumbnail}
                    alt={p.title}
                    className="w-16 h-16 mx-auto"
                  />
                  <p>{p.title}</p>
                  <p>${p.price}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-bold text-green-600">
              Todos los productos estaban disponibles!
            </p>
          )}
          <div className="relative mb-5 mt-2"></div>
          <p
            htmlFor="expiry"
            className="text-gray-800 text-xl font-bold leading-tight tracking-normal"
          >
            Datos de la compra
          </p>
          {
            <div className="flex items-center">
              <div className="text-black font-bold border border-black p-4 my-4 gap-4 text-lg">
                <p>
                  Fecha de compra:{" "}
                  {new Date(order.ticket.createdAt).toLocaleDateString() +
                    " " +
                    new Date(order.ticket.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                </p>
                <p>Numero de orden: {order.ticket.code}</p>
                <p>Total: ${order.ticket.amount}</p>
                <p>Titular: {order.ticket.purchaser}</p>
              </div>
            </div>
          }
          <div className="flex items-center justify-center w-full">
            <Link to="/">
              <button className="outline-none transition duration-150 ease-in-out hover:bg-indigo-600 bg-indigo-700 rounded text-white px-8 py-2 text-sm">
                Volver al inicio
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
export default CheckoutPage
