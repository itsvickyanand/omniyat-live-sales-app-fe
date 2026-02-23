// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { getAllProducts } from "@/lib/product.api";
// import { createOrder } from "@/lib/order.api";

// export default function NewOrderPage() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Product form
//   const [productId, setProductId] = useState("");
//   const [quantity, setQuantity] = useState(1);

//   // Customer (MANDATORY)
//   const [customerName, setCustomerName] = useState("");
//   const [customerEmail, setCustomerEmail] = useState("");
//   const [customerPhone, setCustomerPhone] = useState("");

//   // Payment
//   const [paymentStatus, setPaymentStatus] = useState("PAID");
//   const [paymentMethod, setPaymentMethod] = useState("CASH");
//   const [paymentRef, setPaymentRef] = useState("");

//   const selectedProduct = useMemo(() => {
//     return products.find((p) => p.id === productId) || null;
//   }, [productId, products]);

//   const amount = useMemo(() => {
//     if (!selectedProduct) return 0;
//     return Number(selectedProduct.price || 0) * Number(quantity || 0);
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

//   const isValidEmail = (email) => {
//     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//   };

//   const handleCreateOrder = async () => {
//     if (!productId) return alert("Please select a product");

//     if (!quantity || isNaN(quantity) || Number(quantity) < 1)
//       return alert("Quantity must be >= 1");

//     if (!customerName.trim()) return alert("Customer name is required");

//     if (!customerEmail.trim()) return alert("Customer email is required");

//     if (!isValidEmail(customerEmail)) return alert("Enter valid email address");

//     if (!customerPhone.trim()) return alert("Customer phone is required");

//     try {
//       setLoading(true);

//       await createOrder({
//         productId,
//         quantity: Number(quantity),

//         paymentStatus,

//         paymentMethod: paymentStatus === "PAID" ? paymentMethod : null,

//         paymentRef: paymentStatus === "PAID" ? paymentRef : null,

//         customerName,
//         customerEmail,
//         customerPhone,
//       });

//       alert("Order created ✅");

//       // Reset form
//       setProductId("");
//       setQuantity(1);
//       setCustomerName("");
//       setCustomerEmail("");
//       setCustomerPhone("");
//       setPaymentStatus("PAID");
//       setPaymentMethod("CASH");
//       setPaymentRef("");
//     } catch (err) {
//       alert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <div className="space-y-6 max-w-5xl">
//       {/* Header */}
//       <div>
//         <h2 className="text-3xl font-semibold text-gray-900">New POS Order</h2>

//         <p className="text-gray-500 text-sm mt-1">
//           Create in-store order with customer and payment details
//         </p>
//       </div>

//       {/* Main Card */}
//       <div
//         className="
//         bg-white
//         border border-gray-200
//         shadow-sm
//         rounded-2xl
//         p-6
//         space-y-6
//       "
//       >
//         {/* Product + Preview */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Product Selector */}
//           <div className="space-y-2">
//             <label className="text-sm font-medium text-gray-700">
//               Select Product
//             </label>

//             <select
//               className="
//                 w-full
//                 border border-gray-300
//                 rounded-xl
//                 px-4 py-3
//                 focus:ring-2 focus:ring-black focus:border-black
//                 outline-none
//                 transition
//               "
//               value={productId}
//               onChange={(e) => setProductId(e.target.value)}
//             >
//               <option value="">Choose product</option>

//               {products.map((p) => (
//                 <option key={p.id} value={p.id}>
//                   {p.name} • ₹{p.price} • Stock: {p.stock}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Product Preview */}
//           {selectedProduct && (
//             <div
//               className="
//               flex gap-4
//               border border-gray-200
//               rounded-xl
//               p-4
//               bg-gray-50
//             "
//             >
//               {/* Image */}
//               <img
//                 src={selectedProduct.thumbnail}
//                 className="w-24 h-24 object-cover rounded-lg border"
//               />

//               {/* Info */}
//               <div className="flex flex-col justify-between">
//                 <div>
//                   <p className="font-semibold text-gray-900">
//                     {selectedProduct.name}
//                   </p>

//                   <p className="text-sm text-gray-500">
//                     Artist: {selectedProduct.artistName}
//                   </p>

