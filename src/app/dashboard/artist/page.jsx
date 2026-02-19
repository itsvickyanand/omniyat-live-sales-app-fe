"use client";

import { useEffect, useState, useRef } from "react";

import {
  getAllArtists,
  createArtist,
  updateArtist,
  deleteArtist,
} from "@/lib/artist.api";

import { uploadMultipleToAzure } from "@/lib/azureUpload";
import { deleteFromAzure } from "@/lib/azureDelete";

export default function ArtistPage() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);

  /*
  ========================
  CREATE STATE
  ========================
  */

  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  /*
  ========================
  EDIT STATE
  ========================
  */

  const editFileInputRef = useRef(null);

  const [editingId, setEditingId] = useState(null);

  const [editData, setEditData] = useState({
    name: "",
    description: "",
    imageUrl: null,
  });

  const [newEditImage, setNewEditImage] = useState(null);
  const [newEditPreview, setNewEditPreview] = useState("");

  /*
  ========================
  FETCH
  ========================
  */

  const fetchArtists = async () => {
    try {
      setLoading(true);
      const res = await getAllArtists();
      setArtists(res.data || []);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  /*
  ========================
  CREATE IMAGE SELECT
  ========================
  */

  const handleCreateImageSelect = (file) => {
    if (!file) return;

    const preview = URL.createObjectURL(file);

    setImageFile(file);
    setImagePreview(preview);
  };

  const handleRemoveSelectedImage = () => {
    setImageFile(null);
    setImagePreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /*
  ========================
  CREATE ARTIST
  ========================
  */

  const handleCreateArtist = async () => {
    if (!form.name.trim()) return alert("Name required");
    if (!imageFile) return alert("Image required");

    try {
      setLoading(true);

      const uploaded = await uploadMultipleToAzure([imageFile]);

      await createArtist({
        name: form.name,
        description: form.description,
        image: uploaded[0],
      });

      setForm({ name: "", description: "" });
      handleRemoveSelectedImage();

      await fetchArtists();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  /*
  ========================
  START EDIT
  ========================
  */

  const handleStartEdit = (artist) => {
    setEditingId(artist.id);

    setEditData({
      name: artist.name || "",
      description: artist.description || "",
      imageUrl: artist.imageUrl || null,
    });

    setNewEditImage(null);
    setNewEditPreview("");

    if (editFileInputRef.current) {
      editFileInputRef.current.value = "";
    }
  };

  /*
  ========================
  EDIT IMAGE SELECT
  ========================
  */

  const handleEditImageSelect = (file) => {
    if (!file) return;

    const preview = URL.createObjectURL(file);

    setNewEditImage(file);
    setNewEditPreview(preview);
  };

  /*
  ========================
  REMOVE EDIT IMAGE (before save)
  ========================
  */

  const handleRemoveEditPreview = () => {
    setNewEditImage(null);
    setNewEditPreview("");

    if (editFileInputRef.current) {
      editFileInputRef.current.value = "";
    }
  };

  /*
  ========================
  UPDATE ARTIST
  ========================
  */

  const handleUpdateArtist = async () => {
    try {
      setLoading(true);

      let finalImageUrl = editData.imageUrl;

      if (newEditImage) {
        const uploaded = await uploadMultipleToAzure([newEditImage]);

        const newUrl = uploaded[0];

        if (editData.imageUrl) {
          await deleteFromAzure(editData.imageUrl);
        }

        finalImageUrl = newUrl;
      }

      await updateArtist(editingId, {
        name: editData.name,
        description: editData.description,
        imageUrl: finalImageUrl,
      });

      setArtists((prev) =>
        prev.map((a) =>
          a.id === editingId
            ? {
                ...a,
                name: editData.name,
                description: editData.description,
                imageUrl: finalImageUrl,
              }
            : a
        )
      );

      setEditingId(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  /*
  ========================
  DELETE IMAGE ONLY
  ========================
  */

  const handleDeleteImage = async (artist) => {
    if (!artist.imageUrl) return;

    if (!confirm("Delete image?")) return;

    try {
      setLoading(true);

      await deleteFromAzure(artist.imageUrl);

      await updateArtist(artist.id, {
        imageUrl: null,
      });

      setArtists((prev) =>
        prev.map((a) => (a.id === artist.id ? { ...a, imageUrl: null } : a))
      );

      if (editingId === artist.id) {
        setEditData((prev) => ({
          ...prev,
          imageUrl: null,
        }));

        handleRemoveEditPreview();
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  /*
  ========================
  DELETE ARTIST
  ========================
  */

  const handleDeleteArtist = async (artist) => {
    if (!confirm("Delete artist?")) return;

    try {
      setLoading(true);

      if (artist.imageUrl) {
        await deleteFromAzure(artist.imageUrl);
      }

      await deleteArtist(artist.id);

      setArtists((prev) => prev.filter((a) => a.id !== artist.id));
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  /*
  ========================
  UI
  ========================
  */

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* CREATE FORM */}

      <div className="border p-4 rounded-xl bg-white space-y-3">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 w-full"
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border p-2 w-full"
        />
        {/* 
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleCreateImageSelect(e.target.files?.[0])}
        />

        {imagePreview && (
          <div className="relative w-fit">
            <img src={imagePreview} className="h-24 rounded" />

            <button
              onClick={handleRemoveSelectedImage}
              className="absolute -top-2 -right-2 bg-black text-white w-6 h-6 rounded-full"
            >
              ✕
            </button>
          </div>
        )} */}
        <div className="space-y-3">
          {/* Hidden real input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleCreateImageSelect(e.target.files?.[0])}
            className="hidden"
            id="artist-image-upload"
          />

          {/* Upload box */}
          {!imagePreview && (
            <label
              htmlFor="artist-image-upload"
              className="
      flex flex-col items-center justify-center
      w-full h-40
      border-2 border-dashed border-gray-300
      rounded-xl
      cursor-pointer
      hover:border-black hover:bg-gray-50
      transition
    "
            >
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
                  d="M12 16V4m0 0l-4 4m4-4l4 4m6 8v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2"
                />
              </svg>

              <p className="text-sm text-gray-600">
                Click to upload artist image
              </p>

              <p className="text-xs text-gray-400">PNG, JPG, WEBP</p>
            </label>
          )}

          {/* Preview */}
          {imagePreview && (
            <div className="relative w-fit">
              <img
                src={imagePreview}
                className="
        h-32 w-32 object-cover
        rounded-xl border
      "
              />

              {/* Remove button */}
              <button
                type="button"
                onClick={handleRemoveSelectedImage}
                className="
        absolute -top-2 -right-2
        bg-black text-white
        w-7 h-7 rounded-full
        flex items-center justify-center
        text-sm
        hover:bg-red-600
        transition
      "
              >
                ✕
              </button>

              {/* Change button */}
              <label
                htmlFor="artist-image-upload"
                className="
        absolute bottom-2 left-1/2 -translate-x-1/2
        bg-black text-white text-xs
        px-3 py-1 rounded
        cursor-pointer
        hover:bg-gray-800
      "
              >
                Change
              </label>
            </div>
          )}
        </div>

        <button
          onClick={handleCreateArtist}
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </div>

      {/* ARTIST GRID */}

      <div className="grid md:grid-cols-3 gap-4">
        {artists.map((artist) => {
          const editing = editingId === artist.id;

          const imageSrc = editing
            ? newEditPreview || editData.imageUrl
            : artist.imageUrl;

          return (
            <div key={artist.id} className="border p-3 rounded-xl">
              {imageSrc ? (
                <img src={imageSrc} className="h-40 w-full object-cover" />
              ) : (
                <img
                  src=""
                  alt="no image"
                  className="h-40 w-full object-cover"
                />
              )}

              {editing && (
                <>
                  {/* <input
                    ref={editFileInputRef}
                    type="file"
                    onChange={(e) => handleEditImageSelect(e.target.files?.[0])}
                  /> */}
                  <div className="mt-2">
                    {/* Hidden real input */}
                    <input
                      ref={editFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleEditImageSelect(e.target.files?.[0])
                      }
                      className="hidden"
                      id={`edit-image-${artist.id}`}
                    />

                    {/* Upload box (only if no image exists) */}
                    {!newEditPreview && !editData.imageUrl && (
                      <label
                        htmlFor={`edit-image-${artist.id}`}
                        className="
      flex flex-col items-center justify-center
      w-full h-32
      border-2 border-dashed border-gray-300
      rounded-xl cursor-pointer
      hover:border-black hover:bg-gray-50
      transition
    "
                      >
                        <span className="text-sm text-gray-600">
                          Upload artist image
                        </span>
                      </label>
                    )}

                    {/* Preview */}
                    {(newEditPreview || editData.imageUrl) && (
                      <div className="relative w-fit mt-2">
                        <img
                          src={newEditPreview || editData.imageUrl}
                          className="h-32 w-32 object-cover rounded-xl border"
                        />

                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(artist)}
                          className="
        absolute -top-2 -right-2
        bg-black text-white
        w-7 h-7 rounded-full
        flex items-center justify-center
        text-sm hover:bg-red-600
      "
                        >
                          ✕
                        </button>

                        {/* Change button */}
                        <label
                          htmlFor={`edit-image-${artist.id}`}
                          className="
        absolute bottom-2 left-1/2 -translate-x-1/2
        bg-black text-white text-xs
        px-3 py-1 rounded cursor-pointer
        hover:bg-gray-800
      "
                        >
                          Change
                        </label>
                      </div>
                    )}
                  </div>

                  {/* {(editData.imageUrl || newEditPreview) && (
                    <button
                      onClick={() => handleDeleteImage(artist)}
                      className="bg-black text-red-500 px-4 py-2 rounded"
                    >
                      Delete Image
                    </button>
                  )} */}
                </>
              )}

              {editing ? (
                <>
                  <input
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        name: e.target.value,
                      })
                    }
                  />

                  <textarea
                    value={editData.description}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        description: e.target.value,
                      })
                    }
                  />
                </>
              ) : (
                <>
                  <h3>Name: {artist.name}</h3>
                  <p>Desc: {artist.description}</p>
                </>
              )}

              <div className="flex gap-2 mt-2">
                {editing ? (
                  <>
                    <button
                      className="bg-black text-white px-4 py-2 rounded"
                      onClick={handleUpdateArtist}
                    >
                      Save
                    </button>

                    <button
                      className="bg-black text-white px-4 py-2 rounded"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="bg-black text-white px-4 py-2 rounded"
                      onClick={() => handleStartEdit(artist)}
                    >
                      Edit
                    </button>

                    <button
                      className="bg-black text-red-500 px-4 py-2 rounded"
                      onClick={() => handleDeleteArtist(artist)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
