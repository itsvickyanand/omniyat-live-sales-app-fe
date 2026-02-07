// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { getAllProducts } from "@/lib/product.api";
// import { createOrder } from "@/lib/order.api";

// export default function NewOrderPage() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // ✅ form
//   const [productId, setProductId] = useState("");
//   const [quantity, setQuantity] = useState(1);

//   const [paymentStatus, setPaymentStatus] = useState("PAID"); // PAID / PENDING
//   const [paymentMethod, setPaymentMethod] = useState("CASH"); // CASH/UPI/CARD/OTHER
//   const [paymentRef, setPaymentRef] = useState("");

//   const [customerName, setCustomerName] = useState("Walk-in Customer");
//   const [customerPhone, setCustomerPhone] = useState("");

//   const selectedProduct = useMemo(() => {
//     return products.find((p) => p.id === productId) || null;
//   }, [productId, products]);

//   const amount = useMemo(() => {
//     if (!selectedProduct) return 0;
//     const price = Number(selectedProduct.price || 0);
//     return price * Number(quantity || 0);
//   }, [selectedProduct, quantity]);

//   const fetchProducts = async () => {
//     const res = await getAllProducts();
//     setProducts(res.data || []);
//   };

//   useEffect(() => {
//     (async () => {
//       try {
//         setLoading(true);
//         await fetchProducts();
//       } catch (err) {
//         alert(err.message);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   const handleCreateOrder = async () => {
//     if (!productId) return alert("Please select a product");
//     if (!quantity || isNaN(quantity) || Number(quantity) < 1)
//       return alert("Quantity must be >= 1");

//     try {
//       setLoading(true);

//       await createOrder({
//         productId,
//         quantity: Number(quantity),

//         paymentStatus, // PAID or PENDING
//         paymentMethod: paymentStatus === "PAID" ? paymentMethod : null,
//         paymentRef: paymentStatus === "PAID" ? paymentRef : null,

//         customerName,
//         customerPhone: customerPhone || null,
//       });

//       alert("Order created ✅");

//       // ✅ reset
//       setProductId("");
//       setQuantity(1);
//       setPaymentStatus("PAID");
//       setPaymentMethod("CASH");
//       setPaymentRef("");
//       setCustomerName("Walk-in Customer");
//       setCustomerPhone("");
//     } catch (err) {
//       alert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h2 className="text-2xl font-bold">New Order (POS)</h2>
//           <p className="text-gray-600 text-sm">
//             Create store orders (paid or pending) ✅
//           </p>
//         </div>
//       </div>

//       {/* Form */}
//       <div className="bg-white border shadow rounded-2xl p-5 space-y-4">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {/* Product dropdown */}
//           <select
//             className="border rounded-xl px-3 py-2"
//             value={productId}
//             onChange={(e) => setProductId(e.target.value)}
//           >
//             <option value="">Select Product</option>
//             {products.map((p) => (
//               <option key={p.id} value={p.id}>
//                 {p.name} (Stock: {p.stock})
//               </option>
//             ))}
//           </select>

//           {/* Quantity */}
//           <input
//             type="number"
//             min={1}
//             className="border rounded-xl px-3 py-2"
//             placeholder="Quantity"
//             value={quantity}
//             onChange={(e) => setQuantity(e.target.value)}
//           />

//           {/* Customer */}
//           <input
//             className="border rounded-xl px-3 py-2"
//             placeholder="Customer Name"
//             value={customerName}
//             onChange={(e) => setCustomerName(e.target.value)}
//           />

//           <input
//             className="border rounded-xl px-3 py-2"
//             placeholder="Customer Phone (optional)"
//             value={customerPhone}
//             onChange={(e) => setCustomerPhone(e.target.value)}
//           />

//           {/* Payment Status */}
//           <select
//             className="border rounded-xl px-3 py-2"
//             value={paymentStatus}
//             onChange={(e) => setPaymentStatus(e.target.value)}
//           >
//             <option value="PAID">PAID (Customer paid now)</option>
//             <option value="PENDING">PENDING (Pay later)</option>
//           </select>

