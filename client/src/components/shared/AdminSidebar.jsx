import React from "react";
import { NavLink } from "react-router-dom";
import {
  Users,
  LogOut,
  Bed,
  House,
  BookOpen,
} from "lucide-react";
import useAuthStore from "../../store/auth-store";

const AdminSidebar = () => {
  const { logout } = useAuthStore(); // ดึง logout จาก store

  return (
    <div className="bg-white w-64 text-white flex flex-col">
      <div className="h-24 bg-black flex items-center justify-center text-2xl font-bold">
        Admin Panel
      </div>

      <nav className="flex-1 px-2 py-4 space-y-2">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            isActive
              ? "bg-gray-900 rounded-md text-white px-4 py-2 flex items-center"
              : "text-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
          }
        >
          <Users className="mr-2" />
          ManageUser
        </NavLink>

        <NavLink
          to="rooms"
          className={({ isActive }) =>
            isActive
              ? "bg-gray-900 rounded-md text-white px-4 py-2 flex items-center"
              : "text-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
          }
        >
          <Bed className="mr-2" />
          Rooms
        </NavLink>

        <NavLink
          to="room-types"
          className={({ isActive }) =>
            isActive
              ? "bg-gray-900 rounded-md text-white px-4 py-2 flex items-center"
              : "text-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
          }
        >
          <BookOpen className="mr-2" />
          Room Types
        </NavLink>

        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "bg-gray-900 rounded-md text-white px-4 py-2 flex items-center"
              : "text-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
          }
        >
          <House className="mr-2" />
          Home-Hotel
        </NavLink>

        <NavLink
          to="/"
          onClick={logout}
          className="text-gray-300 px-4 py-2 hover:bg-red-600 hover:text-white rounded flex items-center"
        >
          <LogOut className="mr-2" />
          Logout
        </NavLink>
      </nav>
    </div>
  );
};

export default AdminSidebar;
