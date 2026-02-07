// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { getAllCategories } from "@/lib/category.api";
// import { useRouter } from "next/navigation";

// import {
//   createProduct,
//   deleteProduct,
//   getAllProducts,
//   updateProduct,
// } from "@/lib/product.api";
// import { uploadMultipleToAzure } from "@/lib/azureUpload";
// import { deleteFromAzure } from "@/lib/azureDelete";

// export default function ProductsPage() {
//   const [categories, setCategories] = useState([]);
//   const [products, setProducts] = useState([]);

//   const [loading, setLoading] = useState(false);

//   // ✅ Create form states
//   const [categoryId, setCategoryId] = useState("");
//   const [name, setName] = useState("");
//   const [slug, setSlug] = useState("");
//   const [price, setPrice] = useState("");
//   const [stock, setStock] = useState("");
//   const [imageFiles, setImageFiles] = useState([]);

//   const router = useRouter();

//   const handleBuyNow = (productId) => {
//     router.push(`/dashboard/checkout?productId=${productId}&qty=1`);
//   };

//   // ✅ Edit mode
//   const [editingId, setEditingId] = useState(null);
//   const [editData, setEditData] = useState({
//     categoryId: "",
//     name: "",
//     slug: "",
//     price: "",
//     stock: "",
//     isActive: true,
//   });
//   const [newEditImages, setNewEditImages] = useState([]);

//   const selectedEditingProduct = useMemo(() => {
//     return products.find((p) => p.id === editingId) || null;
//   }, [editingId, products]);

//   const fetchCategories = async () => {
//     const res = await getAllCategories();
//     setCategories(res.data || []);
//   };

//   const fetchProducts = async () => {
//     const res = await getAllProducts();
//     setProducts(res.data || []);
//   };

//   useEffect(() => {
//     (async () => {
//       try {
//         setLoading(true);
//         await fetchCategories();
//         await fetchProducts();
//       } catch (err) {
//         alert(err.message);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   const handleCreateProduct = async () => {
//     if (!categoryId) return alert("Please select a category");
//     if (!name.trim()) return alert("Product name required");
//     if (!slug.trim()) return alert("Product slug required");
//     if (price === "" || isNaN(price)) return alert("Valid price required");
//     if (stock === "" || isNaN(stock)) return alert("Valid stock required");
//     if (imageFiles.length === 0) return alert("Please select product images");

//     try {
//       setLoading(true);

//       const uploadedUrls = await uploadMultipleToAzure(imageFiles);

//       await createProduct({
//         categoryId,
//         name,
//         slug,
//         price: Number(price),
//         stock: Number(stock),
//         images: uploadedUrls,
//         thumbnail: uploadedUrls[0],
//         isActive: true,
//       });

//       // ✅ reset create form
//       setCategoryId("");
//       setName("");
//       setSlug("");
//       setPrice("");
//       setStock("");
//       setImageFiles([]);

//       await fetchProducts();
//       alert("Product created ✅");
//     } catch (err) {
//       alert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStartEdit = (p) => {
//     setEditingId(p.id);
//     setEditData({
//       categoryId: p.categoryId || "",
//       name: p.name || "",
//       slug: p.slug || "",
//       price: p.price ?? "",
//       stock: p.stock ?? "",
//       isActive: p.isActive ?? true,
//     });
//     setNewEditImages([]);
//   };

//   const handleCancelEdit = () => {
//     setEditingId(null);
//     setEditData({
//       categoryId: "",
//       name: "",
//       slug: "",
//       price: "",
//       stock: "",
//       isActive: true,
//     });
//     setNewEditImages([]);
//   };

//   const handleUpdateProduct = async () => {
//     if (!editingId) return;
//     if (!editData.categoryId) return alert("Category required");
//     if (!editData.name.trim()) return alert("Product name required");
//     if (!editData.slug.trim()) return alert("Slug required");
//     if (editData.price === "" || isNaN(editData.price))
//       return alert("Valid price required");
//     if (editData.stock === "" || isNaN(editData.stock))
//       return alert("Valid stock required");

//     try {
//       setLoading(true);

//       let finalImages = selectedEditingProduct?.images || [];

//       // ✅ if new images selected, upload and append
//       if (newEditImages.length > 0) {
//         const newUrls = await uploadMultipleToAzure(newEditImages);
//         finalImages = [...finalImages, ...newUrls];
//       }

