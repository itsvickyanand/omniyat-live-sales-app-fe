"use client";

import { useEffect, useState } from "react";
import {
  cancelOrder,
  deleteOrder,
  getAllOrders,
  markOrderPaid,
} from "@/lib/order.api";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    const res = await getAllOrders();
    const sorted = (res.data || []).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setOrders(res.data || []);
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await fetchOrders();
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleCancel = async (orderId) => {
    if (!confirm("Cancel this order? Stock will be restored.")) return;

    try {
      setLoading(true);
      await cancelOrder(orderId);
      await fetchOrders();
      alert("Order cancelled ✅");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (
      !confirm(
        "Delete this order permanently? Stock will be restored if needed."
      )
    )
      return;

    try {
      setLoading(true);
      await deleteOrder(orderId);
      await fetchOrders();
      alert("Order deleted ✅");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPaid = async (orderId) => {
    const method = prompt("Payment method? (CASH/UPI/CARD/OTHER)", "CASH");
    if (!method) return;

    const ref = prompt("Payment reference (optional)", "");

    try {
      setLoading(true);
      await markOrderPaid(orderId, {
        paymentMethod: method,
        paymentRef: ref || null,
      });
      await fetchOrders();
      alert("Marked PAID ✅");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const badge = (text, color) => (
    <span className={`text-xs px-3 py-1 rounded-full ${color}`}>{text}</span>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Orders</h2>
          <p className="text-gray-600 text-sm">
            Manage POS orders (cancel / mark paid / delete) ✅
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="w-fit px-4 py-2 rounded-xl bg-black text-white text-sm disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="bg-white border rounded-2xl shadow p-6 text-gray-500">
          No orders found
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {orders.map((o) => (
            <div
              key={o.id}
              className="bg-white border rounded-2xl shadow p-4 flex flex-col gap-3"
            >
              {/* Top */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-semibold break-all">{o.id}</p>

                  <div className="mt-2 text-sm">
                    <p className="font-semibold">{o?.product?.name || "N/A"}</p>
                    <p className="text-gray-600 text-xs">
                      Qty: <b>{o.quantity}</b> • Amount: <b>AED {o.amount}</b>
                    </p>
                  </div>
                </div>

                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-xl border overflow-hidden bg-gray-50 shrink-0">
                  {o?.product?.thumbnail ? (
                    <img
                      src={o.product.thumbnail}
                      alt={o?.product?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                      No Img
                    </div>
                  )}
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2">
                {badge(
                  o.status,
                  o.status === "CANCELLED"
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                )}

                {badge(
                  o.paymentStatus,
                  o.paymentStatus === "PAID"
                    ? "bg-green-100 text-green-700"
                    : o.paymentStatus === "FAILED"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-800"
                )}

                {badge(o.paymentMode, "bg-gray-100 text-gray-700")}
              </div>

              {/* Customer */}
              <div className="text-xs text-gray-600 space-y-1">
                <p>
                  Customer: <b>{o.customerName || "Walk-in"}</b>
                </p>
                {o.customerPhone && <p>Phone: {o.customerPhone}</p>}
                {o.customerPhone && <p>Phone: {o.customerEmail}</p>}
                {o.paymentMethod && <p>Method: {o.paymentMethod}</p>}

                {o.paymentRef && <p>Ref: {o.paymentRef}</p>}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-2">
                {o.status !== "CANCELLED" && o.paymentStatus === "PENDING" && (
                  <button
                    onClick={() => handleMarkPaid(o.id)}
                    disabled={loading}
                    className="flex-1 px-3 py-2 rounded-xl text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:opacity-50"
                  >
                    Mark Paid
                  </button>
                )}

                {o.status !== "CANCELLED" && (
                  <button
                    onClick={() => handleCancel(o.id)}
                    disabled={loading}
                    className="flex-1 px-3 py-2 rounded-xl text-sm bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                )}

                <button
                  onClick={() => handleDeleteOrder(o.id)}
                  disabled={loading}
                  className="flex-1 px-3 py-2 rounded-xl text-sm bg-black text-white hover:opacity-90 disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
