import { Navigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";

const AuthRoute = ({ children }) => {
  const { user, checkingAuth } = useUserStore();

  if (checkingAuth) {
    return <div>Chargement...</div>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AuthRoute;
