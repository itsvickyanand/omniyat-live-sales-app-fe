export const uploadMultipleToAzure = async (files) => {
  if (!files || files.length === 0) return [];

  const BACKEND = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!BACKEND) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is missing in .env.local");
  }

  // ✅ 1) get SAS URLs from backend
  const res = await fetch(`${BACKEND}/api/upload/sas`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      files: files.map((f) => ({
        fileName: f.name,
        fileType: f.type,
      })),
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to get upload SAS URLs");
  }

  const sasList = data.data; // [{ uploadUrl, fileUrl }, ...]

  // ✅ extra safety check
  if (!Array.isArray(sasList) || sasList.length !== files.length) {
    throw new Error("SAS URL count mismatch with selected files");
  }

  // ✅ 2) upload all files directly to Azure
  const uploadedUrls = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const { uploadUrl, fileUrl } = sasList[i];

    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "x-ms-blob-type": "BlockBlob",
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!uploadRes.ok) {
      throw new Error(`Upload failed: ${file.name}`);
    }

    uploadedUrls.push(fileUrl);
  }

  return uploadedUrls;
};
