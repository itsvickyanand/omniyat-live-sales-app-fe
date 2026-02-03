import Link from "next/link";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-5">
        <h1 className="text-xl font-bold mb-6">Ecom Admin ✅</h1>

        <nav className="flex flex-col gap-3">
          <Link className="hover:text-blue-600" href="/dashboard">
            Dashboard Home
          </Link>
          <Link className="hover:text-blue-600" href="/dashboard/categories">
            Categories
          </Link>
          <Link className="hover:text-blue-600" href="/dashboard/products">
            Products
          </Link>
          <Link className="hover:text-blue-600" href="/dashboard/orders">
            Orders
          </Link>
          <Link className="hover:text-blue-600" href="/dashboard/orders/new">
            Create order
          </Link>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
