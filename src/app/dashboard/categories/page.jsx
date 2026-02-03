"use client";

import { useEffect, useState } from "react";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/category.api";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const res = await getAllCategories();
      setCategories(res.data || []);
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) return alert("Category name required");

    try {
      setLoading(true);
      await createCategory({ name });
      setName("");
      await fetchData();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingName.trim()) return alert("Category name required");

    try {
      setLoading(true);
      await updateCategory(editingId, { name: editingName });
      setEditingId(null);
      setEditingName("");
      await fetchData();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;

    try {
      setLoading(true);
      await deleteCategory(id);
      await fetchData();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Categories</h2>
        <p className="text-gray-600">Create, update, delete categories ✅</p>
      </div>

      {/* Create Category */}
      <div className="bg-white rounded-xl p-5 shadow">
        <h3 className="font-semibold mb-3">Create Category</h3>

        <div className="flex gap-3">
          <input
            className="border rounded-lg px-3 py-2 w-full"
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button
            onClick={handleCreate}
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded-lg"
          >
            {loading ? "Saving..." : "Create"}
          </button>
        </div>
      </div>

      {/* List Categories */}
      <div className="bg-white rounded-xl p-5 shadow">
        <h3 className="font-semibold mb-3">All Categories</h3>

        {categories.length === 0 ? (
          <p className="text-gray-500">No categories found</p>
        ) : (
          <div className="space-y-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="border rounded-lg px-4 py-3 flex justify-between items-center"
              >
                {editingId === cat.id ? (
                  <input
                    className="border px-3 py-2 rounded-lg w-full mr-3"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                  />
                ) : (
                  <p className="font-medium">{cat.name}</p>
                )}

                <div className="flex gap-3">
                  {editingId === cat.id ? (
                    <>
                      <button
                        onClick={handleUpdate}
                        className="text-green-600 font-medium"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditingName("");
                        }}
                        className="text-gray-600 font-medium"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(cat.id);
                          setEditingName(cat.name);
                        }}
                        className="text-blue-600 font-medium"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="text-red-600 font-medium"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