//                   <p className="text-xs text-gray-400">
//                     Category: {selectedProduct.Category?.name}
//                   </p>

//                   {selectedProduct.donationPercentage > 0 && (
//                     <p className="text-xs text-green-600 font-medium">
//                       {selectedProduct.donationPercentage}% donated
//                     </p>
//                   )}
//                 </div>

//                 {/* Stock badge */}
//                 <div>
//                   {selectedProduct.stock > 0 ? (
//                     <span
//                       className="
//                       text-xs
//                       bg-green-100
//                       text-green-700
//                       px-2 py-1
//                       rounded-full
//                     "
//                     >
//                       In Stock
//                     </span>
//                   ) : (
//                     <span
//                       className="
//                       text-xs
//                       bg-red-100
//                       text-red-700
//                       px-2 py-1
//                       rounded-full
//                     "
//                     >
//                       Out of Stock
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Form Fields */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {/* Quantity */}
//           <div className="space-y-1">
//             <label className="text-sm font-medium text-gray-700">
//               Quantity
//               <span className="text-red-500 ml-1">*</span>
//             </label>

//             <input
//               type="number"
//               min={1}
//               className="
//                 w-full
//                 border border-gray-300
//                 rounded-xl
//                 px-4 py-3
//                 focus:ring-2 focus:ring-black focus:border-black
//                 outline-none
//               "
//               value={quantity}
//               onChange={(e) => setQuantity(e.target.value)}
//             />
//           </div>

//           {/* Customer Name */}
//           <div className="space-y-1">
//             <label className="text-sm font-medium text-gray-700">
//               Customer Name
//               <span className="text-red-500 ml-1">*</span>
//             </label>

//             <input
//               className="
//                 w-full
//                 border border-gray-300
//                 rounded-xl
//                 px-4 py-3
//                 focus:ring-2 focus:ring-black focus:border-black
//               "
//               value={customerName}
//               onChange={(e) => setCustomerName(e.target.value)}
//             />
//           </div>

//           {/* Email */}
//           <div className="space-y-1">
//             <label className="text-sm font-medium text-gray-700">
//               Customer Email
//               <span className="text-red-500 ml-1">*</span>
//             </label>

//             <input
//               type="email"
//               className="
//                 w-full
//                 border border-gray-300
//                 rounded-xl
//                 px-4 py-3
//                 focus:ring-2 focus:ring-black focus:border-black
//               "
//               value={customerEmail}
//               onChange={(e) => setCustomerEmail(e.target.value)}
//             />
//           </div>

//           {/* Phone */}
//           <div className="space-y-1">
//             <label className="text-sm font-medium text-gray-700">
//               Customer Phone
//               <span className="text-red-500 ml-1">*</span>
//             </label>

//             <input
//               className="
//                 w-full
//                 border border-gray-300
//                 rounded-xl
//                 px-4 py-3
//                 focus:ring-2 focus:ring-black focus:border-black
//               "
//               value={customerPhone}
//               onChange={(e) => setCustomerPhone(e.target.value)}
//             />
//           </div>

//           {/* Payment Status */}
//           <div className="space-y-1">
//             <label className="text-sm font-medium text-gray-700">
//               Payment Status
//               <span className="text-red-500 ml-1">*</span>
//             </label>

//             <select
//               className="
//                 w-full
//                 border border-gray-300
//                 rounded-xl
//                 px-4 py-3
//               "
//               value={paymentStatus}
//               onChange={(e) => setPaymentStatus(e.target.value)}
//             >
//               <option value="PAID">Paid</option>
//               <option value="PENDING">Pending</option>
//             </select>
//           </div>

//           {/* Payment Method */}
//           <div className="space-y-1">
//             <label className="text-sm font-medium text-gray-700">
//               Payment Method
//               <span className="text-red-500 ml-1">*</span>
//             </label>

//             <select
//               disabled={paymentStatus !== "PAID"}
//               className="
//                 w-full
//                 border border-gray-300
//                 rounded-xl
//                 px-4 py-3
//                 disabled:bg-gray-100
//               "
//               value={paymentMethod}
//               onChange={(e) => setPaymentMethod(e.target.value)}
//             >
//               <option>CASH</option>
//               <option>UPI</option>
//               <option>CARD</option>
//               <option>OTHER</option>
//             </select>
//           </div>

