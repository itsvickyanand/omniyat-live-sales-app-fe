"use client";

import { useRouter } from "next/navigation";
import { adminLogout } from "@/lib/adminAuth";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await adminLogout();

    router.push("/admin/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      Logout
    </button>
  );
}
