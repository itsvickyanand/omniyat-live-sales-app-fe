// "use client";

// import { useEffect, useState } from "react";
// const API = process.env.NEXT_PUBLIC_API_BASE_URL;
// export default function CcavenueHistory() {
//   const [records, setRecords] = useState([]);
//   const [totalRecords, setTotalRecords] = useState(null);
//   const [pageCount, setPageCount] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const todayFormatted = () => {
//     const today = new Date();
//     const day = String(today.getDate()).padStart(2, "0");
//     const month = String(today.getMonth() + 1).padStart(2, "0");
//     const year = today.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const today = todayFormatted();

//       const res = await fetch(
//         `${API}/api/admin/ccavenue/history?fromDate=${today}&toDate=${today}&page=1`
//       );

//       const data = await res.json();

//       if (!data.success) {
//         throw new Error("Failed to fetch data");
//       }

//       setRecords(data.data.records || []);
//       setTotalRecords(data.data.totalRecords);
//       setPageCount(data.data.pageCount);
//     } catch (err) {
//       console.error(err);
//       setError("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const statusColor = (status) => {
//     if (status === "Shipped") return "bg-green-100 text-green-700";
//     if (status === "Unsuccessful" || status === "Aborted")
//       return "bg-red-100 text-red-700";
//     if (status === "Initiated") return "bg-yellow-100 text-yellow-700";
//     return "bg-gray-100 text-gray-700";
//   };

//   return (
//     <div className="p-4 md:p-8">
//       <h1 className="text-2xl md:text-3xl font-bold mb-6">
//         CCAvenue Payment History (Today)
//       </h1>

//       {/* Stats */}
//       <div className="flex flex-wrap gap-4 mb-6">
//         <div className="bg-white shadow rounded-lg p-4">
//           <p className="text-sm text-gray-500">Total Records</p>
//           <p className="text-xl font-semibold">{totalRecords ?? "-"}</p>
//         </div>

//         <div className="bg-white shadow rounded-lg p-4">
//           <p className="text-sm text-gray-500">Total Pages</p>
//           <p className="text-xl font-semibold">{pageCount ?? "-"}</p>
//         </div>
//       </div>

//       {loading && (
//         <div className="text-center py-10 text-gray-500">
//           Loading payments...
//         </div>
//       )}

//       {error && <div className="text-center py-10 text-red-600">{error}</div>}

//       {!loading && !error && (
//         <div className="overflow-x-auto bg-white shadow rounded-lg">
//           <table className="min-w-full text-sm text-left">
//             <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
//               <tr>
//                 <th className="px-4 py-3">Reference No</th>
//                 <th className="px-4 py-3">Order No</th>
//                 <th className="px-4 py-3">Amount</th>
//                 <th className="px-4 py-3">Currency</th>
//                 <th className="px-4 py-3">Status</th>
//                 <th className="px-4 py-3">Bank Ref</th>
//                 <th className="px-4 py-3">Bank Response</th>
//                 <th className="px-4 py-3">Payment Method</th>
//                 <th className="px-4 py-3">Date Time</th>
//                 <th className="px-4 py-3">Billing Name</th>
//                 <th className="px-4 py-3">Billing City</th>
//                 <th className="px-4 py-3">Billing Country</th>
//                 <th className="px-4 py-3">Billing Tel</th>
//                 <th className="px-4 py-3">Billing Email</th>
//               </tr>
//             </thead>
//             <tbody>
//               {records.length === 0 && (
//                 <tr>
//                   <td colSpan="14" className="text-center py-6 text-gray-500">
//                     No records found
//                   </td>
//                 </tr>
//               )}

//               {records.map((rec, index) => (
//                 <tr key={index} className="border-t hover:bg-gray-50">
//                   <td className="px-4 py-3 font-medium">{rec.reference_no}</td>
//                   <td className="px-4 py-3">{rec.order_no}</td>
//                   <td className="px-4 py-3">{rec.amount}</td>
//                   <td className="px-4 py-3">{rec.currency}</td>
//                   <td className="px-4 py-3">
//                     <span
//                       className={`px-2 py-1 rounded text-xs font-medium ${statusColor(
//                         rec.status
//                       )}`}
//                     >
//                       {rec.status}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3">{rec.bank_ref_no || "-"}</td>
//                   <td className="px-4 py-3">{rec.bank_response || "-"}</td>
//                   <td className="px-4 py-3">{rec.payment_method || "-"}</td>
//                   <td className="px-4 py-3 whitespace-nowrap">
//                     {rec.date_time}
//                   </td>
//                   <td className="px-4 py-3">{rec.billing_name || "-"}</td>
//                   <td className="px-4 py-3">{rec.billing_city || "-"}</td>
//                   <td className="px-4 py-3">{rec.billing_country || "-"}</td>
//                   <td className="px-4 py-3">{rec.billing_tel || "-"}</td>
//                   <td className="px-4 py-3">{rec.billing_email || "-"}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

// "use client";

// import { useEffect, useMemo, useState } from "react";

