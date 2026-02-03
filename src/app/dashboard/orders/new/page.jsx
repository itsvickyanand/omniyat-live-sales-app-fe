"use client";

import { useEffect, useMemo, useState } from "react";
import { getAllProducts } from "@/lib/product.api";
import { createOrder } from "@/lib/order.api";

export default function NewOrderPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ form
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [paymentStatus, setPaymentStatus] = useState("PAID"); // PAID / PENDING
  const [paymentMethod, setPaymentMethod] = useState("CASH"); // CASH/UPI/CARD/OTHER
  const [paymentRef, setPaymentRef] = useState("");

  const [customerName, setCustomerName] = useState("Walk-in Customer");
  const [customerPhone, setCustomerPhone] = useState("");

  const selectedProduct = useMemo(() => {
    return products.find((p) => p.id === productId) || null;
  }, [productId, products]);

  const amount = useMemo(() => {
    if (!selectedProduct) return 0;
    const price = Number(selectedProduct.price || 0);
    return price * Number(quantity || 0);
  }, [selectedProduct, quantity]);

  const fetchProducts = async () => {
    const res = await getAllProducts();
    setProducts(res.data || []);
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await fetchProducts();
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleCreateOrder = async () => {
    if (!productId) return alert("Please select a product");
    if (!quantity || isNaN(quantity) || Number(quantity) < 1)
      return alert("Quantity must be >= 1");

    try {
      setLoading(true);

      await createOrder({
        productId,
        quantity: Number(quantity),

        paymentStatus, // PAID or PENDING
        paymentMethod: paymentStatus === "PAID" ? paymentMethod : null,
        paymentRef: paymentStatus === "PAID" ? paymentRef : null,

        customerName,
        customerPhone: customerPhone || null,
      });

      alert("Order created ✅");

      // ✅ reset
      setProductId("");
      setQuantity(1);
      setPaymentStatus("PAID");
      setPaymentMethod("CASH");
      setPaymentRef("");
      setCustomerName("Walk-in Customer");
      setCustomerPhone("");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">New Order (POS)</h2>
          <p className="text-gray-600 text-sm">
            Create store orders (paid or pending) ✅
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white border shadow rounded-2xl p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product dropdown */}
          <select
            className="border rounded-xl px-3 py-2"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          >
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} (Stock: {p.stock})
              </option>
            ))}
          </select>

          {/* Quantity */}
          <input
            type="number"
            min={1}
            className="border rounded-xl px-3 py-2"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          {/* Customer */}
          <input
            className="border rounded-xl px-3 py-2"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />

          <input
            className="border rounded-xl px-3 py-2"
            placeholder="Customer Phone (optional)"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
          />

          {/* Payment Status */}
          <select
            className="border rounded-xl px-3 py-2"
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
          >
            <option value="PAID">PAID (Customer paid now)</option>
            <option value="PENDING">PENDING (Pay later)</option>
          </select>

          {/* Payment Method */}
          <select
            className="border rounded-xl px-3 py-2"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            disabled={paymentStatus !== "PAID"}
          >
            <option value="CASH">CASH</option>
            <option value="UPI">UPI</option>
            <option value="CARD">CARD</option>
            <option value="OTHER">OTHER</option>
          </select>

          {/* Payment Ref */}
          <input
            className="border rounded-xl px-3 py-2 md:col-span-2"
            placeholder="Payment Reference (optional)"
            value={paymentRef}
            onChange={(e) => setPaymentRef(e.target.value)}
            disabled={paymentStatus !== "PAID"}
          />
        </div>

        {/* Summary */}
        <div className="bg-gray-50 border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl border overflow-hidden bg-white">
              {selectedProduct?.thumbnail ? (
                <img
                  src={selectedProduct.thumbnail}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                  No Img
                </div>
              )}
            </div>

            <div>
              <p className="font-semibold">
                {selectedProduct?.name || "Select a product"}
              </p>
              <p className="text-xs text-gray-600">
                Price: ₹{selectedProduct?.price || 0} • Stock:{" "}
                {selectedProduct?.stock ?? 0}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-2xl font-bold">₹{amount}</p>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleCreateOrder}
          disabled={loading}
          className="w-full sm:w-fit px-5 py-2 rounded-xl bg-black text-white disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Order"}
        </button>
      </div>
    </div>
  );
}