//           {/* Payment Ref */}
//           <div className="space-y-1 md:col-span-2">
//             <label className="text-sm font-medium text-gray-700">
//               Payment Reference
//             </label>

//             <input
//               disabled={paymentStatus !== "PAID"}
//               className="
//                 w-full
//                 border border-gray-300
//                 rounded-xl
//                 px-4 py-3
//                 disabled:bg-gray-100
//               "
//               value={paymentRef}
//               onChange={(e) => setPaymentRef(e.target.value)}
//             />
//           </div>
//         </div>

//         {/* Order Summary */}
//         <div
//           className="
//           border border-gray-200
//           rounded-xl
//           p-5
//           bg-gradient-to-r from-gray-50 to-white
//           flex justify-between items-center
//         "
//         >
//           <div>
//             <p className="font-semibold text-gray-900">
//               {selectedProduct?.name || "No product selected"}
//             </p>

//             <p className="text-sm text-gray-500">
//               ₹{selectedProduct?.price || 0} × {quantity}
//             </p>
//           </div>

//           <div className="text-right">
//             <p className="text-xs text-gray-500">Total</p>

//             <p className="text-2xl font-bold text-gray-900">₹{amount}</p>
//           </div>
//         </div>

//         {/* Submit */}
//         <button
//           onClick={handleCreateOrder}
//           disabled={loading}
//           className="
//             w-full
//             bg-black
//             hover:bg-gray-900
//             text-white
//             py-3
//             rounded-xl
//             font-medium
//             transition
//             shadow
//           "
//         >
//           {loading ? "Creating Order..." : "Create Order"}
//         </button>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { getAllProducts } from "@/lib/product.api";
// import { createOrder } from "@/lib/order.api";

// export default function NewOrderPage() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);

//   /*
//   ========================================
//   PRODUCT
//   ========================================
//   */

//   const [productId, setProductId] = useState("");
//   const [quantity, setQuantity] = useState(1);

//   /*
//   ========================================
//   CUSTOMER (NEW STRUCTURE)
//   ========================================
//   */

//   const [customerFirstName, setCustomerFirstName] = useState("");
//   const [customerLastName, setCustomerLastName] = useState("");
//   const [customerEmail, setCustomerEmail] = useState("");

//   const [customerCountryCode, setCustomerCountryCode] = useState("+91");
//   const [customerPhoneNumber, setCustomerPhoneNumber] = useState("");

//   const [customerCountry, setCustomerCountry] = useState("");
//   const [customerState, setCustomerState] = useState("");
//   const [customerCity, setCustomerCity] = useState("");
//   const [customerAddress, setCustomerAddress] = useState("");

//   /*
//   ========================================
//   PAYMENT
//   ========================================
//   */

//   const [paymentStatus, setPaymentStatus] = useState("PAID");
//   const [paymentMethod, setPaymentMethod] = useState("CASH");
//   const [paymentRef, setPaymentRef] = useState("");

//   /*
//   ========================================
//   COMPUTED
//   ========================================
//   */

//   const selectedProduct = useMemo(() => {
//     return products.find((p) => p.id === productId) || null;
//   }, [productId, products]);

//   const amount = useMemo(() => {
//     if (!selectedProduct) return 0;
//     return Number(selectedProduct.price) * Number(quantity);
//   }, [selectedProduct, quantity]);

//   /*
//   ========================================
//   FETCH PRODUCTS
//   ========================================
//   */

//   useEffect(() => {
//     (async () => {
//       try {
//         setLoading(true);
//         const res = await getAllProducts();
//         setProducts(res.data || []);
//       } catch (err) {
//         alert(err.message);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   /*
//   ========================================
//   VALIDATORS
//   ========================================
//   */

//   const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//   /*
//   ========================================
//   CREATE ORDER
//   ========================================
//   */

//   const handleCreateOrder = async () => {
//     if (!productId) return alert("Select product");

//     if (quantity < 1) return alert("Invalid quantity");

//     if (!customerFirstName) return alert("First name required");

//     if (!customerLastName) return alert("Last name required");

//     if (!isValidEmail(customerEmail)) return alert("Valid email required");

//     if (!customerPhoneNumber) return alert("Phone number required");

//     if (!customerCountry) return alert("Country required");