//       // ✅ ensure thumbnail exists
//       const finalThumbnail =
//         selectedEditingProduct?.thumbnail || finalImages[0] || null;

//       await updateProduct(editingId, {
//         categoryId: editData.categoryId,
//         name: editData.name,
//         slug: editData.slug,
//         price: Number(editData.price),
//         stock: Number(editData.stock),
//         isActive: editData.isActive,
//         images: finalImages,
//         thumbnail: finalThumbnail,
//       });

//       await fetchProducts();
//       alert("Product updated ✅");
//       handleCancelEdit();
//     } catch (err) {
//       alert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteImage = async (productId, imgUrl) => {
//     try {
//       setLoading(true);

//       const product = products.find((p) => p.id === productId);
//       if (!product) return alert("Product not found");

//       await deleteFromAzure(imgUrl);

//       const updatedImages = (product.images || []).filter((u) => u !== imgUrl);
//       const newThumbnail =
//         product.thumbnail === imgUrl
//           ? updatedImages[0] || null
//           : product.thumbnail;

//       await updateProduct(productId, {
//         images: updatedImages,
//         thumbnail: newThumbnail,
//       });

//       await fetchProducts();
//     } catch (err) {
//       alert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteProduct = async (product) => {
//     if (!confirm(`Delete product "${product.name}" ?`)) return;

//     try {
//       setLoading(true);

//       // ✅ delete all images from Azure first
//       const imgs = product.images || [];
//       for (const img of imgs) {
//         try {
//           await deleteFromAzure(img);
//         } catch (err) {
//           // don’t fail everything if one image missing
//           console.log("Image delete failed:", img, err.message);
//         }
//       }

//       // ✅ delete product from DB
//       await deleteProduct(product.id);

//       await fetchProducts();
//       alert("Product deleted ✅");
//     } catch (err) {
//       alert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getCategoryName = (catId) => {
//     const c = categories.find((x) => x.id === catId);
//     return c?.name || "Unknown";
//   };

//   return (
//     <div className="space-y-6">
//       {/* ✅ Header */}
//       <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h2 className="text-2xl font-bold">Products</h2>
//           <p className="text-gray-600 text-sm">
//             Create, edit, delete products + upload images to Azure ✅
//           </p>
//         </div>

//         {loading && (
//           <div className="text-sm px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 w-fit">
//             Processing...
//           </div>
//         )}
//       </div>

//       {/* ✅ Create Product Form */}
//       <div className="bg-white rounded-2xl p-5 shadow border">
//         <h3 className="font-semibold mb-4 text-lg">Create Product</h3>

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <select
//             className="border rounded-xl px-3 py-2"
//             value={categoryId}
//             onChange={(e) => setCategoryId(e.target.value)}
//           >
//             <option value="">Select Category</option>
//             {categories.map((cat) => (
//               <option key={cat.id} value={cat.id}>
//                 {cat.name}
//               </option>
//             ))}
//           </select>

//           <input
//             className="border rounded-xl px-3 py-2"
//             placeholder="Product name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />

//           <input
//             className="border rounded-xl px-3 py-2"
//             placeholder="Slug (example: iphone-15)"
//             value={slug}
//             onChange={(e) => setSlug(e.target.value)}
//           />

//           <input
//             className="border rounded-xl px-3 py-2"
//             placeholder="Price"
//             value={price}
//             onChange={(e) => setPrice(e.target.value)}
//           />

//           <input
//             className="border rounded-xl px-3 py-2"
//             placeholder="Stock"
//             value={stock}
//             onChange={(e) => setStock(e.target.value)}
//           />

//           <input
//             type="file"
//             multiple
//             accept="image/*"
//             className="border rounded-xl px-3 py-2 sm:col-span-2"
//             onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
//           />

//           {imageFiles.length > 0 && (
//             <p className="text-xs text-gray-500 sm:col-span-2">
//               Selected Images: <b>{imageFiles.length}</b>
//             </p>
//           )}
//         </div>

//         <button
//           onClick={handleCreateProduct}
//           disabled={loading}
//           className="mt-4 w-full sm:w-fit bg-black text-white px-5 py-2 rounded-xl hover:opacity-90 disabled:opacity-50"
//         >
//           {loading ? "Saving..." : "Create Product"}
//         </button>
//       </div>

