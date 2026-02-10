import AdminProtected from "@/components/AdminProtected";

export default function DashboardHome() {
  return (
    <AdminProtected>
      <div className="p-4 min-h-screen sm:p-6 space-y-6 sm:space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Admin Dashboard
          </h1>

          <p className="text-gray-600 mt-2 max-w-2xl text-sm sm:text-base">
            Manage your entire eCommerce system from one powerful and
            centralized interface.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Categories */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition active:scale-[0.99]">
            <div className="text-blue-600 text-lg sm:text-xl font-semibold mb-2">
              📁 Category Management
            </div>

            <ul className="text-gray-600 space-y-1 text-sm">
              <li>• Create new categories</li>
              <li>• Update category</li>
              <li>• Delete unused categories</li>
              <li>• Organize products under categories</li>
            </ul>
          </div>

          {/* Products */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition active:scale-[0.99]">
            <div className="text-green-600 text-lg sm:text-xl font-semibold mb-2">
              🛍 Product Management
            </div>

            <ul className="text-gray-600 space-y-1 text-sm">
              <li>• Add new products</li>
              <li>• Update product details/images & inventory</li>
              <li>• Delete products</li>
              <li>• Track product availability</li>
            </ul>
          </div>

          {/* Orders */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition active:scale-[0.99]">
            <div className="text-purple-600 text-lg sm:text-xl font-semibold mb-2">
              📦 Order Management
            </div>

            <ul className="text-gray-600 space-y-1 text-sm">
              <li>• View all customer orders</li>
              <li>• Create orders from admin panel - POS</li>
              <li>• Track order status</li>
              <li>• Manage order lifecycle</li>
            </ul>
          </div>

          {/* Payments */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition active:scale-[0.99]">
            <div className="text-yellow-600 text-lg sm:text-xl font-semibold mb-2">
              💳 Payment Integration
            </div>

            <ul className="text-gray-600 space-y-1 text-sm">
              <li>• Secure payment processing</li>
              <li>• Handle payment responses</li>
              <li>• Track transactions</li>
              <li>• Update order payment status</li>
            </ul>
          </div>

          {/* CRUD */}
          {/* <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition active:scale-[0.99]">
          <div className="text-red-600 text-lg sm:text-xl font-semibold mb-2">
            ⚙ Full CRUD Operations
          </div>

          <ul className="text-gray-600 space-y-1 text-sm">
            <li>• Create resources</li>
            <li>• Read and view data</li>
            <li>• Update existing records</li>
            <li>• Delete unwanted entries</li>
          </ul>
        </div> */}

          {/* System Control */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-4 sm:p-5 shadow-md">
            <div className="text-lg sm:text-xl font-semibold mb-2">
              🚀 Complete Store Control
            </div>

            <p className="text-sm opacity-90">
              Centralized admin panel to efficiently manage products,
              categories, orders, and payments with full visibility and control.
            </p>
          </div>
        </div>
      </div>
    </AdminProtected>
  );
}
