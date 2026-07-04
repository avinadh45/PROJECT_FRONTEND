import { Routes, Route, } from 'react-router-dom';
import UserProtectedRoute from './UserProtect.tsx';
import ServiceCenterProtectedRoute from './ServiceCenterProtectedRoute.tsx'; 
import MechanicProtectedRoute from './mechanicProtect.tsx';
import Dashboard from '../features/user/pages/Dashboard.tsx';
import Login from '../features/user/pages/Login.tsx'
import Register from '../features/user/pages/Register.tsx';
import Verify from '../features/user/pages/Verify.tsx';
import Landingpage from '../features/user/pages/Landingpage.tsx'
import ForgotPassword from "../features/user/pages/forgotpassword.tsx"
 import ResetPassword from '../features/user/pages/Resetpassword.tsx';
import ServiceCenterLogin from "../features/ServiceCenter/pages/login.tsx";
import ServiceCenterRegister from "../features/ServiceCenter/pages/register.tsx";
import ServiceCenterLayout from "../features/ServiceCenter/layouts/ServiceCenterLayout.tsx";
import ServiceCenterDashboard from "../features/ServiceCenter/pages/Dashboard.tsx";
 import ServiceCenterMechanic from "../features/ServiceCenter/pages/Mechanicpage.tsx"
 import MechanicLogin from '../features/Mechanic/pages/login.tsx';
 import MechanicBashboard from "../features/Mechanic/pages/Dahboard.tsx"
import AdminLogin from '../features/Admin/pages/Login.tsx';
import AdminDashboard from '../features/Admin/pages/Dashboard.tsx';
import AdminLayout from '../features/Admin/layout/adminLayout.tsx';
import AdminUserlist from "../features/Admin/pages/UserList.tsx"
import ServiceCenterList from '../features/Admin/pages/ServiceCenterList.tsx'
import UserDetails from '../features/Admin/pages/userDetails.tsx'
import ServiceCenterDetails from '../features/Admin/pages/ServiceCenterDetails.tsx'
import CategoryPage from '../features/Admin/pages/category.tsx';
import ServiceCenterForgotPassword from "../features/ServiceCenter/pages/forgotpassword.tsx"
import ServiceCenterResetPassword from "../features/ServiceCenter/pages/resetpassword.tsx"
 import EditCategory from "../features/Admin/pages/EditCategory.tsx"
import GarageVerificationPage from '../features/Admin/pages/GarageVerification.tsx';
import VerificationDetails from "../features/Admin/pages/verificationDetails";
import VerificationStatusPage from '../features/ServiceCenter/pages/verificationStatus.tsx';
import EditRegister from "../features/ServiceCenter/pages/Edite-register.tsx"
import AdminProtectedRoute from './AdminProtectedRoute.tsx';
import AddVehiclePage from '../features/user/pages/AddVehicle.tsx';
function AppRoutes() {
  // const authProps = useAuth();
  // const adminAuthProps = useAdminAuth();
  
  return (
    <Routes>
      <Route path="/" element={<Landingpage />} />
       <Route path="/login" element={<Login/>} />
       <Route path="/register" element={<Register />} />
      <Route path="/verify" element={<Verify/>} /> 
       <Route path="/dashboard" element={<UserProtectedRoute><Dashboard  /></UserProtectedRoute>} /> 
       <Route path='/add-vehicle' element={<UserProtectedRoute><AddVehiclePage/></UserProtectedRoute>} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} /> 
      <Route path="/service-center/login" element={<ServiceCenterLogin />} />
      <Route path="/service-center/register" element={<ServiceCenterRegister />} />
      <Route path="/service-center/forgot-password" element={<ServiceCenterForgotPassword />} />
       <Route path="/service-center/reset-password" element={<ServiceCenterResetPassword />} />
    <Route path='/service-center/verification-status' element={< VerificationStatusPage/>}/>
    <Route path='/service-center/application' element={< EditRegister/>}/>
      <Route path="/service-center" element={<ServiceCenterProtectedRoute><ServiceCenterLayout /></ServiceCenterProtectedRoute>}>
        <Route path="dashboard" element={<ServiceCenterDashboard />} />
        <Route path="mechanic" element={<ServiceCenterMechanic />} /> 
      </Route>
       <Route path="/mechanic/login" element={<MechanicLogin />} /> 
       <Route path="/mechanic/dashboard" element={<MechanicProtectedRoute><MechanicBashboard /></MechanicProtectedRoute>} /> 
 

<Route path="/admin/login" element={<AdminLogin />} />

<Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
  <Route path="dashboard" element={<AdminDashboard />} />
  <Route path="users" element={<AdminUserlist />} />
  <Route path="users/:id" element={<UserDetails />} />
  <Route path="garage" element={< ServiceCenterList/>}/>
  <Route path="garage/:id" element={<ServiceCenterDetails />} />
  <Route path="category" element={<CategoryPage/>}/>
  <Route path="category/edit/:id" element={<EditCategory />} />
  <Route path="garage-verification" element={<GarageVerificationPage/>}/>

<Route
  path="garage-verification/:id"
  element={<VerificationDetails />}
/>

</Route>

    </Routes>
  );
}

export default AppRoutes;
