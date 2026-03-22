import Invoice from "../models/Invoice.js";
import asyncHandler from "../utils/asyncHandler.js";

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric"
});

export const getDashboardStats = asyncHandler(async (req, res) => {
  const now = new Date();
  const startOfWindow = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [
    paidRevenueResult,
    totalInvoices,
    paidInvoices,
    pendingInvoices,
    recentInvoices,
    revenueByMonth
  ] = await Promise.all([
    Invoice.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: null, totalRevenue: { $sum: "$total" } } }
    ]),
    Invoice.countDocuments(),
    Invoice.countDocuments({ status: "paid" }),
    Invoice.countDocuments({ status: "pending" }),
    Invoice.find()
      .populate("customerId", "name email")
      .sort({ date: -1, createdAt: -1 })
      .limit(5),
    Invoice.aggregate([
      {
        $match: {
          status: "paid",
          date: { $gte: startOfWindow }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          revenue: { $sum: "$total" },
          invoices: { $sum: 1 }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      }
    ])
  ]);

  const monthlyRevenue = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    const match = revenueByMonth.find(
      (entry) => entry._id.year === date.getFullYear() && entry._id.month === date.getMonth() + 1
    );

    return {
      label: monthFormatter.format(date),
      revenue: match ? Number(match.revenue.toFixed(2)) : 0,
      invoices: match?.invoices || 0
    };
  });

  res.json({
    stats: {
      totalRevenue: Number((paidRevenueResult[0]?.totalRevenue || 0).toFixed(2)),
      totalInvoices,
      paidInvoices,
      pendingInvoices
    },
    statusDistribution: [
      { name: "Paid", value: paidInvoices },
      { name: "Pending", value: pendingInvoices }
    ],
    monthlyRevenue,
    recentInvoices
  });
});

