import Customer from "../models/Customer.js";
import Invoice from "../models/Invoice.js";
import asyncHandler from "../utils/asyncHandler.js";
import calculateInvoiceTotals from "../utils/calculateInvoiceTotals.js";

const buildInvoiceFilter = async ({ search, status, customerId }) => {
  const filter = {};

  if (status && ["paid", "pending"].includes(status)) {
    filter.status = status;
  }

  if (customerId) {
    filter.customerId = customerId;
  }

  if (search) {
    const regex = new RegExp(search, "i");
    const customers = await Customer.find({
      $or: [{ name: regex }, { email: regex }, { phone: regex }]
    }).select("_id");

    const customerIds = customers.map((customer) => customer._id);
    const searchClauses = [{ "items.name": regex }];

    if (customerIds.length > 0) {
      searchClauses.push({ customerId: { $in: customerIds } });
    }

    filter.$or = searchClauses;
  }

  return filter;
};

export const createInvoice = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.body.customerId);

  if (!customer) {
    res.status(404);
    throw new Error("Selected customer was not found");
  }

  const totals = calculateInvoiceTotals(req.body);

  const invoice = await Invoice.create({
    customerId: req.body.customerId,
    items: totals.items,
    subtotal: totals.subtotal,
    tax: totals.tax,
    discount: totals.discount,
    total: totals.total,
    status: req.body.status || "pending",
    date: req.body.date || new Date()
  });

  const populatedInvoice = await invoice.populate("customerId", "name email phone address");

  res.status(201).json(populatedInvoice);
});

export const getInvoices = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 8, 1), 50);
  const search = String(req.query.search || "").trim();
  const status = String(req.query.status || "").trim();
  const customerId = String(req.query.customerId || "").trim();
  const filter = await buildInvoiceFilter({ search, status, customerId });

  const [invoices, totalItems] = await Promise.all([
    Invoice.find(filter)
      .populate("customerId", "name email phone address")
      .sort({ date: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Invoice.countDocuments(filter)
  ]);

  res.json({
    items: invoices,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.max(Math.ceil(totalItems / limit), 1)
    }
  });
});

export const getInvoiceById = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id).populate(
    "customerId",
    "name email phone address"
  );

  if (!invoice) {
    res.status(404);
    throw new Error("Invoice not found");
  }

  res.json(invoice);
});

export const updateInvoice = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.body.customerId);

  if (!customer) {
    res.status(404);
    throw new Error("Selected customer was not found");
  }

  const existingInvoice = await Invoice.findById(req.params.id);

  if (!existingInvoice) {
    res.status(404);
    throw new Error("Invoice not found");
  }

  const totals = calculateInvoiceTotals(req.body);

  existingInvoice.customerId = req.body.customerId;
  existingInvoice.items = totals.items;
  existingInvoice.subtotal = totals.subtotal;
  existingInvoice.tax = totals.tax;
  existingInvoice.discount = totals.discount;
  existingInvoice.total = totals.total;
  existingInvoice.status = req.body.status || existingInvoice.status;
  existingInvoice.date = req.body.date || existingInvoice.date;

  await existingInvoice.save();
  await existingInvoice.populate("customerId", "name email phone address");

  res.json(existingInvoice);
});

export const deleteInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findByIdAndDelete(req.params.id);

  if (!invoice) {
    res.status(404);
    throw new Error("Invoice not found");
  }

  res.json({ message: "Invoice deleted successfully" });
});
