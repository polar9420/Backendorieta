import { Navigate, Outlet } from "react-router-dom"
import { useUser } from "../context/UserContext"

// eslint-disable-next-line react/prop-types
const AuthenticatedRoute = ({ redirectPath = "/auth/login", role = [] }) => {
  const { user, loading } = useUser()
  if (!user && loading === false) {
    return <Navigate to={redirectPath} />
  }

  if (user && role.length > 0 && !role.includes(user.role)) {
    return <Navigate to={redirectPath} />
  }

  return <Outlet />
}

export default AuthenticatedRoute
