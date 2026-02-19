// import React from "react";
// import EditProductForm from "./EditProductForm";

// const ProductCard = ({
//   p,
//   editing,

//   editData,
//   setEditData,

//   newEditImages,
//   setNewEditImages,

//   handleDeleteImage,
//   handleUpdateProduct,
//   handleCancelEdit,

//   handleBuyNow,
//   handleStartEdit,
//   handleDeleteProduct,
// }) => {
//   return (
//     <div
//       key={p.id}
//       className="bg-white rounded-xl shadow hover:shadow-lg transition p-4"
//     >
//       <img src={p.thumbnail} className="w-full h-52 object-cover rounded" />

//       <div className="mt-3 space-y-1">
//         {/* Product name */}
//         <h3 className="font-semibold text-gray-900 text-lg leading-tight">
//           {p.name}
//         </h3>

//         {/* Artist */}
//         <p className="text-sm text-gray-600">
//           <span className="font-bold text-gray-800">Artist:</span>{" "}
//           {p.artistName || "—"}
//         </p>

//         {/* Slug */}
//         {/* <p className="text-xs text-gray-400 break-all">{p.slug}</p> */}

//         {/* Description */}
//         {p.description && (
//           <p className="text-sm text-gray-600 line-clamp-2">
//             <span className="font-bold text-gray-800">Description: </span>
//             {p.description}
//           </p>
//         )}

//         {/* Size & Weight row */}
//         <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
//           {p.size && (
//             <p>
//               <span className="font-bold text-gray-800">Size:</span> {p.size}
//             </p>
//           )}

//           {p.weight && (
//             <p>
//               <span className="font-bold text-gray-800">Weight:</span>{" "}
//               {p.weight}
//             </p>
//           )}
//         </div>

//         {/* Donation */}
//         {/* {p.donationPercentage !== null &&
//           p.donationPercentage !== undefined && (
//             <p className="text-sm text-green-600 font-medium">
//               Donation: {p.donationPercentage}%
//             </p>
//           )} */}

//         {/* Delivery Info */}
//         {/* {p.deliveryInfo && (
//           <p className="text-xs text-gray-500">🚚 {p.deliveryInfo}</p>
//         )} */}

//         {/* Address */}
//         {/* {p.address && <p className="text-xs text-gray-500">📍 {p.address}</p>} */}

//         {/* Installation Instructions */}
//         {/* {p.installationInstructions && (
//           <p className="text-xs text-gray-500">
//             🛠 {p.installationInstructions}
//           </p>
//         )} */}

//         {/* Category */}
//         <p className="text-xs text-gray-500">
//           <span className="font-bold text-md text-gray-800">Category: </span>
//           <span className="font-medium text-gray-700">
//             {p?.Category?.name || "—"}
//           </span>
//         </p>

//         {/* Price + Stock row */}
//         <div className="flex items-center justify-between mt-2">
//           <p className="font-semibold text-lg text-gray-900">
//             Price: ₹{Number(p.price).toLocaleString("en-IN")}
//           </p>

//           {/* <p
//             className={`text-xs font-medium px-2 py-1 rounded-full ${
//               Number(p.stock) > 0
//                 ? "bg-green-100 text-green-700"
//                 : "bg-red-100 text-red-700"
//             }`}
//           >
//             Stock: {p.stock}
//           </p> */}
//         </div>
//       </div>

//       {/* IMAGES */}

//       <div className="flex gap-2 mt-3 flex-wrap">
//         {p.images.map((img) => (
//           <div key={img} className="relative">
//             <img src={img} className="w-14 h-14 object-cover rounded" />

//             <button
//               onClick={() => handleDeleteImage(p.id, img)}
//               className="absolute top-0 right-0 text-xs bg-black text-white px-1 rounded"
//             >
//               ×
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* ACTIONS */}

//       {/* EDIT MODE */}

//       {editing && (
//         <EditProductForm
//           editData={editData}
//           setEditData={setEditData}
//           newEditImages={newEditImages}
//           setNewEditImages={setNewEditImages}
//           handleUpdateProduct={handleUpdateProduct}
//           handleCancelEdit={handleCancelEdit}
//         />
//       )}

