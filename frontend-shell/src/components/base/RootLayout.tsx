import { Outlet } from "react-router"
import Row from "../core/Row"
import Sidebar from "./Sidebar"

const RootLayout = () => {
  return (
    <Row className="flex bg-neutral-100 min-h-screen">
      <Sidebar />
      <Outlet />
    </Row>
  )
}

export default RootLayout