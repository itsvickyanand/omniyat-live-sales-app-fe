// import Link from "next/link";

// export default function DashboardLayout({ children }) {
//   return (
//     <div className="min-h-screen flex bg-gray-100">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white border-r p-5">
//         <h1 className="text-xl font-bold mb-6">Ecom Admin ✅</h1>

//         <nav className="flex flex-col gap-3">
//           <Link className="hover:text-blue-600" href="/dashboard">
//             Dashboard Home
//           </Link>
//           <Link className="hover:text-blue-600" href="/dashboard/categories">
//             Manage Categories
//           </Link>
//           <Link className="hover:text-blue-600" href="/dashboard/products">
//             Manage Products
//           </Link>
//           <Link className="hover:text-blue-600" href="/dashboard/orders">
//             Manage Orders
//           </Link>
//           <Link className="hover:text-blue-600" href="/dashboard/orders/new">
//             Create POS/Admin order
//           </Link>
//         </nav>
//       </aside>

//       {/* Content */}
//       <main className="flex-1 p-6">{children}</main>
//     </div>
//   );
// }

// "use client";

// import Link from "next/link";
// import { useState } from "react";

// export default function DashboardLayout({ children }) {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="min-h-screen flex bg-gray-100">
//       {/* Mobile Overlay */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/40 z-40 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`
//           fixed lg:static z-50 top-0 left-0 min-h-screen
//           w-64 bg-white border-r p-5
//           transform transition-transform duration-300
//           ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
//           lg:translate-x-0
//         `}
//       >
//         <h1 className="text-xl font-bold mb-6">Navigations</h1>

//         <nav className="flex flex-col gap-3">
//           <Link
//             className="hover:text-blue-600"
//             href="/dashboard"
//             onClick={() => setSidebarOpen(false)}
//           >
//             Dashboard Home
//           </Link>

//           <Link
//             className="hover:text-blue-600"
//             href="/dashboard/categories"
//             onClick={() => setSidebarOpen(false)}
//           >
//             Manage Categories
//           </Link>

//           <Link
//             className="hover:text-blue-600"
//             href="/dashboard/products"
//             onClick={() => setSidebarOpen(false)}
//           >
//             Manage Products
//           </Link>

//           <Link
//             className="hover:text-blue-600"
//             href="/dashboard/orders"
//             onClick={() => setSidebarOpen(false)}
//           >
//             Manage Orders
//           </Link>

//           <Link
//             className="hover:text-blue-600"
//             href="/dashboard/orders/new"
//             onClick={() => setSidebarOpen(false)}
//           >
//             Create POS/Admin order
//           </Link>
//         </nav>
//       </aside>

//       {/* Content Area */}
//       <div className="flex-1 flex flex-col w-full">
//         {/* Mobile Header */}
//         <div className="lg:hidden bg-white border-b p-4 flex items-center justify-between">
//           <button onClick={() => setSidebarOpen(true)} className="text-xl">
//             ☰
//           </button>

//           <Link href="/dashboard" className="ml-4 font-semibold">
//             Admin
//           </Link>
//           <Link className="hover:text-blue-600" href="/admin">
//             Login
//           </Link>
//         </div>

//         {/* Main Content */}
//         <main className="flex-1 p-4 sm:p-6">{children}</main>
//       </div>
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const router = useRouter();

  // CHECK AUTH
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API}/admin/check`, {
          credentials: "include",
        });

        if (!res.ok) {
          router.push("/admin");
        } else {
          setIsAuthenticated(true);
        }
      } catch {
        router.push("/admin");
      }
    };

    checkAuth();
  }, [router]);

  // LOGOUT
  const handleLogout = async () => {
    await fetch(`${API}/admin/logout`, {
      method: "POST",
      credentials: "include",
    });

    router.push("/admin");
  };

  // prevent flash before auth check
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static z-50 top-0 left-0 min-h-screen
          w-64 bg-white border-r p-5
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <h1 className="text-xl font-bold mb-6">Navigations</h1>

        <nav className="flex flex-col gap-3">
          <Link href="/dashboard" onClick={() => setSidebarOpen(false)}>
            Dashboard Home
          </Link>

          <Link
            href="/dashboard/categories"
            onClick={() => setSidebarOpen(false)}
          >
            Manage Categories
          </Link>
          <Link href="/dashboard/artist" onClick={() => setSidebarOpen(false)}>
            Manage Artists
          </Link>
          <Link
            href="/dashboard/products"
            onClick={() => setSidebarOpen(false)}
          >
            Manage Products
          </Link>

          <Link href="/dashboard/orders" onClick={() => setSidebarOpen(false)}>
            Manage Orders
          </Link>

          <Link
            href="/dashboard/orders/new"
            onClick={() => setSidebarOpen(false)}
          >
            Create POS/Admin order
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-800 text-center mt-4 border-1"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Content Area */}
      <div className="flex-1 flex flex-col w-full">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b p-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)}>☰</button>

          <Link href="/dashboard" className="font-semibold">
            Admin
          </Link>

          {/* Logout visible when authenticated */}
          <button onClick={handleLogout} className="text-red-600 border-1 p-2">
            Logout
          </button>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
