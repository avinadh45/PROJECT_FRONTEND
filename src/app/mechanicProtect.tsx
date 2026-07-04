import { useEffect,useState } from "react";
import { Navigate } from "react-router-dom";
import axiosClient from "../shared/api/axiosClient";

interface Props { children: React.ReactNode; }

const MechanicProtectedRoute = ({ children }: Props) => {
  const [auth, setAuth] = useState<"loading" | "ok" | "fail">("loading");

  useEffect(() => {
    axiosClient.get("/mechanic/dashboard")
      .then(() => setAuth("ok"))
      .catch(() => setAuth("fail"));
  }, []);

  if (auth === "loading") return null;
  if (auth === "fail") return <Navigate to="/mechanic/login" replace />;
  return <>{children}</>;
};

export default MechanicProtectedRoute;