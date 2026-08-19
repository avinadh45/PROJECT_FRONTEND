import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import UserProtectedRoute from './UserProtect.tsx';
import ServiceCenterProtectedRoute from './ServiceCenterProtectedRoute.tsx';
import MechanicProtectedRoute from './mechanicProtect.tsx';
import AdminProtectedRoute from './AdminProtectedRoute.tsx';
import ServiceCenterLayout from "../features/ServiceCenter/layouts/ServiceCenterLayout.tsx";
import AdminLayout from '../features/Admin/layout/adminLayout.tsx';
import PageLoader from '../features/user/components/PageLoader.tsx'; 

// ── User ──────────────────────────────────────────────
const Landingpage = lazy(() => import('../features/user/pages/Landingpage.tsx'));
const Login = lazy(() => import('../features/user/pages/Login.tsx'));
const Register = lazy(() => import('../features/user/pages/Register.tsx'));
const Verify = lazy(() => import('../features/user/pages/Verify.tsx'));
const Dashboard = lazy(() => import('../features/user/pages/Dashboard.tsx'));
const ForgotPassword = lazy(() => import('../features/user/pages/forgotpassword.tsx'));
const ResetPassword = lazy(() => import('../features/user/pages/Resetpassword.tsx'));
const AddVehiclePage = lazy(() => import('../features/user/pages/AddVehicle.tsx'));
const VehicleList = lazy(() => import('../features/user/pages/VehicleList.tsx'));
const EditVehiclePage = lazy(() => import('../features/user/pages/EditVehicle.tsx'));
const VehicleDetailPage = lazy(()=> import('../features/user/pages/VehicleDetails.tsx'))
// ── Service Center ────────────────────────────────────
const ServiceCenterLogin = lazy(() => import("../features/ServiceCenter/pages/login.tsx"));
const ServiceCenterRegister = lazy(() => import("../features/ServiceCenter/pages/register.tsx"));
const ServiceCenterDashboard = lazy(() => import("../features/ServiceCenter/pages/Dashboard.tsx"));
const ServiceCenterMechanic = lazy(() => import("../features/ServiceCenter/pages/Mechanicpage.tsx"));
const ServiceCenterForgotPassword = lazy(() => import("../features/ServiceCenter/pages/forgotpassword.tsx"));
const ServiceCenterResetPassword = lazy(() => import("../features/ServiceCenter/pages/resetpassword.tsx"));
const VerificationStatusPage = lazy(() => import('../features/ServiceCenter/pages/verificationStatus.tsx'));
const EditRegister = lazy(() => import("../features/ServiceCenter/pages/Edite-register.tsx"));
const Service = lazy(()=> import("../features/ServiceCenter/pages/Services.tsx") )
const SubscriptionPage = lazy(()=> import("../features/ServiceCenter/pages/SubscriptionPage.tsx"))
const Slot = lazy(()=> import('../features/ServiceCenter/pages/slot.tsx'))

// ── Mechanic ──────────────────────────────────────────
const MechanicLogin = lazy(() => import('../features/Mechanic/pages/login.tsx'));
const MechanicBashboard = lazy(() => import("../features/Mechanic/pages/Dahboard.tsx"));

// ── Admin ─────────────────────────────────────────────
const AdminLogin = lazy(() => import('../features/Admin/pages/Login.tsx'));
const AdminDashboard = lazy(() => import('../features/Admin/pages/Dashboard.tsx'));
const AdminUserlist = lazy(() => import("../features/Admin/pages/UserList.tsx"));
const ServiceCenterList = lazy(() => import('../features/Admin/pages/ServiceCenterList.tsx'));
const UserDetails = lazy(() => import('../features/Admin/pages/userDetails.tsx'));
const ServiceCenterDetails = lazy(() => import('../features/Admin/pages/ServiceCenterDetails.tsx'));
const CategoryPage = lazy(() => import('../features/Admin/pages/category.tsx'));
const EditCategory = lazy(() => import("../features/Admin/pages/EditCategory.tsx"));
const GarageVerificationPage = lazy(() => import('../features/Admin/pages/GarageVerification.tsx'));
const VerificationDetails = lazy(() => import("../features/Admin/pages/verificationDetails"));
const Subscription  = lazy(()=> import("../features/Admin/pages/Subscription.tsx"))

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/dashboard" element={<UserProtectedRoute><Dashboard /></UserProtectedRoute>} />
        <Route path='/add-vehicle' element={<UserProtectedRoute><AddVehiclePage /></UserProtectedRoute>} />
        <Route path='/my-vehicle' element={<UserProtectedRoute><VehicleList /></UserProtectedRoute>} />
         <Route path='/my-vehicle/:id' element={<UserProtectedRoute><VehicleDetailPage /></UserProtectedRoute>} />
        <Route path='/vehicle/update/:id' element={<UserProtectedRoute><EditVehiclePage /></UserProtectedRoute>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/service-center/login" element={<ServiceCenterLogin />} />
        <Route path="/service-center/register" element={<ServiceCenterRegister />} />
        <Route path="/service-center/forgot-password" element={<ServiceCenterForgotPassword />} />
        <Route path="/service-center/reset-password" element={<ServiceCenterResetPassword />} />
        <Route path='/service-center/verification-status' element={<VerificationStatusPage />} />
        <Route path='/service-center/application' element={<EditRegister />} />
        <Route path="/service-center" element={<ServiceCenterProtectedRoute><ServiceCenterLayout /></ServiceCenterProtectedRoute>}>
          <Route path="dashboard" element={<ServiceCenterDashboard />} />
          <Route path="mechanic" element={<ServiceCenterMechanic />} />
          <Route path='service' element={<Service/>}/>
          <Route path='subscription' element={<SubscriptionPage/>}/>
          <Route path='slot' element={<Slot/>}/>
        </Route>
        <Route path="/mechanic/login" element={<MechanicLogin />} />
        <Route path="/mechanic/dashboard" element={<MechanicProtectedRoute><MechanicBashboard /></MechanicProtectedRoute>} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUserlist />} />
          <Route path="users/:id" element={<UserDetails />} />
          <Route path="garage" element={<ServiceCenterList />} />
          <Route path="garage/:id" element={<ServiceCenterDetails />} />
          <Route path="category" element={<CategoryPage />} />
          <Route path="category/edit/:id" element={<EditCategory />} />
          <Route path="garage-verification" element={<GarageVerificationPage />} />
          <Route path="garage-verification/:id" element={<VerificationDetails />} />
          <Route path='subscription' element={<Subscription/>}/>
        </Route>
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;