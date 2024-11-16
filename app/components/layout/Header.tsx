"use client";
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useLogout } from "@account-kit/react";

export default function Header({ title = "Dashboard" }) {
  const { logout } = useLogout();

  return (
    <div className="bg-blue-900 border-b border-blue-800">
      <div className="py-4 px-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <div className="flex items-center">
          {/* Currency Display */}
          <div className="flex items-center mr-8 bg-blue-800/40 px-4 py-2 rounded-lg">
            <div className="flex items-center space-x-2 text-blue-100">
              <span className="text-2xl">💎</span>
              <span className="font-medium">0</span>
            </div>
            <a 
              href="#" 
              className="ml-2 px-2 py-1 bg-blue-700 hover:bg-blue-600 
                         rounded text-sm text-blue-100 transition-colors"
            >
              +
            </a>
          </div>

          {/* Logout Button */}
          <button 
            onClick={() => logout()}
            className="px-4 py-2 bg-blue-800 hover:bg-blue-700 text-blue-100 
                       rounded-lg flex items-center space-x-2 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
