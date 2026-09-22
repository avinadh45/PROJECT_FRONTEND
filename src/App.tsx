
import AppRoutes from "./app/AppRoutes";
import { AuthProvider } from "./features/user/context/AuthContext";

function App() {
  // const authProps = useAuth();
  // const adminAuthProps = useAdminAuth();

  
  return(
    <AuthProvider>
     < AppRoutes/>
     </AuthProvider>
      )
  
}

export default App;
