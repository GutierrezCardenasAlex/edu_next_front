"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo o link principal */}
        <Link
          href="/"
          className="text-lg font-semibold text-blue-400 hover:text-blue-300 transition-colors"
        >
          Home
        </Link>

        {/* Menú */}
        <div className="flex items-center space-x-3">
          {session?.user ? (
            <>
              <Link
                href="/dashboard"
                className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-md text-sm transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={() => signOut()}
                className="bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-md text-sm transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-md text-sm transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-md text-sm transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