// const API = process.env.NEXT_PUBLIC_API_BASE_URL;

// export default function CcavenueHistory() {
//   const [records, setRecords] = useState([]);
//   const [filtered, setFiltered] = useState([]);

//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");

//   const [statusFilter, setStatusFilter] = useState("");
//   const [search, setSearch] = useState("");

//   const [sortField, setSortField] = useState("date_time");
//   const [sortDirection, setSortDirection] = useState("desc");

//   const [page, setPage] = useState(1);
//   const rowsPerPage = 10;

//   const [totalRecords, setTotalRecords] = useState(null);
//   const [pageCount, setPageCount] = useState(null);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const formatForAPI = (date) => {
//     const d = new Date(date);
//     const day = String(d.getDate()).padStart(2, "0");
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const year = d.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   const fetchData = async () => {
//     if (!fromDate || !toDate) return;

//     try {
//       setLoading(true);
//       setError(null);

//       const res = await fetch(
//         `${API}/api/admin/ccavenue/history?fromDate=${formatForAPI(
//           fromDate
//         )}&toDate=${formatForAPI(toDate)}&page=1`
//       );

//       const data = await res.json();

//       if (!data.success) throw new Error("Failed");

//       setRecords(data.data.records || []);
//       setTotalRecords(data.data.totalRecords);
//       setPageCount(data.data.pageCount);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to fetch data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔎 Filtering + Search + Sorting
//   const processedData = useMemo(() => {
//     let data = [...records];

//     if (statusFilter) {
//       data = data.filter((r) => r.status === statusFilter);
//     }

//     if (search) {
//       data = data.filter(
//         (r) =>
//           r.reference_no?.toLowerCase().includes(search.toLowerCase()) ||
//           r.order_no?.toLowerCase().includes(search.toLowerCase())
//       );
//     }

//     data.sort((a, b) => {
//       let valA = a[sortField] || "";
//       let valB = b[sortField] || "";

//       if (sortField === "amount") {
//         valA = parseFloat(valA);
//         valB = parseFloat(valB);
//       }

//       if (valA < valB) return sortDirection === "asc" ? -1 : 1;
//       if (valA > valB) return sortDirection === "asc" ? 1 : -1;
//       return 0;
//     });

//     return data;
//   }, [records, statusFilter, search, sortField, sortDirection]);

//   // Pagination slice
//   const paginated = useMemo(() => {
//     const start = (page - 1) * rowsPerPage;
//     return processedData.slice(start, start + rowsPerPage);
//   }, [processedData, page]);

//   const statusColor = (status) => {
//     if (status === "Shipped") return "bg-green-100 text-green-700";
//     if (status === "Unsuccessful" || status === "Aborted")
//       return "bg-red-100 text-red-700";
//     if (status === "Initiated") return "bg-yellow-100 text-yellow-700";
//     return "bg-gray-100 text-gray-700";
//   };

//   const toggleSort = (field) => {
//     if (sortField === field) {
//       setSortDirection(sortDirection === "asc" ? "desc" : "asc");
//     } else {
//       setSortField(field);
//       setSortDirection("desc");
//     }
//   };

//   return (
//     <div className="p-4 md:p-8">
//       <h1 className="text-2xl font-bold mb-6">CCAvenue Payment History</h1>

//       {/* FILTER BAR */}
//       <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4 items-end">
//         <div>
//           <label className="block text-sm text-gray-600">From</label>
//           <input
//             type="date"
//             className="border rounded px-3 py-2"
//             value={fromDate}
//             onChange={(e) => setFromDate(e.target.value)}
//           />
//         </div>

//         <div>
//           <label className="block text-sm text-gray-600">To</label>
//           <input
//             type="date"
//             className="border rounded px-3 py-2"
//             value={toDate}
//             onChange={(e) => setToDate(e.target.value)}
//           />
//         </div>

//         <button
//           onClick={fetchData}
//           className="bg-black text-white px-4 py-2 rounded hover:opacity-80"
//         >
//           Fetch
//         </button>

//         <div>
//           <label className="block text-sm text-gray-600">Status</label>
//           <select
//             className="border rounded px-3 py-2"
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//           >
//             <option value="">All</option>
//             <option value="Shipped">Shipped</option>
//             <option value="Unsuccessful">Unsuccessful</option>
//             <option value="Aborted">Aborted</option>
//             <option value="Initiated">Initiated</option>
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm text-gray-600">Search</label>
//           <input
//             type="text"
//             placeholder="Ref / Order No"
//             className="border rounded px-3 py-2"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* TABLE */}
//       <div className="overflow-x-auto bg-white shadow rounded-lg">
//         <table className="min-w-full text-sm">
//           <thead className="bg-gray-100 text-xs uppercase text-gray-600">
//             <tr>
//               {[
//                 "reference_no",
//                 "order_no",
//                 "amount",
//                 "status",
//                 "payment_method",
//                 "bank_ref_no",
//                 "date_time",
//               ].map((field) => (
//                 <th
//                   key={field}
//                   onClick={() => toggleSort(field)}
//                   className="px-4 py-3 cursor-pointer"
//                 >
//                   {field.replace("_", " ")}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {paginated.map((rec, i) => (
//               <tr key={i} className="border-t hover:bg-gray-50">
//                 <td className="px-4 py-3">{rec.reference_no}</td>
//                 <td className="px-4 py-3">{rec.order_no}</td>
//                 <td className="px-4 py-3">
//                   {rec.amount} {rec.currency}
//                 </td>
//                 <td className="px-4 py-3">
//                   <span
//                     className={`px-2 py-1 rounded text-xs ${statusColor(
//                       rec.status
//                     )}`}
//                   >
//                     {rec.status}
//                   </span>
//                 </td>
//                 <td className="px-4 py-3">{rec.payment_method || "-"}</td>
//                 <td className="px-4 py-3">{rec.bank_ref_no || "-"}</td>
//                 <td className="px-4 py-3 whitespace-nowrap">{rec.date_time}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* PAGINATION */}
//       <div className="flex justify-between items-center mt-6">
//         <button
//           disabled={page === 1}
//           onClick={() => setPage(page - 1)}
//           className="px-4 py-2 border rounded disabled:opacity-50"
//         >
//           Prev
//         </button>

//         <span className="text-sm">
//           Page {page} / {Math.ceil(processedData.length / rowsPerPage) || 1}
//         </span>

//         <button
//           disabled={page >= Math.ceil(processedData.length / rowsPerPage)}
//           onClick={() => setPage(page + 1)}
//           className="px-4 py-2 border rounded disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useMemo, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function CcavenueHistory() {
  const [records, setRecords] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatForAPI = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const fetchData = async () => {
    if (!fromDate || !toDate) return;

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `${API}/api/admin/ccavenue/history?fromDate=${formatForAPI(
          fromDate
        )}&toDate=${formatForAPI(toDate)}&page=1`
      );

      const data = await res.json();
      if (!data.success) throw new Error("Failed");
      // 🔥 reverse to show latest first
      const sortedByLatest = (data.data.records || []).sort(
        (a, b) => new Date(b.order_date_time) - new Date(a.order_date_time)
      );

      setRecords(sortedByLatest || []);
      setPage(1);
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  /* 🔥 Automatically detect all fields */
  const allColumns = useMemo(() => {
    if (!records.length) return [];
    return Object.keys(records[0]);
  }, [records]);

  /* 🔍 Global search across ALL fields */
  const processedData = useMemo(() => {
    let data = [...records];

    if (search) {
      data = data.filter((row) =>
        Object.values(row)
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (sortField) {
      data.sort((a, b) => {
        let valA = a[sortField] ?? "";
        let valB = b[sortField] ?? "";

        const numA = parseFloat(valA);
        const numB = parseFloat(valB);

        if (!isNaN(numA) && !isNaN(numB)) {
          return sortDirection === "asc" ? numA - numB : numB - numA;
        }

        return sortDirection === "asc"
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
    }

    return data;
  }, [records, search, sortField, sortDirection]);

  const paginated = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return processedData.slice(start, start + rowsPerPage);
  }, [processedData, page]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">
        CCAvenue Payment History (Full Data)
      </h1>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm text-gray-600">From</label>
          <input
            type="date"
            className="border rounded px-3 py-2"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">To</label>
          <input
            type="date"
            className="border rounded px-3 py-2"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <button
          onClick={fetchData}
          className="bg-black text-white px-4 py-2 rounded hover:opacity-80"
        >
          Fetch
        </button>

        <div className="ml-auto">
          <label className="block text-sm text-gray-600">Search</label>
          <input
            type="text"
            placeholder="Search any field..."
            className="border rounded px-3 py-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading && <div className="py-10 text-center">Loading...</div>}
      {error && <div className="py-10 text-center text-red-500">{error}</div>}

      {!loading && !error && (
        <>
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full text-xs">
              <thead className="bg-gray-100 uppercase text-gray-600">
                <tr>
                  {allColumns.map((col) => (
                    <th
                      key={col}
                      onClick={() => toggleSort(col)}
                      className="px-4 py-3 cursor-pointer whitespace-nowrap"
                    >
                      {col}
                      {sortField === col && (
                        <span>{sortDirection === "asc" ? " ↑" : " ↓"}</span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 && (
                  <tr>
                    <td
                      colSpan={allColumns.length}
                      className="text-center py-6"
                    >
                      No records found
                    </td>
                  </tr>
                )}

                {paginated.map((row, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    {allColumns.map((col) => (
                      <td key={col} className="px-4 py-3 whitespace-nowrap">
                        {row[col] !== "" && row[col] !== null
                          ? String(row[col])
                          : "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex justify-between items-center mt-6">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span className="text-sm">
              Page {page} / {Math.ceil(processedData.length / rowsPerPage) || 1}
            </span>

            <button
              disabled={page >= Math.ceil(processedData.length / rowsPerPage)}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
