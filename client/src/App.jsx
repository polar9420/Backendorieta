import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import RegisterPage from "./pages/RegisterPage"
import LoginPage from "./pages/LoginPage"
import RecoveryPassword from "./pages/RecoveryPassword"
import NewPasswordPage from "./pages/NewPasswordPage"
import Header from "./components/Header"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Chat from "./components/Chat"
import SocketProvider from "./context/SocketContext"
import UserProvider from "./context/UserContext"
import CartProvider from "./context/CartContext"
import CartPage from "./pages/CartPage"
import AuthenticatedRoute from "./utils/AuthenticatedRoute"
import CheckoutPage from "./pages/CheckoutPage"
import AdminPage from "./pages/AdminPage"

function App() {
  return (
    <div className="bg-black min-h-screen text-white">
      <BrowserRouter>
        <SocketProvider>
          <UserProvider>
            <CartProvider>
              <ToastContainer />
              <Header />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/auth/register" element={<RegisterPage />} />
                <Route path="/auth/login" element={<LoginPage />} />
                <Route
                  path="/auth/recovery-password"
                  element={<RecoveryPassword />}
                />
                <Route
                  path="/auth/new-password/:token"
                  element={<NewPasswordPage />}
                />
                <Route path="/chat" element={<Chat />} />
                <Route element={<AuthenticatedRoute />}>
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                </Route>
                <Route
                  element={
                    <AuthenticatedRoute role={["admin", "superadmin"]} />}
                >
                  <Route path="/admin" element={<AdminPage />} />
                </Route>
                <Route path="*" element={<h1>404</h1>} />
              </Routes>
            </CartProvider>
          </UserProvider>
        </SocketProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
