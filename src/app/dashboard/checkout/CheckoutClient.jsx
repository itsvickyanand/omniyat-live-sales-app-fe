"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getAllProducts } from "@/lib/product.api";

export default function CheckoutPage() {
  const searchParams = useSearchParams();

  const preProductId = searchParams.get("productId") || "";
  const preQty = searchParams.get("qty") || "1";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Product form
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Customer form (MANDATORY)
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const selectedProduct = useMemo(() => {
    return products.find((p) => p.id === productId) || null;
  }, [productId, products]);

  const amount = useMemo(() => {
    if (!selectedProduct) return 0;
    return Number(selectedProduct.price || 0) * Number(quantity || 0);
  }, [selectedProduct, quantity]);

  const fetchProducts = async () => {
    const res = await getAllProducts();
    return res.data || [];
  };

  // Load products
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const list = await fetchProducts();
        setProducts(list);
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Prefill
  useEffect(() => {
    if (products.length === 0) return;

    if (preProductId) setProductId(preProductId);

    const q = Number(preQty);
    if (!isNaN(q) && q >= 1) setQuantity(q);
  }, [products.length]);

  // Email validation helper
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Create order
  const createOnlineOrder = async () => {
    if (!productId) throw new Error("Product not selected");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/order/create`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          quantity: Number(quantity),
          paymentMode: "ONLINE",
          paymentStatus: "PENDING",
          customerName,
          customerEmail,
          customerPhone,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) throw new Error(data?.message || "Failed to create order");

    return data.data;
  };

  // Initiate payment
  const initiateCcavenuePayment = async (orderId) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payment/ccavenue/initiate`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      }
    );

    const data = await res.json();

    if (!res.ok) throw new Error(data?.message || "Failed to initiate payment");

    return data;
  };

  // Redirect
  const redirectToCcavenue = ({ accessCode, encRequest }) => {
    const form = document.createElement("form");
    form.method = "POST";

    form.action =
      "https://secure.ccavenue.ae/transaction/transaction.do?command=initiateTransaction";

    const encInput = document.createElement("input");
    encInput.type = "hidden";
    encInput.name = "encRequest";
    encInput.value = encRequest;

    const accessInput = document.createElement("input");
    accessInput.type = "hidden";
    accessInput.name = "access_code";
    accessInput.value = accessCode;

    form.appendChild(encInput);
    form.appendChild(accessInput);

    document.body.appendChild(form);
    form.submit();

    setTimeout(() => {
      document.body.removeChild(form);
    }, 1000);
  };

  // Pay handler
  // const handlePayNow = async () => {
  //   if (loading) return;
  //   if (!productId) return alert("Please select a product");

  //   if (!customerName.trim()) return alert("Customer name is required");

  //   if (!customerEmail.trim()) return alert("Customer email is required");

  //   if (!isValidEmail(customerEmail)) return alert("Enter valid email address");

  //   if (!customerPhone.trim()) return alert("Customer phone is required");

  //   if (!quantity || isNaN(quantity) || Number(quantity) < 1)
  //     return alert("Quantity must be >= 1");

  //   const stock = Number(selectedProduct?.stock || 0);

  //   if (Number(quantity) > stock)
  //     return alert(`Not enough stock. Available: ${stock}`);

  //   try {
  //     setLoading(true);

  //     const order = await createOnlineOrder();

  //     const paymentData = await initiateCcavenuePayment(order.id);
  //     if (!paymentData?.accessCode || !paymentData?.encRequest) {
  //       throw new Error("Invalid payment initialization");
  //     }

  //     redirectToCcavenue(paymentData);
  //   } catch (err) {
  //     alert(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handlePayNow = async () => {
    if (loading) return;

    if (!productId) return alert("Please select a product");
    if (!customerName.trim()) return alert("Customer name is required");
    if (!customerEmail.trim()) return alert("Customer email is required");
    if (!isValidEmail(customerEmail)) return alert("Enter valid email address");
    if (!customerPhone.trim()) return alert("Customer phone is required");
    if (!quantity || isNaN(quantity) || quantity < 1)
      return alert("Quantity must be >= 1");

    const stock = Number(selectedProduct?.stock || 0);

    if (quantity > stock) return alert(`Not enough stock. Available: ${stock}`);

    try {
      setLoading(true);

      const order = await createOnlineOrder();

      const paymentData = await initiateCcavenuePayment(order.id);

      if (!paymentData?.accessCode || !paymentData?.encRequest) {
        throw new Error("Invalid payment initialization");
      }

      redirectToCcavenue(paymentData);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Checkout</h1>
        <p className="text-gray-600 text-sm">Complete your purchase securely</p>
      </div>

      <div className="bg-white border shadow rounded-2xl p-5 space-y-4">
        {/* Product */}
        <select
          className="border rounded-xl px-3 py-2 w-full"
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
          className="border rounded-xl px-3 py-2 w-full"
          placeholder="Quantity"
          value={quantity}
          // onChange={(e) => setQuantity(e.target.value)}
          // onChange={(e) => setQuantity(Number(e.target.value))}
          onChange={(e) => {
            const val = Number(e.target.value);
            if (val >= 1) setQuantity(val);
          }}
        />

        {/* Customer Name */}
        <input
          required
          className="border rounded-xl px-3 py-2 w-full"
          placeholder="Customer Name *"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />

        {/* Customer Email */}
        <input
          required
          type="email"
          className="border rounded-xl px-3 py-2 w-full"
          placeholder="Customer Email *"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
        />

        {/* Customer Phone */}
        <input
          required
          className="border rounded-xl px-3 py-2 w-full"
          placeholder="Customer Phone *"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
        />

        {/* Summary */}
        <div className="bg-gray-50 border rounded-2xl p-4 flex justify-between">
          <div>
            <p className="font-semibold">
              {selectedProduct?.name || "No product selected"}
            </p>

            <p className="text-xs text-gray-600">
              Price: AED {selectedProduct?.price || 0}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs">Total</p>
            <p className="text-xl font-bold">AED {amount}</p>
          </div>
        </div>

        {/* Pay */}
        {/* <button
          onClick={handlePayNow}
          disabled={loading}
          className="w-full bg-black text-white px-4 py-2 rounded-xl disabled:opacity-50"
        >
          {loading ? "Redirecting..." : "Pay Now"}
        </button> */}
        <button
          onClick={handlePayNow}
          disabled={
            loading ||
            !productId ||
            !customerName ||
            !customerEmail ||
            !customerPhone ||
            quantity < 1
          }
          className="w-full bg-black text-white px-4 py-2 rounded-xl disabled:opacity-50"
        >
          {loading ? "Redirecting..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
}
