import Customer from "../models/Customer.js";
import Invoice from "../models/Invoice.js";
import asyncHandler from "../utils/asyncHandler.js";

const buildSearchFilter = (search) => {
  if (!search) {
    return {};
  }

  const regex = new RegExp(search, "i");

  return {
    $or: [{ name: regex }, { email: regex }, { phone: regex }, { address: regex }]
  };
};

export const createCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.create(req.body);
  res.status(201).json(customer);
});

export const getCustomers = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 8, 1), 50);
  const search = String(req.query.search || "").trim();
  const filter = buildSearchFilter(search);

  const [customers, totalItems] = await Promise.all([
    Customer.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Customer.countDocuments(filter)
  ]);

  res.json({
    items: customers,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.max(Math.ceil(totalItems / limit), 1)
    }
  });
});

export const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!customer) {
    res.status(404);
    throw new Error("Customer not found");
  }

  res.json(customer);
});

export const deleteCustomer = asyncHandler(async (req, res) => {
  const invoiceExists = await Invoice.exists({ customerId: req.params.id });

  if (invoiceExists) {
    res.status(400);
    throw new Error("Cannot delete a customer linked to existing invoices");
  }

  const customer = await Customer.findByIdAndDelete(req.params.id);

  if (!customer) {
    res.status(404);
    throw new Error("Customer not found");
  }

  res.json({ message: "Customer deleted successfully" });
});

