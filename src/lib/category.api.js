import { api } from "./api";

export const getAllCategories = () => api("/api/category/all");

export const createCategory = (payload) =>
  api("/api/category/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateCategory = (id, payload) =>
  api(`/api/category/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteCategory = (id) =>
  api(`/api/category/delete/${id}`, {
    method: "DELETE",
  });