//       {/* ✅ Products Cards Grid */}
//       <div className="space-y-3">
//         <h3 className="font-semibold text-lg">All Products</h3>

//         {products.length === 0 ? (
//           <div className="bg-white border rounded-2xl p-6 text-gray-500 shadow">
//             No products found
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
//             {products
//               .filter((p) => Number(p.stock) > 0)
//               .map((p) => {
//                 const isEditing = editingId === p.id;

//                 return (
//                   <div
//                     key={p.id}
//                     className="bg-white border rounded-2xl shadow p-4 flex flex-col gap-3"
//                   >
//                     {/* ✅ Top: Image + Actions */}
//                     <div className="flex items-start justify-between gap-3">
//                       <div className="flex items-center gap-3">
//                         <div className="w-16 h-16 rounded-xl overflow-hidden border bg-gray-50">
//                           {p.thumbnail ? (
//                             <img
//                               src={p.thumbnail}
//                               alt={p.name}
//                               className="w-full h-full object-cover"
//                             />
//                           ) : (
//                             <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
//                               No Image
//                             </div>
//                           )}
//                         </div>

//                         <div className="min-w-0">
//                           <p className="font-semibold truncate">{p.name}</p>
//                           <p className="text-xs text-gray-500 truncate">
//                             {p.slug}
//                           </p>
//                           <p className="text-xs mt-1 text-gray-600">
//                             <span className="font-medium">₹{p.price}</span> •
//                             Stock:{" "}
//                             <span className="font-medium">{p.stock}</span>
//                           </p>
//                         </div>
//                       </div>

//                       {/* ✅ Action Buttons */}
//                       <div className="flex flex-col gap-2">
//                         {!isEditing ? (
//                           <>
//                             <button
//                               onClick={() => handleBuyNow(p.id)}
//                               className="text-xs px-3 py-1 rounded-lg bg-black text-white hover:opacity-90"
//                             >
//                               Buy Now
//                             </button>

//                             <button
//                               onClick={() => handleStartEdit(p)}
//                               className="text-xs px-3 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
//                             >
//                               Edit
//                             </button>

//                             <button
//                               onClick={() => handleDeleteProduct(p)}
//                               className="text-xs px-3 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100"
//                             >
//                               Delete
//                             </button>
//                           </>
//                         ) : (
//                           <>
//                             <button
//                               onClick={handleUpdateProduct}
//                               className="text-xs px-3 py-1 rounded-lg bg-green-50 text-green-700 hover:bg-green-100"
//                             >
//                               Save
//                             </button>

//                             <button
//                               onClick={handleCancelEdit}
//                               className="text-xs px-3 py-1 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
//                             >
//                               Cancel
//                             </button>
//                           </>
//                         )}
//                       </div>
//                     </div>

//                     {/* ✅ Category Badge */}
//                     <div className="flex items-center justify-between">
//                       <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700">
//                         Category:{" "}
//                         {p?.Category?.name || getCategoryName(p.categoryId)}
//                       </span>

//                       <span
//                         className={`text-xs px-3 py-1 rounded-full ${
//                           p.isActive
//                             ? "bg-green-100 text-green-700"
//                             : "bg-gray-200 text-gray-600"
//                         }`}
//                       >
//                         {p.isActive ? "Active" : "Inactive"}
//                       </span>
//                     </div>

//                     {/* ✅ Images Gallery */}
//                     {Array.isArray(p.images) && p.images.length > 0 && (
//                       <div className="flex flex-wrap gap-2">
//                         {p.images.slice(0, 4).map((imgUrl) => (
//                           <div
//                             key={imgUrl}
//                             className="relative w-14 h-14 rounded-xl overflow-hidden border"
//                           >
//                             <img
//                               src={imgUrl}
//                               alt="product"
//                               className="w-full h-full object-cover"
//                             />

//                             {/* ✅ delete image */}
//                             <button
//                               onClick={() => handleDeleteImage(p.id, imgUrl)}
//                               disabled={loading}
//                               className="absolute top-1 right-1 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full hover:bg-black disabled:opacity-50"
//                             >
//                               ✕
//                             </button>
//                           </div>
//                         ))}

//                         {p.images.length > 4 && (
//                           <div className="w-14 h-14 rounded-xl border bg-gray-50 flex items-center justify-center text-xs text-gray-500">
//                             +{p.images.length - 4}
//                           </div>
//                         )}
//                       </div>
//                     )}

