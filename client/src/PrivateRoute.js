import { Navigate, Outlet } from 'react-router-dom'

const PrivateRoutes = () => {
    let auth = sessionStorage.getItem("key")
return (
    auth ? <Outlet/> : <Navigate to='/'/>
  )
}

export default PrivateRoutes