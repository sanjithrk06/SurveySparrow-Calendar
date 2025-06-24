import { Calendar, Menu, X } from "lucide-react";
import { useState } from "react";
import dayjs from "dayjs";

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const today = dayjs();

  const menuItems = [{ icon: Calendar, active: true }];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5 text-gray-600" />
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-50"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
          fixed w-16 bg-white border-r border-gray-200 flex flex-col items-center py-6 z-50 min-h-screen h-full transition-transform duration-300 ease-in-out
        `}
      >
        {/* Logo */}
        <div className="relative mb-5">
          <div className="w-10 h-10 bg-red-50 border border-red-200 rounded-lg flex flex-col items-center justify-center">
            <span className="text-xs font-bold text-red-600 leading-none">
              {today.format("DD")}
            </span>
            <span className="text-xs font-medium text-red-500 leading-none uppercase">
              {today.format("MMM")}
            </span>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col space-y-4 mb-auto">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className={`
                w-10 h-10 rounded-lg flex items-center justify-center transition-colors
                ${
                  item.active
                    ? "bg-red-50 text-red-500"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                }
              `}
              aria-label={`Menu item ${index + 1}`}
            >
              <item.icon className="w-5 h-5" />
            </button>
          ))}
        </div>

        {/* Today's Date */}
        {/* <div className="relative">
          <div className="w-10 h-10 bg-red-50 border border-red-200 rounded-lg flex flex-col items-center justify-center">
            <span className="text-xs font-bold text-red-600 leading-none">
              {today.format("DD")}
            </span>
            <span className="text-xs font-medium text-red-500 leading-none uppercase">
              {today.format("MMM")}
            </span>
          </div>
        </div> */}
      </div>
    </>
  );
}
