//Architecture Diagram

// USER (Public Storefront - Next.js)
//         |
//         | 1) Browse / Buy Now / Checkout
//         v
// BACKEND (Node + Express)
//         |
//         | 2) Create Order + Reserve Stock (ACID Lock)
//         v
// PostgreSQL (Sequelize)
//         |
//         | 3) Payment Initiate
//         v
// CCAvenue (Payment Gateway)
//         |
//         | 4) Redirect / Callback (Success or Failure)
//         v
// BACKEND updates Order status + restores stock if needed

//Image uplaod flow
// Admin Dashboard (Next.js)
//    |
//    | request SAS URL
//    v
// Backend (/api/upload/sas)
//    |
//    | returns SAS upload URL
//    v
// Frontend uploads file directly
//    |
//    v
// Azure Blob Storage
//    |
//    v
// Frontend sends image URLs to Backend -> stored in DB