//           {/* Payment Method */}
//           <select
//             className="border rounded-xl px-3 py-2"
//             value={paymentMethod}
//             onChange={(e) => setPaymentMethod(e.target.value)}
//             disabled={paymentStatus !== "PAID"}
//           >
//             <option value="CASH">CASH</option>
//             <option value="UPI">UPI</option>
//             <option value="CARD">CARD</option>
//             <option value="OTHER">OTHER</option>
//           </select>

//           {/* Payment Ref */}
//           <input
//             className="border rounded-xl px-3 py-2 md:col-span-2"
//             placeholder="Payment Reference (optional)"
//             value={paymentRef}
//             onChange={(e) => setPaymentRef(e.target.value)}
//             disabled={paymentStatus !== "PAID"}
//           />
//         </div>

//         {/* Summary */}
//         <div className="bg-gray-50 border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//           <div className="flex items-center gap-3">
//             <div className="w-14 h-14 rounded-xl border overflow-hidden bg-white">
//               {selectedProduct?.thumbnail ? (
//                 <img
//                   src={selectedProduct.thumbnail}
//                   alt={selectedProduct.name}
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
//                   No Img
//                 </div>
//               )}
//             </div>

//             <div>
//               <p className="font-semibold">
//                 {selectedProduct?.name || "Select a product"}
//               </p>
//               <p className="text-xs text-gray-600">
//                 Price: AED {selectedProduct?.price || 0} • Stock:{" "}
//                 {selectedProduct?.stock ?? 0}
//               </p>
//             </div>
//           </div>

//           <div className="text-right">
//             <p className="text-sm text-gray-600">Total Amount</p>
//             <p className="text-2xl font-bold">AED {amount}</p>
//           </div>
//         </div>

//         {/* Submit */}
//         <button
//           onClick={handleCreateOrder}
//           disabled={loading}
//           className="w-full sm:w-fit px-5 py-2 rounded-xl bg-black text-white disabled:opacity-50"
//         >
//           {loading ? "Creating..." : "Create Order"}
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useMemo, useState } from "react";
import { getAllProducts } from "@/lib/product.api";
import { createOrder } from "@/lib/order.api";

