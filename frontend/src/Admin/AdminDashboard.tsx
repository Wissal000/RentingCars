import { Link, useLocation, Outlet } from "react-router-dom";
import { Car, LayoutDashboard, Plus, Settings, Users } from "lucide-react";

const menuItems = [
  { title: "Dashboard", url: "/admin", icon: <LayoutDashboard size={18} /> },
  { title: "Cars", url: "/admin/cars", icon: <Car size={18} /> },
  { title: "Add Car", url: "/admin/cars/add", icon: <Plus size={18} /> },
  { title: "Booking", url: "/admin/cars/booking", icon: <Users size={18} /> },
  { title: "Settings", url: "admin/cars/setting", icon: <Settings size={18} /> },
];

const AdminDashboard = () => {
  const location = useLocation();

  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
      <div className="d-flex flex-column flex-shrink-0 p-3 bg-light border-end" style={{ width: "260px" }}>
        <div className="d-flex align-items-center mb-4">
          <Car className="me-2" />
          <span className="fs-5 fw-semibold">Car Rental Admin</span>
        </div>

        <ul className="nav nav-pills flex-column mb-auto">
          {menuItems.map((item) => (
            <li className="nav-item" key={item.title}>
              <Link
                to={item.url}
                className={`nav-link d-flex align-items-center gap-2 ${
                  location.pathname === item.url ? "active" : "text-dark"
                }`}
                aria-current={location.pathname === item.url ? "page" : undefined}
              >
                {item.icon}
                {item.title}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-auto text-muted small">© 2025 Car Rental Admin</div>
      </div>

      {/* Main content */}
      <main className="flex-grow-1 p-4" style={{ overflowY: "auto" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
