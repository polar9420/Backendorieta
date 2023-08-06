import { useState } from "react"
import { useParams } from "react-router-dom"
import { axiosInstance } from "../config"
import { toast } from "react-toastify"

const NewPasswordPage = () => {
  const { token } = useParams()
  const [form, setForm] = useState({
    password: "",
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    axiosInstance
      .post("/sessions/new-password", {
        token,
        newPassword: form.password,
      })
      .then((res) => {
        console.log(res.data)
        toast.success("Contrasena actualizada")
      })
      .catch((err) => {
        console.log(err.message)
      })
  }

  return (
    <div>
      <h1 className="text-5xl font-bold text-center">Nueva Contrasena</h1>
      <form
        className="flex flex-col gap-4 max-w-xl justify-center"
        onSubmit={handleSubmit}
      >
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={form.password}
          onChange={handleChange}
        />
        <button>Enviar</button>
      </form>
    </div>
  )
}

export default NewPasswordPage
