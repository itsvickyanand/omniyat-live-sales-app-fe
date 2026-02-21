"use client";

import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function CcavenueOrderLookup() {
  const [orderId, setOrderId] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFetch = async () => {
    if (!orderId.trim()) {
      setError("Order ID is required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setData(null);

      const res = await fetch(`${API}/api/admin/ccavenue/order/${orderId}`);

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch order");
      }

      setData(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderObject = (obj, bgColor) => {
    if (!obj) return <p>No data available</p>;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Object.entries(obj).map(([key, value]) => (
          <div key={key} className={`${bgColor} p-3 rounded-xl border text-sm`}>
            <p className="text-xs text-gray-500 break-all">{key}</p>
            <p className="font-medium break-all">
              {value !== null && value !== "" ? String(value) : "-"}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      <h2 className="text-2xl font-bold">CCAvenue Single Order Lookup</h2>

      {/* Input Section */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Paste Order UUID here..."
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="flex-1 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />

          <button
            onClick={handleFetch}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-black text-white text-sm disabled:opacity-50"
          >
            {loading ? "Fetching..." : "Fetch Order"}
          </button>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
      </div>

      {/* Results */}
      {data && (
        <div className="space-y-8">
          {/* LOCAL ORDER */}
          {/* <div>
            <h3 className="text-lg font-semibold mb-3">
              Local Order (Database)
            </h3>

            <div className="bg-gray-50 p-4 rounded-2xl border overflow-x-auto">
              {renderObject(data.localOrder, "bg-white")}
            </div>
          </div> */}

          {/* GATEWAY ORDER */}
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Gateway Order (CCAvenue)
            </h3>

            <div className="bg-indigo-50 p-4 rounded-2xl border overflow-x-auto">
              {data.gatewayOrder
                ? renderObject(data.gatewayOrder, "bg-white")
                : "No gateway data available"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
