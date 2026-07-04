import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axiosClient from "../shared/api/axiosClient";

interface Props { children: React.ReactNode; }

const AdminProtectedRoute = ({ children }: Props) => {
  const [auth, setAuth] = useState<"loading" | "ok" | "fail">("loading");

  useEffect(() => {
    axiosClient.get("/admin/dashboard")
      .then((res) => { console.log("me success", res); setAuth("ok"); })
    .catch((err) => { console.log("me failed", err.response?.status); setAuth("fail"); });
  }, []);

  if (auth === "loading") return null;
  if (auth === "fail") return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
};

export default AdminProtectedRoute;