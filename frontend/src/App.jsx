import { Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";
import CustomersPage from "./pages/CustomersPage";
import DashboardPage from "./pages/DashboardPage";
import InvoiceDetailsPage from "./pages/InvoiceDetailsPage";
import InvoiceFormPage from "./pages/InvoiceFormPage";
import InvoicesPage from "./pages/InvoicesPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/invoices" element={<InvoicesPage />} />
        <Route path="/invoices/new" element={<InvoiceFormPage />} />
        <Route path="/invoices/:id" element={<InvoiceDetailsPage />} />
        <Route path="/invoices/:id/edit" element={<InvoiceFormPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
