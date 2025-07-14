import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

function UserRoute() {
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

  if (user.roleName === "PARENT") {
    return <Navigate to="/deny-user" />;
  }

  if (user.roleName === "USER" &&  user.parents.length === 0) {
    return <Navigate to="/deny-user" />;
  }
  console.log("UserRoute user:", user.roleName, user.parents);
  return <Outlet />;
}

export default UserRoute;
