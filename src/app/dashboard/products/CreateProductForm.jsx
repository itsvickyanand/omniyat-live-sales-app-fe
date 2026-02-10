import React from "react";

const CreateProductForm = ({
  form,
  categories,
  imageFiles,
  handleCreateProduct,
  setForm,
  setImageFiles,
}) => {
  const fieldsToShow = [
    "categoryId",
    "artistName",
    "name",
    "slug",
    "description",
    "size",
    "weight",
    // "donationPercentage",
    // "deliveryInfo",
    // "address",
    // "installationInstructions",
    "price",
    // "stock",
    // "isActive",
  ];
  return (
    <div className="bg-white shadow-xl rounded-2xl border border-gray-100 p-8">
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Create Artwork</h2>

        <p className="text-sm text-gray-500 mt-1">
          Add a new artwork product to your catalog
        </p>
      </div>

      {/* FORM GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {/* {Object.keys(form).map((key) => { */}
        {Object.keys(form)
          .filter((key) => fieldsToShow.includes(key))
          .map((key) => {
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
              "description",
              // "donationPercentage",
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
  );
};

export default CreateProductForm;
