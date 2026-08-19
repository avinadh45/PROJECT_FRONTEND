

import { useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "../components/sideBar"
import Topbar from "../components/TopBar"
import { SubscriptionStatusProvider } from "../context/SubscriptionStatusContext"

export default function ServiceCenterLayout() {

  const [collapsed, setCollapsed] = useState(false)

  return (
    <SubscriptionStatusProvider>
      <div className="flex h-screen w-full overflow-hidden bg-[#060a14]">

        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(c => !c)}
        />

        <div className="flex-1 flex flex-col min-w-0">

          <Topbar title="Service Center" subtitle="Manage your platform" />
    <main className="flex-1 overflow-y-auto main-scrollbar">
          <Outlet />   
</main>
        </div>

      </div>
    </SubscriptionStatusProvider>
  )
}