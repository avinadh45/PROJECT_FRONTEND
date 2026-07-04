
import { useEffect,useState } from "react";
import { Navigate } from "react-router-dom";
import axiosClient from "../shared/api/axiosClient";


interface Props { children: React.ReactNode; }

const UserProtectedRoute = ({ children }: Props) => {
  const [auth, setAuth] = useState<"loading" | "ok" | "fail">("loading");

  useEffect(() => {
    axiosClient.get("/dashboard")
      .then(() => setAuth("ok"))
      .catch(() => setAuth("fail"));
  }, []);

  if (auth === "loading") return null;
  if (auth === "fail") return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default UserProtectedRoute;




// interface Props { children: React.ReactNode;}

// const UserProtectedRoute = ({ children }: Props) => {
//   const user = localStorage.getItem("user");

//   return user ? (
//     <>{children}</>
//   ) : (
//     <Navigate to="/login" replace />
//   );
// };
// export default UserProtectedRoute;