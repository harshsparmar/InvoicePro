import dotenv from "dotenv";

import connectDB from "../config/db.js";
import Customer from "../models/Customer.js";
import Invoice from "../models/Invoice.js";
import calculateInvoiceTotals from "../utils/calculateInvoiceTotals.js";

dotenv.config();

const customerSeed = [
  {
    name: "Avery Stone",
    email: "avery@northpeak.io",
    phone: "+1 555-210-8811",
    address: "1201 Market Street, San Francisco, CA"
  },
  {
    name: "Mila Chen",
    email: "mila@horizonlabs.co",
    phone: "+1 555-320-4488",
    address: "77 King West, Toronto, ON"
  },
  {
    name: "Daniel Brooks",
    email: "daniel@paperplane.studio",
    phone: "+1 555-678-9910",
    address: "18 Riverfront Plaza, Austin, TX"
  },
  {
    name: "Noor Hassan",
    email: "noor@clearscope.com",
    phone: "+1 555-884-2109",
    address: "901 Palm Avenue, Miami, FL"
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
        { name: "Dashboard Design", quantity: 1, price: 1200 },
        { name: "UX Audit", quantity: 1, price: 450 }
      ],
      120,
      50,
      "paid",
      new Date("2026-01-15")
    ),
    buildInvoice(
      customers[1]._id,
      [
        { name: "Landing Page Build", quantity: 1, price: 2400 },
        { name: "CMS Setup", quantity: 1, price: 700 }
      ],
      150,
      0,
      "paid",
      new Date("2026-02-02")
    ),
    buildInvoice(
      customers[2]._id,
      [
        { name: "Product Illustration Set", quantity: 8, price: 180 },
        { name: "Creative Direction", quantity: 4, price: 140 }
      ],
      100,
      80,
      "pending",
      new Date("2026-02-24")
    ),
    buildInvoice(
      customers[3]._id,
      [
        { name: "Performance Review", quantity: 1, price: 900 },
        { name: "Optimization Sprint", quantity: 2, price: 650 }
      ],
      90,
      0,
      "paid",
      new Date("2026-03-05")
    ),
    buildInvoice(
      customers[0]._id,
      [
        { name: "Analytics Dashboard", quantity: 1, price: 1800 },
        { name: "Reporting Integration", quantity: 1, price: 1100 }
      ],
      175,
      100,
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
