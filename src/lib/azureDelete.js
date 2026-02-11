export const deleteFromAzure = async (fileUrl) => {
  const BACKEND = process.env.NEXT_PUBLIC_API_BASE_URL;

  const res = await fetch(`${BACKEND}/api/upload/delete-sas`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileUrl }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to get delete SAS URL");
  }

  const deleteRes = await fetch(data.deleteUrl, {
    method: "DELETE",
  });

  if (!deleteRes.ok) {
    throw new Error("Failed to delete image from Azure");
  }

  return true;
};
