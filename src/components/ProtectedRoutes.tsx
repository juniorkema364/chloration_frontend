import { Navigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";

const ProtectedRoute = ({ children }) => {
  const { user, checkingAuth } = useUserStore();

  if (checkingAuth) {
    return <div>Chargement...</div>; // ou un spinner
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
