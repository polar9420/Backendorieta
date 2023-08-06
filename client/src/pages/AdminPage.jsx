import { useEffect, useState } from "react"
import { axiosInstance } from "../config"
import { toast } from "react-toastify"

const AdminPage = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const getUsers = async () => {
      const response = await axiosInstance.get("/users")
      setUsers(response.data)
    }
    getUsers()
  }, [])

  const handleDelete = async (id) => {
    try {
      const user = users.find((user) => user._id === id)

      if (user.role !== "user" && user.role !== "premium") {
        return toast.error("No se puede eliminar este usuario")
      }

      await axiosInstance.delete(`/users/${id}`)

      setUsers(users.filter((user) => user._id !== id))

      toast.success("Usuario eliminado correctamente")
    } catch (error) {
      toast.error("Error al eliminar el usuario")
    }
  }

  const handleChangeRole = async (id) => {
    try {
      const user = users.find((user) => user._id === id)

      if (user.role !== "user" && user.role !== "premium") {
        return toast.error("No se puede cambiar el rol de este usuario")
      }

      const newRole = user.role === "user" ? "premium" : "user"

      const { data } = await axiosInstance.patch(`/users/${id}`, {
        role: newRole,
      })

      setUsers(
        users.map((user) => {
          if (user._id === id) {
            return {
              ...user,
              role: data.role,
            }
          }
          return user
        })
      )

      toast.success("Rol actualizado correctamente")
    } catch (error) {
      toast.error("Error al actualizar el rol")
    }
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-center mt-4">Administracion</h1>
      <div className="mt-4">
        <h2 className="text-2xl font-bold">Usuarios</h2>
        <div className="mt-4">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="border px-4 py-2">Nombre</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Role</th>
                <th className="border px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="border px-4 py-2">
                    {user.first_name} {user.last_name}
                  </td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">{user.role}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                      onClick={() => handleChangeRole(user._id)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleDelete(user._id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