//     if (!customerState) return alert("State required");

//     if (!customerCity) return alert("City required");

//     if (!customerAddress) return alert("Address required");

//     try {
//       setLoading(true);

//       await createOrder({
//         productId,
//         quantity: Number(quantity),

//         paymentStatus,

//         paymentMethod: paymentStatus === "PAID" ? paymentMethod : null,

//         paymentRef: paymentStatus === "PAID" ? paymentRef : null,

//         customerFirstName,
//         customerLastName,
//         customerEmail,

//         customerCountryCode,
//         customerPhoneNumber,

//         customerCountry,
//         customerState,
//         customerCity,
//         customerAddress,
//       });

//       alert("Order created successfully ✅");

//       /*
//       RESET
//       */

//       setProductId("");
//       setQuantity(1);

//       setCustomerFirstName("");
//       setCustomerLastName("");
//       setCustomerEmail("");

//       setCustomerPhoneNumber("");

//       setCustomerCountry("");
//       setCustomerState("");
//       setCustomerCity("");
//       setCustomerAddress("");

//       setPaymentStatus("PAID");
//       setPaymentMethod("CASH");
//       setPaymentRef("");
//     } catch (err) {
//       alert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /*
//   ========================================
//   UI
//   ========================================
//   */

//   return (
//     <div className="max-w-5xl space-y-6">
//       <h2 className="text-3xl font-semibold">New POS Order</h2>

//       <div className="bg-white border rounded-2xl p-6 space-y-6">
//         {/* PRODUCT */}
//         <select
//           value={productId}
//           onChange={(e) => setProductId(e.target.value)}
//           className="w-full border rounded-xl px-4 py-3"
//         >
//           <option value="">Select product</option>

//           {products.map((p) => (
//             <option key={p.id} value={p.id}>
//               {p.name} • ₹{p.price}
//             </option>
//           ))}
//         </select>

//         {/* QUANTITY */}
//         <input
//           type="number"
//           min={1}
//           value={quantity}
//           onChange={(e) => setQuantity(Number(e.target.value))}
//           className="w-full border rounded-xl px-4 py-3"
//         />

//         {/* NAME */}
//         <div className="grid grid-cols-2 gap-4">
//           <input
//             placeholder="First name"
//             value={customerFirstName}
//             onChange={(e) => setCustomerFirstName(e.target.value)}
//             className="border rounded-xl px-4 py-3"
//           />

//           <input
//             placeholder="Last name"
//             value={customerLastName}
//             onChange={(e) => setCustomerLastName(e.target.value)}
//             className="border rounded-xl px-4 py-3"
//           />
//         </div>

//         {/* EMAIL */}
//         <input
//           placeholder="Email"
//           value={customerEmail}
//           onChange={(e) => setCustomerEmail(e.target.value)}
//           className="w-full border rounded-xl px-4 py-3"
//         />

//         {/* PHONE */}
//         <div className="flex gap-2">
//           <input
//             value={customerCountryCode}
//             onChange={(e) => setCustomerCountryCode(e.target.value)}
//             className="w-24 border rounded-xl px-4 py-3"
//           />

//           <input
//             placeholder="Phone"
//             value={customerPhoneNumber}
//             onChange={(e) => setCustomerPhoneNumber(e.target.value)}
//             className="flex-1 border rounded-xl px-4 py-3"
//           />
//         </div>

//         {/* ADDRESS */}
//         <input
//           placeholder="Country"
//           value={customerCountry}
//           onChange={(e) => setCustomerCountry(e.target.value)}
//           className="border rounded-xl px-4 py-3"
//         />

//         <input
//           placeholder="State"
//           value={customerState}
//           onChange={(e) => setCustomerState(e.target.value)}
//           className="border rounded-xl px-4 py-3"
//         />

//         <input
//           placeholder="City"
//           value={customerCity}
//           onChange={(e) => setCustomerCity(e.target.value)}
//           className="border rounded-xl px-4 py-3"
//         />

//         <textarea
//           placeholder="Address"
//           value={customerAddress}
//           onChange={(e) => setCustomerAddress(e.target.value)}
//           className="border rounded-xl px-4 py-3"
//         />

