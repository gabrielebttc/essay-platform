import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { User } from '../types';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  user: User;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const linkClasses = "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium";
  const mobileLinkClasses = "block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white";

  const studentLinks = (
    <>
      <NavLink to="/dashboard" className={({ isActive }) => `${linkClasses} ${isActive ? 'bg-gray-900 text-white' : ''}`}>Dashboard</NavLink>
      <NavLink to="/submit" className={({ isActive }) => `${linkClasses} ${isActive ? 'bg-gray-900 text-white' : ''}`}>Submit Essay</NavLink>
      <NavLink to="/essays" className={({ isActive }) => `${linkClasses} ${isActive ? 'bg-gray-900 text-white' : ''}`}>My Essays</NavLink>
    </>
  );

  const studentLinksMobile = (
    <>
      <NavLink to="/dashboard" className={({ isActive }) => `${mobileLinkClasses} ${isActive ? 'bg-gray-900 text-white' : ''}`}>Dashboard</NavLink>
      <NavLink to="/submit" className={({ isActive }) => `${mobileLinkClasses} ${isActive ? 'bg-gray-900 text-white' : ''}`}>Submit Essay</NavLink>
      <NavLink to="/essays" className={({ isActive }) => `${mobileLinkClasses} ${isActive ? 'bg-gray-900 text-white' : ''}`}>My Essays</NavLink>
    </>
  );

  const adminLinks = (
    <>
      <NavLink to="/admin/dashboard" className={({ isActive }) => `${linkClasses} ${isActive ? 'bg-gray-900 text-white' : ''}`}>Dashboard</NavLink>
      <NavLink to="/admin/submissions" className={({ isActive }) => `${linkClasses} ${isActive ? 'bg-gray-900 text-white' : ''}`}>Submission History</NavLink>
    </>
  );

  const adminLinksMobile = (
    <>
      <NavLink to="/admin/dashboard" className={({ isActive }) => `${mobileLinkClasses} ${isActive ? 'bg-gray-900 text-white' : ''}`}>Dashboard</NavLink>
      <NavLink to="/admin/submissions" className={({ isActive }) => `${mobileLinkClasses} ${isActive ? 'bg-gray-900 text-white' : ''}`}>Submission History</NavLink>
    </>
  );

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/dashboard" className="text-white font-bold text-xl">
                IELTS Platform
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {user.role === 'admin' ? adminLinks : studentLinks}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <span className="text-gray-300 mr-4">Welcome, {user.name}</span>
              <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium">
                Logout
              </button>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user.role === 'admin' ? adminLinksMobile : studentLinksMobile}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
              </div>
              <div className="ml-3">
                <div className="text-base font-medium leading-none text-white">{user.name}</div>
                <div className="text-sm font-medium leading-none text-gray-400">{user.email}</div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <button
                onClick={onLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;