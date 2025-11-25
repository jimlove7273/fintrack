'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const NavContent = ({
  pathname,
  navLinks,
  onClose,
}: {
  pathname: string | null;
  navLinks: { href: string; label: string; icon: string }[];
  onClose?: () => void;
}) => (
  <nav className="flex-1 px-4 py-6">
    {navLinks.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        className={`flex items-center px-4 py-3 rounded-lg mt-2 ${
          pathname === link.href ||
          (link.href === '/accounts' &&
            pathname?.startsWith('/accounts/') &&
            !pathname?.startsWith('/accounts/transfer')) ||
          (link.href === '/' && pathname === '/')
            ? 'bg-indigo-100 text-indigo-700'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        onClick={onClose}
      >
        <svg
          className="h-5 w-5 mr-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={link.icon}
          />
        </svg>
        {link.label}
      </Link>
    ))}
  </nav>
);

export default function Header({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Don't show header on login page or when not authenticated
  if (pathname === '/login' || !isAuthenticated) {
    return <>{children}</>;
  }

  const navLinks = [
    {
      href: '/',
      label: 'Dashboard',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    },
    {
      href: '/accounts/transfer',
      label: 'Transfer Money',
      icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
    },
    {
      href: '/reports',
      label: 'Reports',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#f3f4f4]">
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden md:flex flex-col w-64 bg-white shadow-md">
        <div className="flex items-center justify-center h-16 bg-indigo-600">
          <div className="flex items-center space-x-2">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            <span className="text-white text-xl font-bold">FinTracker</span>
          </div>
        </div>
        <NavContent pathname={pathname} navLinks={navLinks} />
        <div className="px-4 py-3 text-xs text-gray-500 border-t border-gray-200">
          Finance Manager v1.0
        </div>
      </div>

      {/* Mobile header with hamburger menu */}
      <div className="md:hidden flex items-center justify-between p-4 bg-indigo-600 text-white">
        <div className="flex items-center space-x-2">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
          <span className="text-lg font-bold">FinTracker</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          className="p-2 rounded-md hover:bg-indigo-700 focus:outline-none"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile pull-down menu (dropdown under mobile header) */}
      <div className="md:hidden w-full">
        <div className="relative">
          <div
            className={`absolute left-0 right-0 z-50 bg-white shadow-xl overflow-hidden transition-all duration-300 origin-top ${
              isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
            id="mobile-menu"
            role="dialog"
            aria-hidden={!isMobileMenuOpen}
          >
            <div className="max-h-72 overflow-y-auto">
              <NavContent
                pathname={pathname}
                navLinks={navLinks}
                onClose={() => setIsMobileMenuOpen(false)}
              />
            </div>
            <div className="px-4 py-3 text-xs text-gray-500 border-t border-gray-200">
              Finance Manager v1.0
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="hidden md:flex justify-end items-center p-4 bg-white shadow">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-shadow-amber-100 text-gray-700">
              Hello, Admin
            </span>
            <button
              onClick={logout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Logout
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
}