//         {/* PAYMENT */}
//         <select
//           value={paymentStatus}
//           onChange={(e) => setPaymentStatus(e.target.value)}
//           className="border rounded-xl px-4 py-3"
//         >
//           <option value="PAID">Paid</option>

//           <option value="PENDING">Pending</option>
//         </select>

//         {/* TOTAL */}
//         <div className="text-xl font-bold">Total: ₹{amount}</div>

//         {/* SUBMIT */}
//         <button
//           onClick={handleCreateOrder}
//           disabled={loading}
//           className="w-full bg-black text-white py-3 rounded-xl"
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

function InputField({ label, value, setValue, select, options }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>

      {select ? (
        <select
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-black focus:outline-none"
        >
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : (
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-black focus:outline-none"
        />
      )}
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between text-gray-600">
      <span>{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}

export default function NewOrderPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  /*
  PRODUCT
  */

  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);

  /*
  CUSTOMER
  */

  const [customerFirstName, setCustomerFirstName] = useState("");
  const [customerLastName, setCustomerLastName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const [customerCountryCode, setCustomerCountryCode] = useState("+91");
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState("");

  const [customerCountry, setCustomerCountry] = useState("");
  const [customerState, setCustomerState] = useState("");
  const [customerCity, setCustomerCity] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  /*
  PAYMENT
  */

  const [paymentStatus, setPaymentStatus] = useState("PENDING");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [paymentRef, setPaymentRef] = useState("");

  /*
  COMPUTED
  */

  const selectedProduct = useMemo(() => {
    return products.find((p) => p.id === productId) || null;
  }, [productId, products]);

  const amount = useMemo(() => {
    if (!selectedProduct) return 0;
    return Number(selectedProduct.price) * Number(quantity);
  }, [selectedProduct, quantity]);

  /*
  FETCH
  */

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getAllProducts();
        setProducts(res.data || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /*
  VALIDATION
  */

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  /*
  CREATE ORDER
  */

  const handleCreateOrder = async () => {
    if (!productId) return alert("Select product");
    if (!customerFirstName) return alert("First name required");
    // if (!customerLastName) return alert("Last name required");
    if (!isValidEmail(customerEmail)) return alert("Valid email required");
    // if (!customerPhoneNumber) return alert("Phone required");
    // if (!customerCountry) return alert("Country required");
    // if (!customerState) return alert("State required");
    // if (!customerCity) return alert("City required");
    // if (!customerAddress) return alert("Address required");

    try {
      setLoading(true);

      await createOrder({
        productId,
        quantity,

        paymentStatus,
        paymentMethod: paymentStatus === "PAID" ? paymentMethod : null,
        paymentRef,

        customerFirstName,
        customerLastName,
        customerEmail,

        customerCountryCode,
        customerPhoneNumber,

        customerCountry,
        customerState,
        customerCity,
        customerAddress,
      });

      alert("Order created ✅");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  /*
  UI
  */
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* HEADER */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900">Create New Order</h1>

          <p className="text-gray-500">
            Create a new POS order with product, customer, and payment details.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="xl:col-span-2 space-y-6">
            {/* PRODUCT */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Product Information
              </h2>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Select Product
                </label>

                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-black focus:outline-none"
                >
                  <option value="">Select product</option>

                  {/* {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — ₹{p.price}
                    </option>
                  ))} */}
                  {products
                    .filter((p) => p.stock > 0)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — ₹{p.price}
                      </option>
                    ))}
                </select>
              </div>

              {selectedProduct && (
                <div className="flex gap-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <img
                    src={selectedProduct.thumbnail}
                    className="w-20 h-20 rounded-lg object-cover border"
                  />

                  <div className="space-y-1">
                    <p className="font-semibold text-gray-900">
                      {selectedProduct.name}
                    </p>

                    <p className="text-gray-600 text-sm">
                      Price: ₹{selectedProduct.price}
                    </p>

                    <p className="text-xs text-gray-500">
                      Stock: {selectedProduct.stock}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Quantity
                </label>

                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-black focus:outline-none"
                />
              </div>
            </div>

            {/* CUSTOMER */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Customer Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    First Name
                  </label>

                  <input
                    value={customerFirstName}
                    onChange={(e) => setCustomerFirstName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-black focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Last Name
                  </label>

                  <input
                    value={customerLastName}
                    onChange={(e) => setCustomerLastName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-black focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>

                <input
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-black focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Phone Number
                </label>

                <div className="flex gap-2">
                  <input
                    value={customerCountryCode}
                    onChange={(e) => setCustomerCountryCode(e.target.value)}
                    className="w-24 border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-black focus:outline-none"
                  />

                  <input
                    value={customerPhoneNumber}
                    onChange={(e) => setCustomerPhoneNumber(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-black focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* ADDRESS */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5">
              <h2 className="text-lg font-semibold text-gray-900">Address</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Country"
                  value={customerCountry}
                  setValue={setCustomerCountry}
                />

                <InputField
                  label="State"
                  value={customerState}
                  setValue={setCustomerState}
                />

                <InputField
                  label="City"
                  value={customerCity}
                  setValue={setCustomerCity}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Full Address
                </label>

                <textarea
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-black focus:outline-none"
                />
              </div>
            </div>

            {/* PAYMENT */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5">
              <h2 className="text-lg font-semibold text-gray-900">Payment</h2>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Payment Status
                </label>

                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-black focus:outline-none"
                >
                  <option value="PAID">Paid</option>
                  <option value="PENDING">Pending</option>
                </select>
              </div>

              {paymentStatus === "PAID" && (
                <>
                  <InputField
                    label="Payment Method"
                    value={paymentMethod}
                    setValue={setPaymentMethod}
                    select
                    options={["CASH", "UPI", "CARD", "OTHER"]}
                  />

                  <InputField
                    label="Payment Reference"
                    value={paymentRef}
                    setValue={setPaymentRef}
                  />
                </>
              )}
            </div>
          </div>

          {/* SUMMARY */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5 h-fit sticky top-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Order Summary
            </h2>

            <SummaryRow label="Product" value={selectedProduct?.name || "-"} />

            <SummaryRow label="Quantity" value={quantity} />

            <div className="border-t pt-4 flex justify-between text-xl font-bold text-gray-900">
              <span>Total</span>
              <span>AED{amount}</span>
            </div>

            <button
              onClick={handleCreateOrder}
              disabled={loading}
              className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg font-medium transition"
            >
              {loading ? "Creating Order..." : "Create Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // return (
  //   <div className="max-w-6xl mx-auto p-6 space-y-6">
  //     {/* HEADER */}
  //     <div>
  //       <h1 className="text-3xl font-semibold text-gray-900">
  //         Create New Order
  //       </h1>

  //       <p className="text-gray-500 text-sm">
  //         Create POS order with customer and payment details
  //       </p>
  //     </div>

  //     {/* MAIN GRID */}
  //     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  //       {/* LEFT SIDE */}
  //       <div className="lg:col-span-2 space-y-6">
  //         {/* PRODUCT SECTION */}
  //         <div className="bg-white border rounded-xl p-5 space-y-4 shadow-sm">
  //           <h2 className="font-semibold text-lg">Product</h2>

  //           <select
  //             value={productId}
  //             onChange={(e) => setProductId(e.target.value)}
  //             className="input"
  //           >
  //             <option value="">Select product</option>

  //             {products.map((p) => (
  //               <option key={p.id} value={p.id}>
  //                 {p.name} — ₹{p.price}
  //               </option>
  //             ))}
  //           </select>

  //           {selectedProduct && (
  //             <div className="flex gap-4 border rounded-lg p-4 bg-gray-50">
  //               <img
  //                 src={selectedProduct.thumbnail}
  //                 className="w-20 h-20 object-cover rounded"
  //               />

  //               <div>
  //                 <p className="font-semibold">{selectedProduct.name}</p>

  //                 <p className="text-sm text-gray-500">
  //                   ₹{selectedProduct.price}
  //                 </p>

  //                 <p className="text-xs text-gray-400">
  //                   Stock: {selectedProduct.stock}
  //                 </p>
  //               </div>
  //             </div>
  //           )}

  //           <input
  //             type="number"
  //             min={1}
  //             value={quantity}
  //             onChange={(e) => setQuantity(Number(e.target.value))}
  //             className="input"
  //             placeholder="Quantity"
  //           />
  //         </div>

  //         {/* CUSTOMER SECTION */}
  //         <div className="bg-white border rounded-xl p-5 space-y-4 shadow-sm">
  //           <h2 className="font-semibold text-lg">Customer Information</h2>

  //           <div className="grid grid-cols-2 gap-4">
  //             <input
  //               className="input"
  //               placeholder="First Name"
  //               value={customerFirstName}
  //               onChange={(e) => setCustomerFirstName(e.target.value)}
  //             />

  //             <input
  //               className="input"
  //               placeholder="Last Name"
  //               value={customerLastName}
  //               onChange={(e) => setCustomerLastName(e.target.value)}
  //             />
  //           </div>

  //           <input
  //             className="input"
  //             placeholder="Email"
  //             value={customerEmail}
  //             onChange={(e) => setCustomerEmail(e.target.value)}
  //           />

  //           <div className="flex gap-2">
  //             <input
  //               className="w-24 input"
  //               value={customerCountryCode}
  //               onChange={(e) => setCustomerCountryCode(e.target.value)}
  //             />

  //             <input
  //               className="flex-1 input"
  //               placeholder="Phone Number"
  //               value={customerPhoneNumber}
  //               onChange={(e) => setCustomerPhoneNumber(e.target.value)}
  //             />
  //           </div>
  //         </div>

  //         {/* ADDRESS SECTION */}
  //         <div className="bg-white border rounded-xl p-5 space-y-4 shadow-sm">
  //           <h2 className="font-semibold text-lg">Address</h2>

  //           <div className="grid grid-cols-2 gap-4">
  //             <input
  //               className="input"
  //               placeholder="Country"
  //               value={customerCountry}
  //               onChange={(e) => setCustomerCountry(e.target.value)}
  //             />

  //             <input
  //               className="input"
  //               placeholder="State"
  //               value={customerState}
  //               onChange={(e) => setCustomerState(e.target.value)}
  //             />

  //             <input
  //               className="input"
  //               placeholder="City"
  //               value={customerCity}
  //               onChange={(e) => setCustomerCity(e.target.value)}
  //             />
  //           </div>

  //           <textarea
  //             className="input"
  //             placeholder="Full Address"
  //             value={customerAddress}
  //             onChange={(e) => setCustomerAddress(e.target.value)}
  //           />
  //         </div>

  //         {/* PAYMENT SECTION */}
  //         <div className="bg-white border rounded-xl p-5 space-y-4 shadow-sm">
  //           <h2 className="font-semibold text-lg">Payment</h2>

  //           <select
  //             className="input"
  //             value={paymentStatus}
  //             onChange={(e) => setPaymentStatus(e.target.value)}
  //           >
  //             <option value="PAID">Paid</option>
  //             <option value="PENDING">Pending</option>
  //           </select>

  //           {paymentStatus === "PAID" && (
  //             <>
  //               <select
  //                 className="input"
  //                 value={paymentMethod}
  //                 onChange={(e) => setPaymentMethod(e.target.value)}
  //               >
  //                 <option>CASH</option>
  //                 <option>UPI</option>
  //                 <option>CARD</option>
  //                 <option>OTHER</option>
  //               </select>

  //               <input
  //                 className="input"
  //                 placeholder="Payment Reference"
  //                 value={paymentRef}
  //                 onChange={(e) => setPaymentRef(e.target.value)}
  //               />
  //             </>
  //           )}
  //         </div>
  //       </div>

  //       {/* RIGHT SIDE SUMMARY */}
  //       <div className="bg-white border rounded-xl p-5 shadow-sm h-fit space-y-4">
  //         <h2 className="font-semibold text-lg">Order Summary</h2>

  //         <div className="flex justify-between">
  //           <span>Product</span>
  //           <span>{selectedProduct?.name || "-"}</span>
  //         </div>

  //         <div className="flex justify-between">
  //           <span>Quantity</span>
  //           <span>{quantity}</span>
  //         </div>

  //         <div className="border-t pt-3 flex justify-between font-semibold text-lg">
  //           <span>Total</span>
  //           <span>₹{amount}</span>
  //         </div>

  //         <button
  //           onClick={handleCreateOrder}
  //           disabled={loading}
  //           className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
  //         >
  //           {loading ? "Creating Order..." : "Create Order"}
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // );
}

/*
TAILWIND REUSABLE INPUT CLASS
Add to globals.css
*/
