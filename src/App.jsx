import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Navigate } from "react-router-dom";

import Home from "./pages/home";
import NotFound from "./pages/notfound";
import Statistics from "./pages/statistics";
import Accounts from "./pages/accounts";
import Upload from "./pages/upload";
import Category from "./pages/category";
import Transactions from "./pages/transactions";
import Register from "./pages/register";
import Login from "./pages/login";

import { AuthProvider } from "./AuthContext";

import './css/bootstrap-icons.css'

function ProtectRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/register" />
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route path="/upload/:from?" element={<ProtectRoute><Upload /></ProtectRoute>} />
          <Route path="/" element={<ProtectRoute><Home /></ProtectRoute>} />
          <Route path="/home" element={<ProtectRoute><Home /></ProtectRoute>} />
          <Route path="/statistics" element={<ProtectRoute><Statistics /></ProtectRoute>} />
          <Route path="/accounts" element={<ProtectRoute><Accounts /></ProtectRoute>} />
          <Route path="/category" element={<ProtectRoute><Category /></ProtectRoute>} />
          <Route path="/transactions" element={<ProtectRoute><Transactions /></ProtectRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
