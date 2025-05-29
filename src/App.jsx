import { Routes, Route, BrowserRouter } from "react-router-dom";

import Test from "./pages/test";
import Home from "./pages/home";
import NotFound from "./pages/notfound";
import Statistics from "./pages/statistics";
import Accounts from "./pages/accounts";
import Upload from "./pages/upload";
import Category from "./pages/category";
import Transactions from "./pages/transactions";
import Register from "./pages/register";
import Login from "./pages/login";
import Profile from "./pages/profile/profile";
import Settings from "./pages/profile/settings";
import Personal_Info from "./pages/profile/personal_info";
import Password from "./pages/profile/password";

import { AuthProvider } from "./AuthContext";
import { NotificationProvider } from "./NotificationContext";
import { ProtectRoute } from "./components/ProtectRoute";

import { Notification } from "./components/Notification";

import './css/bootstrap-icons.css'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
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
            <Route path="/test" element={<ProtectRoute><Test /></ProtectRoute>} />

            <Route path="/profile" element={<ProtectRoute><Profile /></ProtectRoute>} />
            <Route path="/profile/personal_information" element={<ProtectRoute><Personal_Info /></ProtectRoute>} />
            <Route path="/profile/settings" element={<ProtectRoute><Settings /></ProtectRoute>} />
            <Route path="/profile/settings/change_password" element={<ProtectRoute><Password /></ProtectRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
          <Notification />
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