//                     {/* ✅ Edit Form (Inline) */}
//                     {isEditing && (
//                       <div className="border rounded-2xl p-3 bg-gray-50 space-y-3">
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                           <select
//                             className="border rounded-xl px-3 py-2"
//                             value={editData.categoryId}
//                             onChange={(e) =>
//                               setEditData((prev) => ({
//                                 ...prev,
//                                 categoryId: e.target.value,
//                               }))
//                             }
//                           >
//                             <option value="">Select Category</option>
//                             {categories.map((cat) => (
//                               <option key={cat.id} value={cat.id}>
//                                 {cat.name}
//                               </option>
//                             ))}
//                           </select>

//                           <input
//                             className="border rounded-xl px-3 py-2"
//                             placeholder="Name"
//                             value={editData.name}
//                             onChange={(e) =>
//                               setEditData((prev) => ({
//                                 ...prev,
//                                 name: e.target.value,
//                               }))
//                             }
//                           />

//                           <input
//                             className="border rounded-xl px-3 py-2"
//                             placeholder="Slug"
//                             value={editData.slug}
//                             onChange={(e) =>
//                               setEditData((prev) => ({
//                                 ...prev,
//                                 slug: e.target.value,
//                               }))
//                             }
//                           />

//                           <input
//                             className="border rounded-xl px-3 py-2"
//                             placeholder="Price"
//                             value={editData.price}
//                             onChange={(e) =>
//                               setEditData((prev) => ({
//                                 ...prev,
//                                 price: e.target.value,
//                               }))
//                             }
//                           />

//                           <input
//                             className="border rounded-xl px-3 py-2"
//                             placeholder="Stock"
//                             value={editData.stock}
//                             onChange={(e) =>
//                               setEditData((prev) => ({
//                                 ...prev,
//                                 stock: e.target.value,
//                               }))
//                             }
//                           />
//                         </div>

//                         <div className="flex items-center justify-between gap-3">
//                           <label className="flex items-center gap-2 text-sm text-gray-700">
//                             <input
//                               type="checkbox"
//                               checked={editData.isActive}
//                               onChange={(e) =>
//                                 setEditData((prev) => ({
//                                   ...prev,
//                                   isActive: e.target.checked,
//                                 }))
//                               }
//                             />
//                             Active
//                           </label>

//                           <div className="text-xs text-gray-500">
//                             Add new images (optional)
//                           </div>
//                         </div>

//                         <input
//                           type="file"
//                           multiple
//                           accept="image/*"
//                           className="border rounded-xl px-3 py-2 w-full"
//                           onChange={(e) =>
//                             setNewEditImages(Array.from(e.target.files || []))
//                           }
//                         />

//                         {newEditImages.length > 0 && (
//                           <p className="text-xs text-gray-500">
//                             New Images Selected: <b>{newEditImages.length}</b>
//                           </p>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useMemo, useState } from "react";
import { getAllCategories } from "@/lib/category.api";
import { useRouter } from "next/navigation";

import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "@/lib/product.api";

import { uploadMultipleToAzure } from "@/lib/azureUpload";
import { deleteFromAzure } from "@/lib/azureDelete";

