import React from "react"
import { Link } from "react-router-dom"
import { useUser } from "../context/UserContext"
import { useCart } from "../context/CartContext"

const Header = () => {
  const { user, logout } = useUser()
  const { cart, totalItemsInCart } = useCart()
  return (
    <header>
      <nav className="bg-white text-black">
        <ul className="flex justify-between items-center p-8">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/chat">Chat</Link>
          </li>
          {user ? (
            <>
              <li>
                <button onClick={logout}>Cerrar session</button>
              </li>
              {user.role === "admin" || user.role === "superadmin" ? (
                <li>
                  <Link to="/admin">Admin</Link>
                </li>
              ) : null}
              {cart?.products?.length > 0 && (
                <li>
                  <Link to="/cart">C {totalItemsInCart}</Link>
                </li>
              )}
            </>
          ) : (
            <>
              <li>
                <Link to="/auth/login">Iniciar sesion</Link>
              </li>
              <li>
                <Link to="/auth/register">Registrarse</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  )
}

export default Header
