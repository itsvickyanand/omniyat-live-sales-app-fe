import { api } from "./api";

// ✅ CREATE ORDER (POS)
export const createOrder = (payload) =>
  api("/api/order/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });

// ✅ GET ALL ORDERS
export const getAllOrders = () => api("/api/order/all");

// ✅ CANCEL ORDER
export const cancelOrder = (id) =>
  api(`/api/order/cancel/${id}`, {
    method: "PUT",
  });

// ✅ MARK PAID
export const markOrderPaid = (id, payload) =>
  api(`/api/order/mark-paid/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteOrder = (id) =>
  api(`/api/order/delete/${id}`, {
    method: "DELETE",
  });
