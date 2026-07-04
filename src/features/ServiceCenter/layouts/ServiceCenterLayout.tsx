// import { useState } from "react"
// import { Outlet } from "react-router-dom"
// import Sidebar from "../components/sideBar"
// import Topbar from "../components/TopBar"
// // import Dashboard from "../pages/ServiceCenter/Dashboard"
// // import MechanicPage from "../pages/ServiceCenter/Mechanicpage"
// // import PlaceholderPage from "../pages/ServiceCenter/placeholder"
// import type { PageKey } from "../types"

// const PAGE_TITLES: Record<PageKey, { title: string; subtitle: string }> = {
//   dashboard: { title: "Dashboard", subtitle: "Welcome back, Service Center" },
//   bookings: { title: "Bookings", subtitle: "Manage your service appointments" },
//   slot: { title: "Slot Management", subtitle: "Configure your availability" },
//   concern: { title: "Concern Requests", subtitle: "Customer support tickets" },
//   garage: { title: "Garage", subtitle: "Manage your garage details" },
//   mechanic: { title: "Mechanics", subtitle: "Your team overview" },
//   service: { title: "Services", subtitle: "Configure your service offerings" },
//   earnings: { title: "Earnings", subtitle: "Financial overview & reports" },
// }

// export default function ServiceCenterLayout() {

//   // const [activePage, setActivePage] = useState<PageKey>("dashboard")
//   const [collapsed, setCollapsed] = useState(false)

//   const meta = PAGE_TITLES[activePage]

  // const renderPage = () => {

  //   switch (activePage) {

  //     case "dashboard":
  //       return <Dashboard />

  //     case "mechanic":
  //       return <MechanicPage />

  //     default:
  //       return <PlaceholderPage page={activePage} />

  //   }

  // }

//   return (
//     <div className="flex h-screen w-full overflow-hidden bg-[#060a14]">

//       <Sidebar
//         activePage={activePage}
//         onNavigate={setActivePage}
//         collapsed={collapsed}
//         onToggle={() => setCollapsed(c => !c)}
//       />

//       <div className="flex-1 flex flex-col min-w-0">

//         <Topbar title={meta.title} subtitle={meta.subtitle} />

//         {/* {renderPage()} */}

//       </div>

//     </div>
//   )
// }

import { useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "../components/sideBar"
import Topbar from "../components/TopBar"

export default function ServiceCenterLayout() {

  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#060a14]">

      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(c => !c)}
      />

      <div className="flex-1 flex flex-col min-w-0">

        <Topbar title="Service Center" subtitle="Manage your platform" />

        <Outlet />   

      </div>

    </div>
  )
}