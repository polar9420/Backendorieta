import { useState } from "react"
import { useUser } from "../context/UserContext"

const RegisterPage = () => {
  const { register } = useUser()
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    age: 0,
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    register(form)
  }

  return (
    <>
      <h1 className="text-5xl font-bold text-center">Registrarse</h1>
      <form
        className="flex flex-col gap-4 max-w-xl justify-center text-black"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="First Name"
          name="first_name"
          value={form.first_name}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Last Name"
          name="last_name"
          value={form.last_name}
          onChange={handleChange}
        />
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
        />
        <input
          type="number"
          placeholder="Age"
          name="age"
          value={form.age}
          onChange={handleChange}
        />
        <button className="bg-white p-2 mx-auto rounded">Registrarse</button>
      </form>
    </>
  )
}

export default RegisterPage
