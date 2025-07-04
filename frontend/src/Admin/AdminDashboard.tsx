import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Car, LayoutDashboard, Plus, Users, LogOut, Menu } from "lucide-react";
import { useState } from "react";

const navItems = [
  { title: "Dashboard", url: "/admin", icon: <LayoutDashboard className="w-4 h-4" /> },
  { title: "Cars", url: "/admin/cars", icon: <Car className="w-4 h-4" /> },
  { title: "Add Car", url: "/admin/cars/add", icon: <Plus className="w-4 h-4" /> },
  { title: "Booking", url: "/admin/cars/booking", icon: <Users className="w-4 h-4" /> },
];

export default function AdminDashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const ViewUser = () => navigate("/dashboard");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="text-lg font-bold text-blue-700 flex items-center gap-2">
            <Car className="w-5 h-5" />
            Car Rental Admin
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.title}
                to={item.url}
                className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-md ${
                  location.pathname === item.url
                    ? "text-blue-700 border-b-2 border-blue-700"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* View User Button */}
          <button
            className="ml-4 hidden md:flex items-center gap-2 text-sm text-white bg-red-500 px-3 py-1.5 rounded hover:bg-red-600"
            onClick={ViewUser}
          >
            <LogOut className="w-4 h-4" />
            User View
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {menuOpen && (
          <div className="md:hidden px-4 pb-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.title}
                to={item.url}
                className={`block px-3 py-2 rounded text-sm ${
                  location.pathname === item.url
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.title}
              </Link>
            ))}
            <button
              onClick={ViewUser}
              className="w-full px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600"
            >
              Switch to User View
            </button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
