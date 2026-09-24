
import AppRoutes from "./app/AppRoutes";
import { AuthProvider } from "./features/user/context/AuthContext";
import { MechanicAuthProvider } from "./features/Mechanic/context/MechanicAuthContext";
import { ServiceCenterAuthProvider } from "./features/ServiceCenter/context/useServiceCenterAuth";

function App() {
  return(
    <ServiceCenterAuthProvider>
    <MechanicAuthProvider>
    <AuthProvider>
     < AppRoutes/>
     </AuthProvider>
     </MechanicAuthProvider>
     </ServiceCenterAuthProvider>
      )
  
}

export default App;
