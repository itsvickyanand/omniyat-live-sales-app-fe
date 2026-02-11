"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function PaymentStatusPage() {
  const searchParams = useSearchParams();

  const [orderId, setOrderId] = useState(null);
  const [status, setStatus] = useState(null);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Fix hydration mismatch
  useEffect(() => {
    setOrderId(searchParams.get("orderId"));
    setStatus(searchParams.get("status"));
  }, [searchParams]);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE}/api/order/detail/${orderId}`, {
          signal: controller.signal,
          credentials: "include",
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || "Failed to fetch order");
        }

        setOrder(data.data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    return () => controller.abort();
  }, [orderId, API_BASE]);

  const getStatusStyle = () => {
    if (status === "SUCCESS" || status === "PAID")
      return "bg-green-100 text-green-700";

    if (status === "FAILED") return "bg-red-100 text-red-700";

    if (status === "CANCELLED") return "bg-yellow-100 text-yellow-700";

    return "bg-gray-100 text-gray-700";
  };

  const getStatusText = () => {
    if (status === "SUCCESS" || status === "PAID") return "Payment Successful";

    if (status === "FAILED") return "Payment Failed";

    if (status === "CANCELLED") return "Payment Cancelled";

    if (status === "PENDING") return "Payment Pending";

    return "Unknown Status";
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-5">
      {/* Header */}
      <div className="bg-white border shadow rounded-2xl p-6 space-y-3">
        <h1 className="text-2xl font-bold">Payment Status</h1>

        <p className="text-sm text-gray-600">
          Order ID:
          <span className="font-semibold break-all ml-1">
            {orderId || "N/A"}
          </span>
        </p>

        <div
          className={`px-4 py-2 rounded-xl text-sm font-semibold w-fit ${getStatusStyle()}`}
        >
          {getStatusText()}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white border shadow rounded-2xl p-6">
          Loading order details...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-600">
          {error}
        </div>
      )}

      {/* Order Details */}
      {!loading && order && (
        <div className="bg-white border shadow rounded-2xl p-6 space-y-2">
          <h2 className="text-lg font-semibold">Order Details</h2>

          <p>
            Product: <b>{order.Product?.name}</b>
          </p>

          <p>
            Quantity: <b>{order.quantity}</b>
          </p>

          <p>
            Amount: <b>AED {order.amount}</b>
          </p>

          <p>
            Payment Status: <b>{order.paymentStatus}</b>
          </p>

          <p>
            Customer: <b>{order.customerName}</b>
          </p>

          <p>
            Email: <b>{order.customerEmail}</b>
          </p>

          <p>
            Phone: <b>{order.customerPhone}</b>
          </p>
        </div>
      )}

      {/* Not found */}
      {!loading && !order && !error && (
        <div className="bg-gray-50 border rounded-2xl p-6">
          Order not found.
        </div>
      )}
    </div>
  );
}
