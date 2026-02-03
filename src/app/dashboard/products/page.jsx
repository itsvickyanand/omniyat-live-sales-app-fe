"use client";

import { useEffect, useMemo, useState } from "react";
import { getAllCategories } from "@/lib/category.api";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "@/lib/product.api";
import { uploadMultipleToAzure } from "@/lib/azureUpload";
import { deleteFromAzure } from "@/lib/azureDelete";

export default function ProductsPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);

  // ✅ Create form states
  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageFiles, setImageFiles] = useState([]);

  // ✅ Edit mode
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    categoryId: "",
    name: "",
    slug: "",
    price: "",
    stock: "",
    isActive: true,
  });
  const [newEditImages, setNewEditImages] = useState([]);

  const selectedEditingProduct = useMemo(() => {
    return products.find((p) => p.id === editingId) || null;
  }, [editingId, products]);

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
      try {
        setLoading(true);
        await fetchCategories();
        await fetchProducts();
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleCreateProduct = async () => {
    if (!categoryId) return alert("Please select a category");
    if (!name.trim()) return alert("Product name required");
    if (!slug.trim()) return alert("Product slug required");
    if (price === "" || isNaN(price)) return alert("Valid price required");
    if (stock === "" || isNaN(stock)) return alert("Valid stock required");
    if (imageFiles.length === 0) return alert("Please select product images");

    try {
      setLoading(true);

      const uploadedUrls = await uploadMultipleToAzure(imageFiles);

      await createProduct({
        categoryId,
        name,
        slug,
        price: Number(price),
        stock: Number(stock),
        images: uploadedUrls,
        thumbnail: uploadedUrls[0],
        isActive: true,
      });

      // ✅ reset create form
      setCategoryId("");
      setName("");
      setSlug("");
      setPrice("");
      setStock("");
      setImageFiles([]);

      await fetchProducts();
      alert("Product created ✅");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (p) => {
    setEditingId(p.id);
    setEditData({
      categoryId: p.categoryId || "",
      name: p.name || "",
      slug: p.slug || "",
      price: p.price ?? "",
      stock: p.stock ?? "",
      isActive: p.isActive ?? true,
    });
    setNewEditImages([]);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({
      categoryId: "",
      name: "",
      slug: "",
      price: "",
      stock: "",
      isActive: true,
    });
    setNewEditImages([]);
  };

  const handleUpdateProduct = async () => {
    if (!editingId) return;
    if (!editData.categoryId) return alert("Category required");
    if (!editData.name.trim()) return alert("Product name required");
    if (!editData.slug.trim()) return alert("Slug required");
    if (editData.price === "" || isNaN(editData.price))
      return alert("Valid price required");
    if (editData.stock === "" || isNaN(editData.stock))
      return alert("Valid stock required");

    try {
      setLoading(true);

      let finalImages = selectedEditingProduct?.images || [];

      // ✅ if new images selected, upload and append
      if (newEditImages.length > 0) {
        const newUrls = await uploadMultipleToAzure(newEditImages);
        finalImages = [...finalImages, ...newUrls];
      }

      // ✅ ensure thumbnail exists
      const finalThumbnail =
        selectedEditingProduct?.thumbnail || finalImages[0] || null;

      await updateProduct(editingId, {
        categoryId: editData.categoryId,
        name: editData.name,
        slug: editData.slug,
        price: Number(editData.price),
        stock: Number(editData.stock),
        isActive: editData.isActive,
        images: finalImages,
        thumbnail: finalThumbnail,
      });

      await fetchProducts();
      alert("Product updated ✅");
      handleCancelEdit();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (productId, imgUrl) => {
    try {
      setLoading(true);

      const product = products.find((p) => p.id === productId);
      if (!product) return alert("Product not found");

      await deleteFromAzure(imgUrl);

      const updatedImages = (product.images || []).filter((u) => u !== imgUrl);
      const newThumbnail =
        product.thumbnail === imgUrl
          ? updatedImages[0] || null
          : product.thumbnail;

      await updateProduct(productId, {
        images: updatedImages,
        thumbnail: newThumbnail,
      });

      await fetchProducts();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (product) => {
    if (!confirm(`Delete product "${product.name}" ?`)) return;

    try {
      setLoading(true);

      // ✅ delete all images from Azure first
      const imgs = product.images || [];
      for (const img of imgs) {
        try {
          await deleteFromAzure(img);
        } catch (err) {
          // don’t fail everything if one image missing
          console.log("Image delete failed:", img, err.message);
        }
      }

      // ✅ delete product from DB
      await deleteProduct(product.id);

      await fetchProducts();
      alert("Product deleted ✅");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (catId) => {
    const c = categories.find((x) => x.id === catId);
    return c?.name || "Unknown";
  };

  return (
    <div className="space-y-6">
      {/* ✅ Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Products</h2>
          <p className="text-gray-600 text-sm">
            Create, edit, delete products + upload images to Azure ✅
          </p>
        </div>

        {loading && (
          <div className="text-sm px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 w-fit">
            Processing...
          </div>
        )}
      </div>

      {/* ✅ Create Product Form */}
      <div className="bg-white rounded-2xl p-5 shadow border">
        <h3 className="font-semibold mb-4 text-lg">Create Product</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select
            className="border rounded-xl px-3 py-2"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            className="border rounded-xl px-3 py-2"
            placeholder="Product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="border rounded-xl px-3 py-2"
            placeholder="Slug (example: iphone-15)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />

          <input
            className="border rounded-xl px-3 py-2"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <input
            className="border rounded-xl px-3 py-2"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />

          <input
            type="file"
            multiple
            accept="image/*"
            className="border rounded-xl px-3 py-2 sm:col-span-2"
            onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
          />

          {imageFiles.length > 0 && (
            <p className="text-xs text-gray-500 sm:col-span-2">
              Selected Images: <b>{imageFiles.length}</b>
            </p>
          )}
        </div>

        <button
          onClick={handleCreateProduct}
          disabled={loading}
          className="mt-4 w-full sm:w-fit bg-black text-white px-5 py-2 rounded-xl hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Create Product"}
        </button>
      </div>

      {/* ✅ Products Cards Grid */}
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">All Products</h3>

        {products.length === 0 ? (
          <div className="bg-white border rounded-2xl p-6 text-gray-500 shadow">
            No products found
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {products
              .filter((p) => Number(p.stock) > 0)
              .map((p) => {
                const isEditing = editingId === p.id;

                return (
                  <div
                    key={p.id}
                    className="bg-white border rounded-2xl shadow p-4 flex flex-col gap-3"
                  >
                    {/* ✅ Top: Image + Actions */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-xl overflow-hidden border bg-gray-50">
                          {p.thumbnail ? (
                            <img
                              src={p.thumbnail}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                              No Image
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="font-semibold truncate">{p.name}</p>
                          <p className="text-xs text-gray-500 truncate">
                            {p.slug}
                          </p>
                          <p className="text-xs mt-1 text-gray-600">
                            <span className="font-medium">₹{p.price}</span> •
                            Stock:{" "}
                            <span className="font-medium">{p.stock}</span>
                          </p>
                        </div>
                      </div>

                      {/* ✅ Action Buttons */}
                      <div className="flex flex-col gap-2">
                        {!isEditing ? (
                          <>
                            <button
                              onClick={() => handleStartEdit(p)}
                              className="text-xs px-3 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleDeleteProduct(p)}
                              className="text-xs px-3 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100"
                            >
                              Delete
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={handleUpdateProduct}
                              className="text-xs px-3 py-1 rounded-lg bg-green-50 text-green-700 hover:bg-green-100"
                            >
                              Save
                            </button>

                            <button
                              onClick={handleCancelEdit}
                              className="text-xs px-3 py-1 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* ✅ Category Badge */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                        Category:{" "}
                        {p?.Category?.name || getCategoryName(p.categoryId)}
                      </span>

                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          p.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {p.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    {/* ✅ Images Gallery */}
                    {Array.isArray(p.images) && p.images.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {p.images.slice(0, 4).map((imgUrl) => (
                          <div
                            key={imgUrl}
                            className="relative w-14 h-14 rounded-xl overflow-hidden border"
                          >
                            <img
                              src={imgUrl}
                              alt="product"
                              className="w-full h-full object-cover"
                            />

                            {/* ✅ delete image */}
                            <button
                              onClick={() => handleDeleteImage(p.id, imgUrl)}
                              disabled={loading}
                              className="absolute top-1 right-1 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full hover:bg-black disabled:opacity-50"
                            >
                              ✕
                            </button>
                          </div>
                        ))}

                        {p.images.length > 4 && (
                          <div className="w-14 h-14 rounded-xl border bg-gray-50 flex items-center justify-center text-xs text-gray-500">
                            +{p.images.length - 4}
                          </div>
                        )}
                      </div>
                    )}

                    {/* ✅ Edit Form (Inline) */}
                    {isEditing && (
                      <div className="border rounded-2xl p-3 bg-gray-50 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <select
                            className="border rounded-xl px-3 py-2"
                            value={editData.categoryId}
                            onChange={(e) =>
                              setEditData((prev) => ({
                                ...prev,
                                categoryId: e.target.value,
                              }))
                            }
                          >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>

                          <input
                            className="border rounded-xl px-3 py-2"
                            placeholder="Name"
                            value={editData.name}
                            onChange={(e) =>
                              setEditData((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                          />

                          <input
                            className="border rounded-xl px-3 py-2"
                            placeholder="Slug"
                            value={editData.slug}
                            onChange={(e) =>
                              setEditData((prev) => ({
                                ...prev,
                                slug: e.target.value,
                              }))
                            }
                          />

                          <input
                            className="border rounded-xl px-3 py-2"
                            placeholder="Price"
                            value={editData.price}
                            onChange={(e) =>
                              setEditData((prev) => ({
                                ...prev,
                                price: e.target.value,
                              }))
                            }
                          />

                          <input
                            className="border rounded-xl px-3 py-2"
                            placeholder="Stock"
                            value={editData.stock}
                            onChange={(e) =>
                              setEditData((prev) => ({
                                ...prev,
                                stock: e.target.value,
                              }))
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between gap-3">
                          <label className="flex items-center gap-2 text-sm text-gray-700">
                            <input
                              type="checkbox"
                              checked={editData.isActive}
                              onChange={(e) =>
                                setEditData((prev) => ({
                                  ...prev,
                                  isActive: e.target.checked,
                                }))
                              }
                            />
                            Active
                          </label>

                          <div className="text-xs text-gray-500">
                            Add new images (optional)
                          </div>
                        </div>

                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="border rounded-xl px-3 py-2 w-full"
                          onChange={(e) =>
                            setNewEditImages(Array.from(e.target.files || []))
                          }
                        />

                        {newEditImages.length > 0 && (
                          <p className="text-xs text-gray-500">
                            New Images Selected: <b>{newEditImages.length}</b>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
