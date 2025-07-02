import { Navigate } from "react-router-dom";
import { useLoginContext } from "../../contexts/LoginContext";

function ProtectedNonUserRoute({ children }) {
  const { isLoggedIn } = useLoginContext();
  return !isLoggedIn ? children : <Navigate to="/" />;
}

export default ProtectedNonUserRoute;
