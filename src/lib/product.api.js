import { api } from "./api";

// ✅ READ ALL
export const getAllProducts = () => api("/api/product/all");

// ✅ CREATE
export const createProduct = (payload) =>
  api("/api/product/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });

// ✅ UPDATE
export const updateProduct = (id, payload) =>
  api(`/api/product/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

// ✅ DELETE
export const deleteProduct = (id) =>
  api(`/api/product/delete/${id}`, {
    method: "DELETE",
  });

// ✅ GET ONE
export const getProductDetail = (id) => api(`/api/product/detail/${id}`);
