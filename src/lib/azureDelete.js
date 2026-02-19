// export const deleteFromAzure = async (fileUrl) => {
//   const BACKEND = process.env.NEXT_PUBLIC_API_BASE_URL;

//   const res = await fetch(`${BACKEND}/api/upload/delete-sas`, {
//     method: "POST",
//     credentials: "include",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ fileUrl }),
//   });

//   const data = await res.json();

//   if (!res.ok) {
//     throw new Error(data?.message || "Failed to get delete SAS URL");
//   }

//   const deleteRes = await fetch(data.deleteUrl, {
//     method: "DELETE",
//   });

//   if (!deleteRes.ok) {
//     throw new Error("Failed to delete image from Azure");
//   }

//   return true;
// };

export const deleteFromAzure = async (fileUrl) => {
  if (!fileUrl || typeof fileUrl !== "string") {
    return true; // nothing to delete
  }

  const BACKEND = process.env.NEXT_PUBLIC_API_BASE_URL;

  try {
    /*
      STEP 1: Get delete SAS URL
    */
    const res = await fetch(`${BACKEND}/api/upload/delete-sas`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileUrl }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Failed to get delete SAS URL");
    }

    /*
      STEP 2: Delete from Azure
    */
    const deleteRes = await fetch(data.deleteUrl, {
      method: "DELETE",
    });

    /*
      STEP 3: Handle safe delete cases
    */
    if (deleteRes.ok) {
      return true;
    }

    // Read Azure error response
    const errorText = await deleteRes.text();

    // Ignore BlobNotFound (already deleted)
    if (deleteRes.status === 404 || errorText.includes("BlobNotFound")) {
      console.warn("Blob already deleted or not found");
      return true;
    }

    throw new Error("Failed to delete image from Azure");
  } catch (err) {
    console.warn("deleteFromAzure warning:", err.message);

    // Do NOT crash UI for delete failures
    return false;
  }
};
