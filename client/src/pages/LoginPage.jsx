import { useState } from "react"
import { Link } from "react-router-dom"
import { useUser } from "../context/UserContext"

const LoginPage = () => {
  const { login } = useUser()
  const [form, setForm] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    login(form)
  }

  return (
    <>
      <h1 className="text-5xl font-bold text-center">Iniciar Sesion</h1>
      <form
        className="flex flex-col gap-4 max-w-xl justify-center text-black"
        onSubmit={handleSubmit}
      >
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="text-black"
        />
        <button className="bg-white p-2 mx-auto rounded">Iniciar Sesion</button>
        <small>
          <Link to={"/auth/recovery-password"}>Olvidaste tu contrasenia?</Link>
        </small>
      </form>
    </>
  )
}

export default LoginPage
