import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const ServiceCenterProtectedRoute = ({
  children,
}: Props) => {
  const serviceCenter =
    localStorage.getItem("serviceCenter");

  return serviceCenter ? (
    <>{children}</>
  ) : (
    <Navigate
      to="/service-center/login"
      replace
    />
  );
};

export default ServiceCenterProtectedRoute;