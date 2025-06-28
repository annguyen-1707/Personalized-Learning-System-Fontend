import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children, allowedRoles = [] }) {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!user) return <Navigate to="/admin/login" replace />;

    if (
        allowedRoles.length > 0 && !user?.roleName  === 'CONTENT_MANAGER' &&
        (!Array.isArray(user.role) || !user.role.some(role => allowedRoles.includes(role)))
    ) {
        return <Navigate to="/admin/deny" replace />;
    }

    return children;
}

