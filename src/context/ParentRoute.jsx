import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

function ParentRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.roleName === "USER") {
    return <Navigate to="/deny-user" />;
  }

  console.log("UserRoute user:", user.roleName, user.parents);
  return <Outlet />;
}

export default ParentRoute;
