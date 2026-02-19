// import React from "react";

// const EditProductForm = ({
//   editData,
//   setEditData,

//   newEditImages,
//   setNewEditImages,

//   handleUpdateProduct,
//   handleCancelEdit,
// }) => {
//   return (
//     <div className="mt-4 space-y-2 border rounded-lg p-3 bg-gray-50">
//       <span>
//         Artist Name<sup className="text-red-400">*</sup>
//       </span>
//       <input
//         value={editData.artistName || ""}
//         onChange={(e) =>
//           setEditData({
//             ...editData,
//             artistName: e.target.value,
//           })
//         }
//         placeholder="Artist Name"
//         className="border rounded px-2 py-1 w-full"
//       />
//       <span>
//         Product Name<sup className="text-red-400">*</sup>
//       </span>
//       <input
//         value={editData.name || ""}
//         onChange={(e) =>
//           setEditData({
//             ...editData,
//             name: e.target.value,
//           })
//         }
//         placeholder="Name"
//         className="border rounded px-2 py-1 w-full"
//       />
//       <span>
//         Slug<sup className="text-red-400">*</sup>
//       </span>
//       <input
//         value={editData.slug || ""}
//         onChange={(e) =>
//           setEditData({
//             ...editData,
//             slug: e.target.value,
//           })
//         }
//         placeholder="Slug"
//         className="border rounded px-2 py-1 w-full"
//       />
//       <span>Price</span>
//       <input
//         value={editData.price || ""}
//         onChange={(e) =>
//           setEditData({
//             ...editData,
//             price: e.target.value,
//           })
//         }
//         placeholder="Price"
//         className="border rounded px-2 py-1 w-full"
//       />
//       {/* <span>Stock</span>

//       <input
//         value={editData.stock || ""}
//         onChange={(e) =>
//           setEditData({
//             ...editData,
//             stock: e.target.value,
//           })
//         }
//         placeholder="Stock"
//         className="border rounded px-2 py-1 w-full"
//       />*/}
//       <span>Size</span>

//       <input
//         value={editData.size || ""}
//         onChange={(e) =>
//           setEditData({
//             ...editData,
//             size: e.target.value,
//           })
//         }
//         placeholder="Size"
//         className="border rounded px-2 py-1 w-full"
//       />
//       <span>Weight</span>

//       <input
//         value={editData.weight || ""}
//         onChange={(e) =>
//           setEditData({
//             ...editData,
//             weight: e.target.value,
//           })
//         }
//         placeholder="Weight"
//         className="border rounded px-2 py-1 w-full"
//       />

//       <input
//         value={editData.donationPercentage || ""}
//         onChange={(e) =>
//           setEditData({
//             ...editData,
//             donationPercentage: e.target.value,
//           })
//         }
//         placeholder="Donation %"
//         className="border rounded px-2 py-1 w-full"
//       />
//       <span>Description</span>
//       <textarea
//         value={editData.description || ""}
//         onChange={(e) =>
//           setEditData({
//             ...editData,
//             description: e.target.value,
//           })
//         }
//         placeholder="Description"
//         className="border rounded px-2 py-1 w-full"
//       />

//       {/* <textarea
//         value={editData.deliveryInfo || ""}
//         onChange={(e) =>
//           setEditData({
//             ...editData,
//             deliveryInfo: e.target.value,
//           })
//         }
//         placeholder="Delivery Info"
//         className="border rounded px-2 py-1 w-full"
//       /> */}

//       {/* <textarea
//         value={editData.address || ""}
//         onChange={(e) =>
//           setEditData({
//             ...editData,
//             address: e.target.value,
//           })
//         }
//         placeholder="Address"
//         className="border rounded px-2 py-1 w-full"
//       /> */}

//       {/* <textarea
//         value={editData.installationInstructions || ""}
//         onChange={(e) =>
//           setEditData({
//             ...editData,
//             installationInstructions: e.target.value,
//           })
//         }
//         placeholder="Installation Instructions"
//         className="border rounded px-2 py-1 w-full"
//       /> */}

//       {/* ADD NEW IMAGES */}

//       {/* <input
// type="file"
// multiple
// onChange={(e) =>
//   setNewEditImages(Array.from(e.target.files))
// }
// className="w-full"
// /> */}
//       <div className="w-full">
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Add Images
//         </label>

//         <label className="flex flex-col items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition">
//           {/* Icon */}
//           <svg
//             className="w-8 h-8 text-gray-400 mb-2"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="1.5"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
//             />
//           </svg>

//           {/* Text */}
//           <span className="text-sm text-gray-600">
//             Click to upload or drag & drop
//           </span>

//           <span className="text-xs text-gray-400 mt-1">
//             PNG, JPG, WEBP (multiple allowed)
//           </span>

//           {/* Hidden input */}
//           <input
//             type="file"
//             multiple
//             accept="image/*"
//             onChange={(e) => setNewEditImages(Array.from(e.target.files))}
//             className="hidden"
//           />
//         </label>

