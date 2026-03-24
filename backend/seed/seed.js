import dotenv from "dotenv";

import connectDB from "../config/db.js";
import Customer from "../models/Customer.js";
import Invoice from "../models/Invoice.js";
import calculateInvoiceTotals from "../utils/calculateInvoiceTotals.js";

dotenv.config();

const customerSeed = [
  {
    name: "Rahul Sharma",
    email: "rahul.sharma@techvora.in",
    phone: "+91 98765-43210",
    address: "402, Signature Towers, Gurgaon, Haryana"
  },
  {
    name: "Priya Patel",
    email: "priya@innovatex.co.in",
    phone: "+91 91234-56789",
    address: "15, Brigade Road, Bangalore, Karnataka"
  },
  {
    name: "Amit Desai",
    email: "amit.desai@cloudstry.in",
    phone: "+91 99887-76655",
    address: "3B, Maker Chambers, Nariman Point, Mumbai, Maharashtra"
  },
  {
    name: "Sneha Reddy",
    email: "sneha@nextgendev.in",
    phone: "+91 98989-12121",
    address: "Plot 45, HITEC City, Hyderabad, Telangana"
  }
];

const buildInvoice = (customerId, items, tax, discount, status, date) => {
  const totals = calculateInvoiceTotals({ items, tax, discount });

  return {
    customerId,
    ...totals,
    status,
    date
  };
};

const seedDatabase = async () => {
  await connectDB();

  await Invoice.deleteMany();
  await Customer.deleteMany();

  const customers = await Customer.insertMany(customerSeed);

  const invoices = [
    buildInvoice(
      customers[0]._id,
      [
        { name: "Website Development", quantity: 1, price: 45000 },
        { name: "Server Hosting (1 Year)", quantity: 1, price: 12000 }
      ],
      10260, // 18% GST
      2000,  // Discount
      "paid",
      new Date("2026-01-15")
    ),
    buildInvoice(
      customers[1]._id,
      [
        { name: "Mobile App UI/UX", quantity: 1, price: 60000 },
        { name: "API Integration", quantity: 1, price: 25000 }
      ],
      15300, // 18% GST
      0,
      "paid",
      new Date("2026-02-02")
    ),
    buildInvoice(
      customers[2]._id,
      [
        { name: "Social Media Posts (Monthly)", quantity: 8, price: 2500 },
        { name: "Ad Campaign Management", quantity: 4, price: 5000 }
      ],
      7200, // 18% GST
      0,
      "pending",
      new Date("2026-02-24")
    ),
    buildInvoice(
      customers[3]._id,
      [
        { name: "SEO Optimization", quantity: 1, price: 15000 },
        { name: "Content Writing (Articles)", quantity: 5, price: 2000 }
      ],
      4500, // 18% GST
      1000,
      "paid",
      new Date("2026-03-05")
    ),
    buildInvoice(
      customers[0]._id,
      [
        { name: "E-Commerce Integration", quantity: 1, price: 35000 },
        { name: "Payment Gateway Setup", quantity: 1, price: 8000 }
      ],
      7740, // 18% GST
      0,
      "pending",
      new Date("2026-03-11")
    )
  ];

  await Invoice.insertMany(invoices);

  console.log("Database seeded successfully");
  process.exit(0);
};

seedDatabase().catch((error) => {
  console.error("Seeding failed:", error.message);
  process.exit(1);
});
