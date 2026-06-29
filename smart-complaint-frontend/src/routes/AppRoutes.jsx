import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import ComplaintList from "../pages/ComplaintList";
import ComplaintDetails from "../pages/ComplaintDetails";
import ComplaintForm from "../pages/ComplaintForm";
import UserDashboard from "../pages/UserDashboard";
import OfficerDashboard from "../pages/OfficerDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import AdminUsers from "../pages/AdminUsers";
import Profile from "../pages/Profile";
import ProtectedRoute from "../components/ProtectedRoute";
import ForgetPassword from "../pages/ForgetPassword";
import Verify from "../pages/Verify";
import Services from "../pages/Services";
import ContactUs from "../pages/ContactUs";
import AboutUs from "../pages/AboutUs";

const Guard = ({ children, roles }) => <ProtectedRoute roles={roles}>{children}</ProtectedRoute>;

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/verify" element={<Verify />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgetPassword />} />
      <Route path="/" element={<Guard><Home /></Guard>} />
      <Route path="/dashboard" element={<Guard roles={["USER"]}><UserDashboard /></Guard>} />
      <Route path="/officer" element={<Guard roles={["OFFICER"]}><OfficerDashboard /></Guard>} />
      <Route path="/admin" element={<Guard roles={["ADMIN"]}><AdminDashboard /></Guard>} />
      <Route path="/admin/users" element={<Guard roles={["ADMIN"]}><AdminUsers /></Guard>} />
      <Route path="/complaints" element={<Guard><ComplaintList /></Guard>} />
      <Route path="/complaints/new" element={<Guard roles={["USER"]}><ComplaintForm /></Guard>} />
      <Route path="/complaints/:id" element={<Guard><ComplaintDetails /></Guard>} />
      <Route path="/complaints/:id/edit" element={<Guard roles={["USER"]}><ComplaintForm /></Guard>} />
      <Route path="/profile" element={<Guard><Profile /></Guard>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