export default function ProductsPage() {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // CREATE FORM STATE

  const [form, setForm] = useState({
    categoryId: "",
    artistName: "",
    name: "",
    slug: "",
    description: "",
    size: "",
    weight: "",
    donationPercentage: "",
    deliveryInfo: "",
    address: "",
    installationInstructions: "",
    price: "",
    stock: "",
    isActive: true,
  });

  const [imageFiles, setImageFiles] = useState([]);

  // EDIT STATE

  const [editingId, setEditingId] = useState(null);

  const [editData, setEditData] = useState(null);

  const [newEditImages, setNewEditImages] = useState([]);

  const selectedEditingProduct = useMemo(() => {
    return products.find((p) => p.id === editingId) || null;
  }, [editingId, products]);

  // FETCH

  const fetchCategories = async () => {
    const res = await getAllCategories();
    setCategories(res.data || []);
  };

  const fetchProducts = async () => {
    const res = await getAllProducts();
    setProducts(res.data || []);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchCategories();
      await fetchProducts();
      setLoading(false);
    })();
  }, []);

  // BUY NOW

  const handleBuyNow = (productId) => {
    router.push(`/dashboard/checkout?productId=${productId}&qty=1`);
  };

  // CREATE PRODUCT

  const handleCreateProduct = async () => {
    if (!form.categoryId) return alert("Category required");
    if (!form.artistName) return alert("Artist required");
    if (!form.name) return alert("Name required");
    if (!form.slug) return alert("Slug required");
    if (!form.price) return alert("Price required");
    if (!form.stock) return alert("Stock required");

    if (imageFiles.length === 0) return alert("Please upload images");

    try {
      setLoading(true);

      const uploadedUrls = await uploadMultipleToAzure(imageFiles);

      await createProduct({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),

        donationPercentage:
          form.donationPercentage === ""
            ? null
            : Number(form.donationPercentage),

        images: uploadedUrls,
        thumbnail: uploadedUrls[0],
      });

      alert("Product created");

      setForm({
        categoryId: "",
        artistName: "",
        name: "",
        slug: "",
        description: "",
        size: "",
        weight: "",
        donationPercentage: "",
        deliveryInfo: "",
        address: "",
        installationInstructions: "",
        price: "",
        stock: "",
        isActive: true,
      });

      setImageFiles([]);

      await fetchProducts();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // START EDIT

  // const handleStartEdit = (p) => {
  //   setEditingId(p.id);
  //   setEditData({ ...p });
  //   setNewEditImages([]);
  // };

  const handleStartEdit = (p) => {
    setEditingId(p.id);

    setEditData({
      categoryId: p.categoryId,
      artistName: p.artistName,
      name: p.name,
      slug: p.slug,
      description: p.description,
      size: p.size,
      weight: p.weight,
      donationPercentage: p.donationPercentage,
      deliveryInfo: p.deliveryInfo,
      address: p.address,
      installationInstructions: p.installationInstructions,
      price: p.price,
      stock: p.stock,
      isActive: p.isActive,
    });

    setNewEditImages([]);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData(null);
  };

  // UPDATE PRODUCT

  const handleUpdateProduct = async () => {
    try {
      setLoading(true);

      let finalImages = selectedEditingProduct.images || [];

      if (newEditImages.length > 0) {
        const newUrls = await uploadMultipleToAzure(newEditImages);

        finalImages = [...finalImages, ...newUrls];
      }

      await updateProduct(editingId, {
        ...editData,

        price: Number(editData.price),
        stock: Number(editData.stock),

        donationPercentage:
          editData.donationPercentage === ""
            ? null
            : Number(editData.donationPercentage),

        images: finalImages,
        thumbnail: finalImages[0],
      });

      alert("Updated");

      handleCancelEdit();

      await fetchProducts();
    } finally {
      setLoading(false);
    }
  };

  // DELETE IMAGE

  // const handleDeleteImage = async (productId, imgUrl) => {
  //   try {
  //     setLoading(true);

  //     await deleteFromAzure(imgUrl);

  //     const product = products.find((p) => p.id === productId);

  //     const updatedImages = product.images.filter((i) => i !== imgUrl);

  //     await updateProduct(productId, {
  //       images: updatedImages,
  //       thumbnail: updatedImages[0] || null,
  //     });

  //     await fetchProducts();
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleDeleteImage = async (productId, imgUrl) => {
    try {
      setLoading(true);

      await deleteFromAzure(imgUrl);

      const product = products.find((p) => p.id === productId);

      const updatedImages = product.images.filter((i) => i !== imgUrl);

      const updatedThumbnail =
        product.thumbnail === imgUrl
          ? updatedImages[0] || null
          : product.thumbnail;

      await updateProduct(productId, {
        images: updatedImages,
        thumbnail: updatedThumbnail,
      });

      // ✅ UPDATE UI IMMEDIATELY (IMPORTANT FIX)
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? {
                ...p,
                images: updatedImages,
                thumbnail: updatedThumbnail,
              }
            : p
        )
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // DELETE PRODUCT

  const handleDeleteProduct = async (product) => {
    if (!confirm("Delete product?")) return;

    try {
      setLoading(true);

      for (const img of product.images || []) await deleteFromAzure(img);

      await deleteProduct(product.id);

      await fetchProducts();
    } finally {
      setLoading(false);
    }
  };

  // UI

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* HEADER */}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>

          <p className="text-gray-500 text-sm">Manage artwork catalog</p>
        </div>

        {loading && (
          <div className="text-sm bg-yellow-100 text-yellow-700 px-3 py-1 rounded">
            Processing...
          </div>
        )}
      </div>

      {/* CREATE FORM */}

      {/* <div className="bg-white shadow rounded-xl p-6">
        <h2 className="font-semibold mb-4">Create Artwork</h2>

        <div className="grid grid-cols-3 gap-3">
          {Object.keys(form).map((key) => {
            if (key === "categoryId")
              return (
                <select
                  key={key}
                  value={form.categoryId}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      categoryId: e.target.value,
                    })
                  }
                  className="border rounded px-3 py-2"
                >
                  <option value="">Select category</option>

                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              );

            if (
              key === "description" ||
              key === "deliveryInfo" ||
              key === "installationInstructions"
            )
              return (
                <textarea
                  key={key}
                  placeholder={key}
                  value={form[key]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [key]: e.target.value,
                    })
                  }
                  className="border rounded px-3 py-2"
                />
              );

            return (
              <input
                key={key}
                placeholder={key}
                value={form[key]}
                onChange={(e) =>
                  setForm({
                    ...form,
                    [key]: e.target.value,
                  })
                }
                className="border rounded px-3 py-2"
              />
            );
          })}

          <div className="col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Product Images
            </label>

            <label className="flex flex-col items-center justify-center w-full px-6 py-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-white hover:bg-gray-50 hover:border-gray-400 transition duration-200">
              <svg
                className="w-10 h-10 text-gray-400 mb-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
                />
              </svg>

              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-800">
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>

              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG, WEBP (multiple allowed)
              </p>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImageFiles(Array.from(e.target.files))}
                className="hidden"
              />
            </label>

            {imageFiles.length > 0 && (
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                <span className="font-medium">{imageFiles.length}</span>
                file(s) selected
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleCreateProduct}
          className="mt-4 bg-black text-white px-4 py-2 rounded"
        >
          Create
        </button>
      </div> */}
      <div className="bg-white shadow-xl rounded-2xl border border-gray-100 p-8">
        {/* HEADER */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Create Artwork
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Add a new artwork product to your catalog
          </p>
        </div>

        {/* FORM GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Object.keys(form).map((key) => {
            const label = key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (s) => s.toUpperCase());

            const requiredFields = [
              "categoryId",
              "artistName",
              "name",
              "slug",
              "price",
              "stock",
            ];

            const isRequired = requiredFields.includes(key);

            // CATEGORY DROPDOWN
            if (key === "categoryId")
              return (
                <div key={key} className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    {label}
                    {isRequired && <span className="text-red-500 ml-1">*</span>}
                  </label>

                  <select
                    value={form.categoryId}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        categoryId: e.target.value,
                      })
                    }
                    className="
              border border-gray-300
              rounded-lg
              px-3 py-2.5
              text-sm
              focus:ring-2
              focus:ring-black
              focus:border-black
              outline-none
              transition
              hover:border-gray-400
            "
                  >
                    <option value="">Select category</option>

                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              );

            // TEXTAREA FIELDS
            if (
              key === "description" ||
              key === "deliveryInfo" ||
              key === "installationInstructions"
            )
              return (
                <div
                  key={key}
                  className="flex flex-col gap-1 md:col-span-2 xl:col-span-3"
                >
                  <label className="text-sm font-medium text-gray-700">
                    {label}
                    {isRequired && <span className="text-red-500 ml-1">*</span>}
                  </label>

                  <textarea
                    placeholder={`Enter ${label.toLowerCase()}`}
                    value={form[key]}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [key]: e.target.value,
                      })
                    }
                    rows={3}
                    className="
              border border-gray-300
              rounded-lg
              px-3 py-2.5
              text-sm
              focus:ring-2
              focus:ring-black
              focus:border-black
              outline-none
              transition
              hover:border-gray-400
              resize-none
            "
                  />
                </div>
              );

            // ALL OTHER INPUTS
            return (
              <div key={key} className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  {label}
                  {isRequired && <span className="text-red-500 ml-1">*</span>}
                </label>

                <input
                  placeholder={`Enter ${label.toLowerCase()}`}
                  value={form[key]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [key]: e.target.value,
                    })
                  }
                  className="
            border border-gray-300
            rounded-lg
            px-3 py-2.5
            text-sm
            focus:ring-2
            focus:ring-black
            focus:border-black
            outline-none
            transition
            hover:border-gray-400
          "
                />
              </div>
            );
          })}

          {/* IMAGE UPLOAD */}
          <div className="col-span-full mt-3">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Product Images <span className="text-red-500">*</span>
            </label>

            <label
              className="
      flex flex-col
      items-center
      justify-center
      w-full
      px-6 py-10
      border-2 border-dashed border-gray-300
      rounded-xl
      cursor-pointer
      bg-gray-50
      hover:bg-gray-100
      hover:border-black
      transition
    "
            >
              <svg
                className="w-10 h-10 text-gray-400 mb-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
              </svg>

              <span className="font-medium text-gray-700">
                Click to upload or drag & drop
              </span>

              <span className="text-xs text-gray-400 mt-1">
                PNG, JPG, WEBP supported
              </span>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImageFiles(Array.from(e.target.files))}
                className="hidden"
              />
            </label>

            {imageFiles.length > 0 && (
              <p className="text-xs text-gray-600 mt-2">
                {imageFiles.length} file(s) selected
              </p>
            )}
          </div>
        </div>

        {/* BUTTON */}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleCreateProduct}
            className="
      bg-black
      hover:bg-gray-900
      text-white
      px-6 py-2.5
      rounded-lg
      text-sm
      font-medium
      shadow
      transition
    "
          >
            Create Product
          </button>
        </div>
      </div>

      {/* PRODUCTS GRID */}

      <div className="grid grid-cols-3 gap-6">
        {products
          .filter((p) => Number(p.stock) > 0)
          .map((p) => {
            const editing = editingId === p.id;

            return (
              <div
                key={p.id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition p-4"
              >
                <img
                  src={p.thumbnail}
                  className="w-full h-52 object-cover rounded"
                />

                {/* <div className="mt-3 space-y-1">
                <h3 className="font-semibold">{p.name}</h3>

                <p className="text-sm text-gray-500">Artist: {p.artistName}</p>

                <p className="text-sm text-gray-500">Size: {p.size}</p>

                <p className="text-sm text-gray-500">Weight: {p.weight}</p>

                <p className="text-sm text-gray-500">
                  Donation: {p.donationPercentage}%
                </p>

                <p className="font-semibold">₹{p.price}</p>

                <p className="text-xs text-gray-400">Stock: {p.stock}</p>
              </div> */}
                <div className="mt-3 space-y-1">
                  {/* Product name */}
                  <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                    {p.name}
                  </h3>

                  {/* Artist */}
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-800">Artist:</span>{" "}
                    {p.artistName || "—"}
                  </p>

                  {/* Slug */}
                  <p className="text-xs text-gray-400 break-all">{p.slug}</p>

                  {/* Description */}
                  {p.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {p.description}
                    </p>
                  )}

                  {/* Size & Weight row */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                    {p.size && (
                      <p>
                        <span className="font-medium text-gray-800">Size:</span>{" "}
                        {p.size}
                      </p>
                    )}

                    {p.weight && (
                      <p>
                        <span className="font-medium text-gray-800">
                          Weight:
                        </span>{" "}
                        {p.weight}
                      </p>
                    )}
                  </div>

                  {/* Donation */}
                  {p.donationPercentage !== null &&
                    p.donationPercentage !== undefined && (
                      <p className="text-sm text-green-600 font-medium">
                        Donation: {p.donationPercentage}%
                      </p>
                    )}

                  {/* Delivery Info */}
                  {p.deliveryInfo && (
                    <p className="text-xs text-gray-500">🚚 {p.deliveryInfo}</p>
                  )}

                  {/* Address */}
                  {p.address && (
                    <p className="text-xs text-gray-500">📍 {p.address}</p>
                  )}

                  {/* Installation Instructions */}
                  {p.installationInstructions && (
                    <p className="text-xs text-gray-500">
                      🛠 {p.installationInstructions}
                    </p>
                  )}

                  {/* Category */}
                  <p className="text-xs text-gray-500">
                    Category:{" "}
                    <span className="font-medium text-gray-700">
                      {p?.Category?.name || "—"}
                    </span>
                  </p>

                  {/* Price + Stock row */}
                  <div className="flex items-center justify-between mt-2">
                    <p className="font-semibold text-lg text-gray-900">
                      ₹{Number(p.price).toLocaleString("en-IN")}
                    </p>

                    <p
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        Number(p.stock) > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      Stock: {p.stock}
                    </p>
                  </div>
                </div>

                {/* IMAGES */}

                <div className="flex gap-2 mt-3 flex-wrap">
                  {p.images.map((img) => (
                    <div key={img} className="relative">
                      <img
                        src={img}
                        className="w-14 h-14 object-cover rounded"
                      />

                      <button
                        onClick={() => handleDeleteImage(p.id, img)}
                        className="absolute top-0 right-0 text-xs bg-black text-white px-1 rounded"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                {/* ACTIONS */}

                {/* EDIT MODE */}

                {editing && (
                  <div className="mt-4 space-y-2 border rounded-lg p-3 bg-gray-50">
                    <input
                      value={editData.artistName || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          artistName: e.target.value,
                        })
                      }
                      placeholder="Artist Name"
                      className="border rounded px-2 py-1 w-full"
                    />

                    <input
                      value={editData.name || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          name: e.target.value,
                        })
                      }
                      placeholder="Name"
                      className="border rounded px-2 py-1 w-full"
                    />

                    <input
                      value={editData.slug || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          slug: e.target.value,
                        })
                      }
                      placeholder="Slug"
                      className="border rounded px-2 py-1 w-full"
                    />

                    <input
                      value={editData.price || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          price: e.target.value,
                        })
                      }
                      placeholder="Price"
                      className="border rounded px-2 py-1 w-full"
                    />

                    <input
                      value={editData.stock || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          stock: e.target.value,
                        })
                      }
                      placeholder="Stock"
                      className="border rounded px-2 py-1 w-full"
                    />

                    <input
                      value={editData.size || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          size: e.target.value,
                        })
                      }
                      placeholder="Size"
                      className="border rounded px-2 py-1 w-full"
                    />

                    <input
                      value={editData.weight || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          weight: e.target.value,
                        })
                      }
                      placeholder="Weight"
                      className="border rounded px-2 py-1 w-full"
                    />

                    <input
                      value={editData.donationPercentage || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          donationPercentage: e.target.value,
                        })
                      }
                      placeholder="Donation %"
                      className="border rounded px-2 py-1 w-full"
                    />

                    <textarea
                      value={editData.description || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Description"
                      className="border rounded px-2 py-1 w-full"
                    />

                    <textarea
                      value={editData.deliveryInfo || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          deliveryInfo: e.target.value,
                        })
                      }
                      placeholder="Delivery Info"
                      className="border rounded px-2 py-1 w-full"
                    />

                    <textarea
                      value={editData.address || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          address: e.target.value,
                        })
                      }
                      placeholder="Address"
                      className="border rounded px-2 py-1 w-full"
                    />

                    <textarea
                      value={editData.installationInstructions || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          installationInstructions: e.target.value,
                        })
                      }
                      placeholder="Installation Instructions"
                      className="border rounded px-2 py-1 w-full"
                    />

                    {/* ADD NEW IMAGES */}

                    {/* <input
                      type="file"
                      multiple
                      onChange={(e) =>
                        setNewEditImages(Array.from(e.target.files))
                      }
                      className="w-full"
                    /> */}
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Add Images
                      </label>

                      <label className="flex flex-col items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition">
                        {/* Icon */}
                        <svg
                          className="w-8 h-8 text-gray-400 mb-2"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
                          />
                        </svg>

                        {/* Text */}
                        <span className="text-sm text-gray-600">
                          Click to upload or drag & drop
                        </span>

                        <span className="text-xs text-gray-400 mt-1">
                          PNG, JPG, WEBP (multiple allowed)
                        </span>

                        {/* Hidden input */}
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) =>
                            setNewEditImages(Array.from(e.target.files))
                          }
                          className="hidden"
                        />
                      </label>

                      {/* Selected files count */}
                      {newEditImages?.length > 0 && (
                        <p className="text-xs text-gray-500 mt-2">
                          {newEditImages.length} file(s) selected
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdateProduct}
                        className="flex-1 bg-green-600 text-white py-1 rounded"
                      >
                        Save
                      </button>

                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 bg-gray-400 text-white py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleBuyNow(p.id)}
                    className="flex-1 bg-black text-white py-1 rounded"
                  >
                    Buy Now
                  </button>

                  <button
                    onClick={() => handleStartEdit(p)}
                    className="flex-1 bg-blue-500 text-white py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteProduct(p)}
                    className="flex-1 bg-red-500 text-white py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