export default function NewOrderPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Product form
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Customer (MANDATORY)
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  // Payment
  const [paymentStatus, setPaymentStatus] = useState("PAID");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [paymentRef, setPaymentRef] = useState("");

  const selectedProduct = useMemo(() => {
    return products.find((p) => p.id === productId) || null;
  }, [productId, products]);

  const amount = useMemo(() => {
    if (!selectedProduct) return 0;
    return Number(selectedProduct.price || 0) * Number(quantity || 0);
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

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleCreateOrder = async () => {
    if (!productId) return alert("Please select a product");

    if (!quantity || isNaN(quantity) || Number(quantity) < 1)
      return alert("Quantity must be >= 1");

    if (!customerName.trim()) return alert("Customer name is required");

    if (!customerEmail.trim()) return alert("Customer email is required");

    if (!isValidEmail(customerEmail)) return alert("Enter valid email address");

    if (!customerPhone.trim()) return alert("Customer phone is required");

    try {
      setLoading(true);

      await createOrder({
        productId,
        quantity: Number(quantity),

        paymentStatus,

        paymentMethod: paymentStatus === "PAID" ? paymentMethod : null,

        paymentRef: paymentStatus === "PAID" ? paymentRef : null,

        customerName,
        customerEmail,
        customerPhone,
      });

      alert("Order created ✅");

      // Reset form
      setProductId("");
      setQuantity(1);
      setCustomerName("");
      setCustomerEmail("");
      setCustomerPhone("");
      setPaymentStatus("PAID");
      setPaymentMethod("CASH");
      setPaymentRef("");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-semibold text-gray-900">New POS Order</h2>

        <p className="text-gray-500 text-sm mt-1">
          Create in-store order with customer and payment details
        </p>
      </div>

      {/* Main Card */}
      <div
        className="
        bg-white
        border border-gray-200
        shadow-sm
        rounded-2xl
        p-6
        space-y-6
      "
      >
        {/* Product + Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Select Product
            </label>

            <select
              className="
                w-full
                border border-gray-300
                rounded-xl
                px-4 py-3
                focus:ring-2 focus:ring-black focus:border-black
                outline-none
                transition
              "
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            >
              <option value="">Choose product</option>

              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} • ₹{p.price} • Stock: {p.stock}
                </option>
              ))}
            </select>
          </div>

          {/* Product Preview */}
          {selectedProduct && (
            <div
              className="
              flex gap-4
              border border-gray-200
              rounded-xl
              p-4
              bg-gray-50
            "
            >
              {/* Image */}
              <img
                src={selectedProduct.thumbnail}
                className="w-24 h-24 object-cover rounded-lg border"
              />

              {/* Info */}
              <div className="flex flex-col justify-between">
                <div>
                  <p className="font-semibold text-gray-900">
                    {selectedProduct.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    Artist: {selectedProduct.artistName}
                  </p>

                  <p className="text-xs text-gray-400">
                    Category: {selectedProduct.Category?.name}
                  </p>

                  {selectedProduct.donationPercentage > 0 && (
                    <p className="text-xs text-green-600 font-medium">
                      {selectedProduct.donationPercentage}% donated
                    </p>
                  )}
                </div>

                {/* Stock badge */}
                <div>
                  {selectedProduct.stock > 0 ? (
                    <span
                      className="
                      text-xs
                      bg-green-100
                      text-green-700
                      px-2 py-1
                      rounded-full
                    "
                    >
                      In Stock
                    </span>
                  ) : (
                    <span
                      className="
                      text-xs
                      bg-red-100
                      text-red-700
                      px-2 py-1
                      rounded-full
                    "
                    >
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Quantity */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Quantity
              <span className="text-red-500 ml-1">*</span>
            </label>

            <input
              type="number"
              min={1}
              className="
                w-full
                border border-gray-300
                rounded-xl
                px-4 py-3
                focus:ring-2 focus:ring-black focus:border-black
                outline-none
              "
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          {/* Customer Name */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Customer Name
              <span className="text-red-500 ml-1">*</span>
            </label>

            <input
              className="
                w-full
                border border-gray-300
                rounded-xl
                px-4 py-3
                focus:ring-2 focus:ring-black focus:border-black
              "
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Customer Email
              <span className="text-red-500 ml-1">*</span>
            </label>

            <input
              type="email"
              className="
                w-full
                border border-gray-300
                rounded-xl
                px-4 py-3
                focus:ring-2 focus:ring-black focus:border-black
              "
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            />
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Customer Phone
              <span className="text-red-500 ml-1">*</span>
            </label>

            <input
              className="
                w-full
                border border-gray-300
                rounded-xl
                px-4 py-3
                focus:ring-2 focus:ring-black focus:border-black
              "
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
          </div>

          {/* Payment Status */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Payment Status
              <span className="text-red-500 ml-1">*</span>
            </label>

            <select
              className="
                w-full
                border border-gray-300
                rounded-xl
                px-4 py-3
              "
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
            >
              <option value="PAID">Paid</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>

          {/* Payment Method */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Payment Method
              <span className="text-red-500 ml-1">*</span>
            </label>

            <select
              disabled={paymentStatus !== "PAID"}
              className="
                w-full
                border border-gray-300
                rounded-xl
                px-4 py-3
                disabled:bg-gray-100
              "
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option>CASH</option>
              <option>UPI</option>
              <option>CARD</option>
              <option>OTHER</option>
            </select>
          </div>

          {/* Payment Ref */}
          <div className="space-y-1 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Payment Reference
            </label>

            <input
              disabled={paymentStatus !== "PAID"}
              className="
                w-full
                border border-gray-300
                rounded-xl
                px-4 py-3
                disabled:bg-gray-100
              "
              value={paymentRef}
              onChange={(e) => setPaymentRef(e.target.value)}
            />
          </div>
        </div>

        {/* Order Summary */}
        <div
          className="
          border border-gray-200
          rounded-xl
          p-5
          bg-gradient-to-r from-gray-50 to-white
          flex justify-between items-center
        "
        >
          <div>
            <p className="font-semibold text-gray-900">
              {selectedProduct?.name || "No product selected"}
            </p>

            <p className="text-sm text-gray-500">
              ₹{selectedProduct?.price || 0} × {quantity}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-500">Total</p>

            <p className="text-2xl font-bold text-gray-900">₹{amount}</p>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleCreateOrder}
          disabled={loading}
          className="
            w-full
            bg-black
            hover:bg-gray-900
            text-white
            py-3
            rounded-xl
            font-medium
            transition
            shadow
          "
        >
          {loading ? "Creating Order..." : "Create Order"}
        </button>
      </div>
    </div>
  );

  // return (
  //   <div className="space-y-6">
  //     {/* Header */}
  //     <div>
  //       <h2 className="text-2xl font-bold">New Order (POS)</h2>

  //       <p className="text-gray-600 text-sm">
  //         Create store order with mandatory customer info
  //       </p>
  //     </div>

  //     {/* Form */}
  //     <div className="bg-white border shadow rounded-2xl p-5 space-y-4">
  //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //         {/* Product */}
  //         <select
  //           className="border rounded-xl px-3 py-2"
  //           value={productId}
  //           onChange={(e) => setProductId(e.target.value)}
  //         >
  //           <option value="">Select Product</option>

  //           {products.map((p) => (
  //             <option key={p.id} value={p.id}>
  //               {p.name} (Stock: {p.stock})
  //             </option>
  //           ))}
  //         </select>

  //         {/* Quantity */}
  //         <input
  //           type="number"
  //           min={1}
  //           className="border rounded-xl px-3 py-2"
  //           placeholder="Quantity"
  //           value={quantity}
  //           onChange={(e) => setQuantity(e.target.value)}
  //         />

  //         {/* Customer Name */}
  //         <input
  //           required
  //           className="border rounded-xl px-3 py-2"
  //           placeholder="Customer Name *"
  //           value={customerName}
  //           onChange={(e) => setCustomerName(e.target.value)}
  //         />

  //         {/* Customer Email */}
  //         <input
  //           required
  //           type="email"
  //           className="border rounded-xl px-3 py-2"
  //           placeholder="Customer Email *"
  //           value={customerEmail}
  //           onChange={(e) => setCustomerEmail(e.target.value)}
  //         />

  //         {/* Customer Phone */}
  //         <input
  //           required
  //           className="border rounded-xl px-3 py-2"
  //           placeholder="Customer Phone *"
  //           value={customerPhone}
  //           onChange={(e) => setCustomerPhone(e.target.value)}
  //         />

  //         {/* Payment Status */}
  //         <select
  //           className="border rounded-xl px-3 py-2"
  //           value={paymentStatus}
  //           onChange={(e) => setPaymentStatus(e.target.value)}
  //         >
  //           <option value="PAID">PAID</option>

  //           <option value="PENDING">PENDING</option>
  //         </select>

  //         {/* Payment Method */}
  //         <select
  //           className="border rounded-xl px-3 py-2"
  //           value={paymentMethod}
  //           onChange={(e) => setPaymentMethod(e.target.value)}
  //           disabled={paymentStatus !== "PAID"}
  //         >
  //           <option value="CASH">CASH</option>

  //           <option value="UPI">UPI</option>

  //           <option value="CARD">CARD</option>

  //           <option value="OTHER">OTHER</option>
  //         </select>

  //         {/* Payment Ref */}
  //         <input
  //           className="border rounded-xl px-3 py-2 md:col-span-2"
  //           placeholder="Payment Reference"
  //           value={paymentRef}
  //           onChange={(e) => setPaymentRef(e.target.value)}
  //           disabled={paymentStatus !== "PAID"}
  //         />
  //       </div>

  //       {/* Summary */}
  //       <div className="bg-gray-50 border rounded-2xl p-4 flex justify-between">
  //         <div>
  //           <p className="font-semibold">
  //             {selectedProduct?.name || "Select product"}
  //           </p>

  //           <p className="text-xs text-gray-600">
  //             Price: ₹{selectedProduct?.price || 0}
  //           </p>
  //         </div>

  //         <div className="text-right">
  //           <p className="text-xs">Total</p>

  //           <p className="text-xl font-bold">₹{amount}</p>
  //         </div>
  //       </div>

  //       {/* Submit */}
  //       <button
  //         onClick={handleCreateOrder}
  //         disabled={loading}
  //         className="w-full bg-black text-white px-5 py-2 rounded-xl"
  //       >
  //         {loading ? "Creating..." : "Create Order"}
  //       </button>
  //     </div>
  //   </div>
  // );
}
