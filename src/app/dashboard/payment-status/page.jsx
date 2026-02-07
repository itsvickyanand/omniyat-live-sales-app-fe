import { Suspense } from "react";
import PaymentStatusClient from "./PaymentStatusClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading payment status...</div>}>
      <PaymentStatusClient />
    </Suspense>
  );
}
