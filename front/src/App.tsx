import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Signup } from "./pages/signup";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import type { RootState, AppDispatch } from "./store/store";
import { getUserInfo } from "./store/auth/authSlice";
import LoadingScreen from "./components/LoadingScreen";
import Dashboard from "./pages/protected";
import PainterDashboard from "./pages/painter-dashboard";
import CustomerDashboard from "./pages/customer-dashboard";
import { Login } from "./pages/login";
import { UserRole } from "./types/user";

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

const PrivateRoute = ({ children, requiredRole }: PrivateRouteProps) => {
  const authState = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  
  useEffect(() => {
    if (authState.isAuthenticated && !authState.userInfo && !authState.loading) {
      dispatch(getUserInfo());
    }
  }, [authState.isAuthenticated, authState.userInfo, authState.loading, dispatch]);
  
  if (authState.isAuthenticated && authState.loading) {
    return <LoadingScreen message="Verifying access..." />;
  }

  if (!authState.isAuthenticated) {
    return <Navigate to={`/login`} replace state={{ from: location }} />;
  }
  
  if (requiredRole && authState.userInfo?.role !== requiredRole) {
    const redirectPath = authState.userInfo?.role === UserRole.PAINTER 
      ? '/painter-dashboard' 
      : '/customer-dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

function App() {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  
  const getHomeRoute = () => {
    if (!userInfo) return <Dashboard />;
    
    return userInfo.role === UserRole.PAINTER
      ? <Navigate to="/painter-dashboard" replace />
      : <Navigate to="/customer-dashboard" replace />;
  };
  
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <Login />
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              {getHomeRoute()}
            </PrivateRoute>
          }
        />
        <Route
          path="/painter-dashboard"
          element={
            <PrivateRoute requiredRole={UserRole.PAINTER}>
              <PainterDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/customer-dashboard"
          element={
            <PrivateRoute requiredRole={UserRole.CUSTOMER}>
              <CustomerDashboard />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
