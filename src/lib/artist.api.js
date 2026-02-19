import { api } from "./api";

export const getAllArtists = () => api("/api/artist");

export const getArtistById = (id) => api(`/api/artist/${id}`);

export const createArtist = (payload) =>
  api("/api/artist", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateArtist = (id, payload) =>
  api(`/api/artist/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteArtist = (id) =>
  api(`/api/artist/${id}`, {
    method: "DELETE",
  });
