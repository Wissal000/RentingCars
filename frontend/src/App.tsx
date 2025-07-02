import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./compoenents/Login";
import Register from "./compoenents/Register";
import Dashboard from "./Booking/Dashboard";
import Home from "./pages/Home";
import AdminDashboard from "./Admin/AdminDashboard";
import AddCar from "./Admin/AddCar";
import Cars from "./Admin/Cars";
import Booking from "./Admin/Booking";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      {/* Admin Dashboard route with nested pages */}
      <Route path="/admin" element={<AdminDashboard />}>
        <Route index element={<Navigate to="cars" replace />} />
        <Route path="cars" element={<Cars />} />
        <Route path="cars/add" element={<AddCar />} />
        <Route path="cars/booking" element={<Booking />} />
        {/* Add other admin nested routes here */}
      </Route>
    </Routes>
  );
}

export default App;