//         {/* Selected files count */}
//         {newEditImages?.length > 0 && (
//           <p className="text-xs text-gray-500 mt-2">
//             {newEditImages.length} file(s) selected
//           </p>
//         )}
//       </div>

//       <div className="flex gap-2">
//         <button
//           onClick={handleUpdateProduct}
//           className="flex-1 bg-green-600 text-white py-1 rounded"
//         >
//           Save
//         </button>

//         <button
//           onClick={handleCancelEdit}
//           className="flex-1 bg-gray-400 text-white py-1 rounded"
//         >
//           Cancel
//         </button>
//       </div>
//     </div>
//   );
// };

// export default EditProductForm;

import React from "react";

const EditProductForm = ({
  editData,
  setEditData,

  categories,
  artists,

  newEditImages,
  setNewEditImages,

  handleUpdateProduct,
  handleCancelEdit,
}) => {
  return (
    <div className="mt-4 space-y-3 border rounded-lg p-4 bg-gray-50">
      {/* CATEGORY */}

      <div>
        <label className="text-sm font-medium text-gray-700">
          Category <sup className="text-red-500">*</sup>
        </label>

        <select
          value={editData.categoryId || ""}
          onChange={(e) =>
            setEditData({
              ...editData,
              categoryId: e.target.value,
            })
          }
          className="border rounded px-2 py-1 w-full"
        >
          <option value="">Select category</option>

          {categories?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* ARTIST */}

      <div>
        <label className="text-sm font-medium text-gray-700">
          Artist <sup className="text-red-500">*</sup>
        </label>

        <select
          value={editData.artistId || ""}
          onChange={(e) =>
            setEditData({
              ...editData,
              artistId: e.target.value,
            })
          }
          className="border rounded px-2 py-1 w-full"
        >
          <option value="">Select artist</option>

          {artists?.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      {/* PRODUCT NAME */}

      <div>
        <label className="text-sm font-medium text-gray-700">
          Product Name <sup className="text-red-500">*</sup>
        </label>

        <input
          value={editData.name || ""}
          onChange={(e) =>
            setEditData({
              ...editData,
              name: e.target.value,
            })
          }
          className="border rounded px-2 py-1 w-full"
        />
      </div>

      {/* PRICE */}

      <div>
        <label className="text-sm font-medium text-gray-700">Price</label>

        <input
          value={editData.price || ""}
          onChange={(e) =>
            setEditData({
              ...editData,
              price: e.target.value,
            })
          }
          className="border rounded px-2 py-1 w-full"
        />
      </div>

      {/* SIZE */}

      <div>
        <label className="text-sm font-medium text-gray-700">Size</label>

        <input
          value={editData.size || ""}
          onChange={(e) =>
            setEditData({
              ...editData,
              size: e.target.value,
            })
          }
          className="border rounded px-2 py-1 w-full"
        />
      </div>

      {/* WEIGHT */}

      <div>
        <label className="text-sm font-medium text-gray-700">Weight</label>

        <input
          value={editData.weight || ""}
          onChange={(e) =>
            setEditData({
              ...editData,
              weight: e.target.value,
            })
          }
          className="border rounded px-2 py-1 w-full"
        />
      </div>

      {/* DONATION */}

      {/* <div>
        <label className="text-sm font-medium text-gray-700">Donation %</label>

        <input
          value={editData.donationPercentage || ""}
          onChange={(e) =>
            setEditData({
              ...editData,
              donationPercentage: e.target.value,
            })
          }
          className="border rounded px-2 py-1 w-full"
        />
      </div> */}

      {/* DESCRIPTION */}

      <div>
        <label className="text-sm font-medium text-gray-700">Description</label>

        <textarea
          value={editData.description || ""}
          onChange={(e) =>
            setEditData({
              ...editData,
              description: e.target.value,
            })
          }
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      {/* INSTALLATION INSTRUCTION */}

      <div>
        <label className="text-sm font-medium text-gray-700">
          Installation instruction
        </label>

        <textarea
          value={editData.installationInstructions || ""}
          onChange={(e) =>
            setEditData({
              ...editData,
              installationInstructions: e.target.value,
            })
          }
          className="border rounded px-2 py-1 w-full"
        />
      </div>

      {/* IMAGE UPLOAD */}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Add Images
        </label>

        <label className="flex flex-col items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition">
          <svg
            className="w-8 h-8 text-gray-400 mb-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
          </svg>

          <span className="text-sm text-gray-600">Click to upload images</span>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setNewEditImages(Array.from(e.target.files))}
            className="hidden"
          />
        </label>

        {newEditImages?.length > 0 && (
          <p className="text-xs text-gray-500 mt-2">
            {newEditImages.length} file(s) selected
          </p>
        )}
      </div>

      {/* ACTION BUTTONS */}

      <div className="flex gap-2 pt-2">
        <button
          onClick={handleUpdateProduct}
          className="flex-1 bg-green-600 text-white py-1 rounded hover:bg-green-700"
        >
          Save
        </button>

        <button
          onClick={handleCancelEdit}
          className="flex-1 bg-gray-400 text-white py-1 rounded hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditProductForm;
