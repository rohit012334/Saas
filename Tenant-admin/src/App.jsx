import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TenantLayout from '@/components/layout/TenantLayout';
import { useAuthStore } from '@/store/useAuthStore';

// Lazy load pages
const LoginPage = React.lazy(() => import('@/pages/auth/LoginPage'));
const Dashboard = React.lazy(() => import('@/pages/tenant/Dashboard'));

// Repair Orders
const RepairOrderList = React.lazy(() => import('@/pages/tenant/repair-orders/RepairOrderList'));
const CreateJobCard = React.lazy(() => import('@/pages/tenant/repair-orders/CreateJobCard'));
const RepairOrderDetail = React.lazy(() => import('@/pages/tenant/repair-orders/RepairOrderDetail'));

// Diagnostics
const DiagnosticsList = React.lazy(() => import('@/pages/tenant/diagnostics/DiagnosticsList'));
const DiagnosticDetail = React.lazy(() => import('@/pages/tenant/diagnostics/DiagnosticDetail'));

// Inventory
const InventoryList = React.lazy(() => import('@/pages/tenant/inventory/InventoryList'));
const PurchaseOrders = React.lazy(() => import('@/pages/tenant/inventory/PurchaseOrders'));
const Suppliers = React.lazy(() => import('@/pages/tenant/inventory/Suppliers'));

// Parts Sourcing
const PartsSourcing = React.lazy(() => import('@/pages/tenant/parts-sourcing/PartsSourcing'));

// Fleet
const FleetList = React.lazy(() => import('@/pages/tenant/fleet/FleetList'));
const FleetDetail = React.lazy(() => import('@/pages/tenant/fleet/FleetDetail'));
const MaintenanceSchedule = React.lazy(() => import('@/pages/tenant/fleet/MaintenanceSchedule'));

// HR
const EmployeeList = React.lazy(() => import('@/pages/tenant/hr/EmployeeList'));
const EmployeeDetail = React.lazy(() => import('@/pages/tenant/hr/EmployeeDetail'));
const Attendance = React.lazy(() => import('@/pages/tenant/hr/Attendance'));
const ShiftSchedule = React.lazy(() => import('@/pages/tenant/hr/ShiftSchedule'));

// Customers
const CustomerList = React.lazy(() => import('@/pages/tenant/customers/CustomerList'));
const CustomerDetail = React.lazy(() => import('@/pages/tenant/customers/CustomerDetail'));
const Campaigns = React.lazy(() => import('@/pages/tenant/customers/Campaigns'));

// Billing
// const InvoiceList = React.lazy(() => import('@/pages/tenant/billing/InvoiceList'));
// const CreateInvoice = React.lazy(() => import('@/pages/tenant/billing/CreateInvoice'));
// const Expenses = React.lazy(() => import('@/pages/tenant/billing/Expenses'));

// Reports & Settings
const Reports = React.lazy(() => import('@/pages/tenant/reports/Reports'));
const Settings = React.lazy(() => import('@/pages/tenant/settings/Settings'));

// Services
const Services = React.lazy(() => import('@/pages/tenant/services/Services'));

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.dir();
    document.documentElement.lang = i18n.language;
    document.documentElement.classList.add('dark'); // Force dark mode
  }, [i18n.language]);

  return (
    <BrowserRouter>
      <React.Suspense fallback={<div className="h-screen w-screen bg-background flex items-center justify-center text-primary font-bold">GMS Loading...</div>}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route path="/" element={
            <ProtectedRoute>
              <TenantLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />

            {/* Repair Orders */}

            <Route path="repair-orders">
              <Route index element={<RepairOrderList />} />
              <Route path="create" element={<CreateJobCard />} />
              <Route path=":id" element={<RepairOrderDetail />} />
            </Route>

            {/* Diagnostics */}

            <Route path="diagnostics">
              <Route index element={<DiagnosticsList />} />
              <Route path=":id" element={<DiagnosticDetail />} />
            </Route>

            {/* Inventory */}

            <Route path="inventory">
              <Route index element={<InventoryList />} />
              <Route path="purchase-orders" element={<PurchaseOrders />} />
              <Route path="suppliers" element={<Suppliers />} />
            </Route>

            {/* Parts Sourcing */}

            <Route path="parts-sourcing" element={<PartsSourcing />} />

            {/* Fleet Management */}

            <Route path="fleet">
              <Route index element={<FleetList />} />
              <Route path=":id" element={<FleetDetail />} />
              <Route path="maintenance" element={<MaintenanceSchedule />} />
            </Route>

            {/* HR Management */}

            <Route path="hr">
              <Route index element={<EmployeeList />} />
              <Route path="employees/:id" element={<EmployeeDetail />} />
            </Route>

            {/* Customers */}

            <Route path="customers">
              <Route index element={<CustomerList />} />
              <Route path=":id" element={<CustomerDetail />} />
              <Route path="campaigns" element={<Campaigns />} />
            </Route>

            {/* Billing */}

            {/* <Route path="billing">
              <Route path="invoices">
                <Route index element={<InvoiceList />} />
                <Route path="create" element={<CreateInvoice />} />
              </Route>
              <Route path="expenses" element={<Expenses />} />
            </Route> */}

            {/* Reports */}

            <Route path="reports" element={<Reports />} />

            {/* Services */}
            <Route path="services" element={<Services />} />

            {/* Settings */}
            <Route path="settings" element={<Settings />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
};

export default App;
