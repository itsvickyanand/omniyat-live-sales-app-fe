const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const api = async (path, options = {}) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Something went wrong");
  }

  return data;
};