//       <div className="flex gap-2 mt-3">
//         <button
//           onClick={() => handleBuyNow(p.id)}
//           className="flex-1 bg-black text-white py-1 rounded"
//         >
//           Buy Now
//         </button>

//         <button
//           onClick={() => handleStartEdit(p)}
//           className="flex-1 bg-blue-500 text-white py-1 rounded"
//         >
//           Edit
//         </button>

//         <button
//           onClick={() => handleDeleteProduct(p)}
//           className="flex-1 bg-red-500 text-white py-1 rounded"
//         >
//           Delete
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;

import React from "react";
import EditProductForm from "./EditProductForm";

const ProductCard = ({
  p,
  editing,

  editData,
  setEditData,

  newEditImages,
  setNewEditImages,

  handleDeleteImage,
  handleUpdateProduct,
  handleCancelEdit,

  handleBuyNow,
  handleStartEdit,
  handleDeleteProduct,

  artists,
  categories, // ✅ NEW
}) => {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-4">
      {/* THUMBNAIL */}

      <img
        src={p.thumbnail || "/placeholder.png"}
        className="w-full h-52 object-cover rounded"
        alt={p.name}
      />

      <div className="mt-3 space-y-1">
        {/* PRODUCT NAME */}

        <h3 className="font-semibold text-gray-900 text-lg leading-tight">
          {p.name}
        </h3>

        {/* ARTIST */}

        <p className="text-sm text-gray-600">
          <span className="font-bold text-gray-800">Artist:</span>{" "}
          {p.artist?.name || "—"}
        </p>

        {/* DESCRIPTION */}

        {p.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            <span className="font-bold text-gray-800">Description:</span>{" "}
            {p.description}
          </p>
        )}

        {/* SIZE + WEIGHT */}

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
          {p.size && (
            <p>
              <span className="font-bold text-gray-800">Size:</span> {p.size}
            </p>
          )}

          {p.weight && (
            <p>
              <span className="font-bold text-gray-800">Weight:</span>{" "}
              {p.weight}
            </p>
          )}
        </div>

        {/* CATEGORY */}

        <p className="text-xs text-gray-500">
          <span className="font-bold text-gray-800">Category:</span>{" "}
          <span className="font-medium text-gray-700">
            {p.category?.name || "—"}
          </span>
        </p>

        <p className="text-xs text-gray-500">
          <span className="font-bold text-gray-800">
            Installation Instruction:
          </span>{" "}
          <span className="font-medium text-gray-700">
            {p?.installationInstructions || "—"}
          </span>
        </p>

        {/* PRICE */}

        <div className="flex items-center justify-between mt-2">
          <p className="font-semibold text-lg text-gray-900">
            Price: ₹{Number(p.price || 0).toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* IMAGES */}

      {Array.isArray(p.images) && p.images.length > 0 && (
        <div className="flex gap-2 mt-3 flex-wrap">
          {p.images.map((img) => (
            <div key={img} className="relative">
              <img
                src={img}
                className="w-14 h-14 object-cover rounded border"
                alt=""
              />

              {/* DELETE IMAGE BUTTON */}

              <button
                onClick={() => handleDeleteImage(p.id, img)}
                className="absolute top-0 right-0 text-xs bg-black text-white px-1 rounded hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* EDIT FORM */}

      {editing && (
        <EditProductForm
          editData={editData}
          setEditData={setEditData}
          artists={artists}
          categories={categories} // ✅ REQUIRED
          newEditImages={newEditImages}
          setNewEditImages={setNewEditImages}
          handleUpdateProduct={handleUpdateProduct}
          handleCancelEdit={handleCancelEdit}
        />
      )}

      {/* ACTION BUTTONS */}

      <div className="flex gap-2 mt-3">
        <button
          onClick={() => handleBuyNow(p.id)}
          className="flex-1 bg-black text-white py-1 rounded hover:bg-gray-900"
        >
          Buy Now
        </button>

        <button
          onClick={() => handleStartEdit(p)}
          className="flex-1 bg-blue-500 text-white py-1 rounded hover:bg-blue-600"
        >
          Edit
        </button>

        <button
          onClick={() => handleDeleteProduct(p)}
          className="flex-1 bg-red-500 text-white py-1 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
