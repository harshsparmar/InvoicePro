import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import { formatCurrency, formatDate, shortId } from "./formatters";

export const exportInvoicePdf = (invoice, companyProfile) => {
  const doc = new jsPDF();
  const customer = invoice.customerId || {};
  const startY = 46;

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text(companyProfile.name, 14, 22);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text(companyProfile.address, 14, 30);
  doc.text(`${companyProfile.email}  |  ${companyProfile.phone}`, 14, 36);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(15, 118, 110);
  doc.text("Invoice", 196, 22, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text(`Ref: #${shortId(invoice._id)}`, 196, 30, { align: "right" });
  doc.text(`Date: ${formatDate(invoice.date)}`, 196, 36, { align: "right" });
  doc.text(
    `Status: ${String(invoice.status || "pending").replace(/^./, (match) => match.toUpperCase())}`,
    196,
    42,
    { align: "right" }
  );

  doc.setDrawColor(226, 232, 240);
  doc.line(14, 50, 196, 50);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("Bill To", 14, startY);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(customer.name || "Customer", 14, startY + 7);
  doc.text(customer.email || "-", 14, startY + 13);
  doc.text(customer.phone || "-", 14, startY + 19);
  doc.text(customer.address || "-", 14, startY + 25, { maxWidth: 80 });

  autoTable(doc, {
    startY: 82,
    head: [["Item", "Qty", "Price", "Amount"]],
    body: invoice.items.map((item) => [
      item.name,
      item.quantity,
      formatCurrency(item.price),
      formatCurrency(item.quantity * item.price)
    ]),
    theme: "grid",
    headStyles: {
      fillColor: [15, 118, 110],
      textColor: [255, 255, 255],
      fontStyle: "bold"
    },
    bodyStyles: {
      textColor: [30, 41, 59]
    },
    styles: {
      lineColor: [226, 232, 240],
      lineWidth: 0.2,
      cellPadding: 4,
      fontSize: 10
    }
  });

  const summaryY = doc.lastAutoTable.finalY + 12;
  const summaryX = 126;

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(summaryX, summaryY, 70, 36, 4, 4, "F");

  doc.setTextColor(71, 85, 105);
  doc.setFontSize(10);
  doc.text("Subtotal", summaryX + 6, summaryY + 10);
  doc.text("Tax", summaryX + 6, summaryY + 18);
  doc.text("Discount", summaryX + 6, summaryY + 26);
  doc.text(formatCurrency(invoice.subtotal), summaryX + 64, summaryY + 10, { align: "right" });
  doc.text(formatCurrency(invoice.tax), summaryX + 64, summaryY + 18, { align: "right" });
  doc.text(formatCurrency(invoice.discount), summaryX + 64, summaryY + 26, {
    align: "right"
  });

  doc.setDrawColor(203, 213, 225);
  doc.line(summaryX + 6, summaryY + 29, summaryX + 64, summaryY + 29);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("Total", summaryX + 6, summaryY + 35);
  doc.text(formatCurrency(invoice.total), summaryX + 64, summaryY + 35, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text("Thank you for your business.", 14, 276);

  doc.save(`invoice-${shortId(invoice._id).toLowerCase()}.pdf`);
};
