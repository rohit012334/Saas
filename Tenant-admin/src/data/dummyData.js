export const garageInfo = {
  name: "Sharma Motors",
  owner: "Rajesh Sharma",
  plan: "Pro",
  city: "Delhi",
  phone: "+91 98765 43210",
  gstNo: "07AABCS1429B1ZB",
};

export const employees = [
  { id: 'emp1', name: 'Rajesh Sharma', role: 'Tenant Admin', skills: ['Management'], phone: '+91 98765 43210', joinDate: '2026-01-01', status: 'Active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh' },
  { id: 'emp2', name: 'Amit Kumar', role: 'Manager', skills: ['Operations'], phone: '+91 98765 43211', joinDate: '2026-02-15', status: 'Active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit' },
  { id: 'emp3', name: 'Suresh Raina', role: 'Mechanic', skills: ['Engine', 'Electrical'], phone: '+91 98765 43212', joinDate: '2026-03-12', status: 'Active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Suresh' },
  { id: 'emp4', name: 'Priya Singh', role: 'Receptionist', skills: ['Customer Service'], phone: '+91 98765 43213', joinDate: '2026-04-01', status: 'Active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya' },
  { id: 'emp5', name: 'Vikram Rathore', role: 'Mechanic', skills: ['Suspension', 'Brakes'], phone: '+91 98765 43214', joinDate: '2026-03-11', status: 'Active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram' },
  { id: 'emp6', name: 'Anjali Gupta', role: 'Manager', skills: ['HR', 'Accounts'], phone: '+91 98765 43215', joinDate: '2026-06-20', status: 'Active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali' },
  { id: 'emp7', name: 'Manish Pandey', role: 'Mechanic', skills: ['Body Work'], phone: '+91 98765 43216', joinDate: '2026-03-05', status: 'Active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Manish' },
  { id: 'emp8', name: 'Kushal Jha', role: 'Mechanic', skills: ['Scanning'], phone: '+91 98765 43217', joinDate: '2026-03-01', status: 'Active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kushal' },
];

export const repairOrders = [
  {
    id: 'ro1',
    jobNo: 'JOB-1001',
    vehicleNo: 'DL 1CA 1234',
    make: 'Honda',
    model: 'City',
    year: '2021',
    customerName: 'Rahul Verma',
    customerPhone: '+91 99999 88888',
    complaint: 'Engine noise and oil leak',
    serviceType: 'General Service',
    mechanicId: 'emp3',
    status: 'In Progress',
    priority: 'Urgent',
    estimatedCost: 15000,
    createdAt: '2026-03-12T10:00:00Z',
    parts: [
      { id: 'p1', name: 'Engine Oil', qty: 4, unitPrice: 800, total: 3200 },
      { id: 'p2', name: 'Oil Filter', qty: 1, unitPrice: 450, total: 450 },
    ],
    labour: [
      { id: 'l1', description: 'Engine Inspection', hours: 2, rate: 500, total: 1000 },
    ],
  },
  {
    id: 'ro2',
    jobNo: 'JOB-1002',
    vehicleNo: 'UP 16 AB 5678',
    make: 'Hyundai',
    model: 'Creta',
    year: '2022',
    customerName: 'Sandeep Tiwari',
    customerPhone: '+91 98888 77777',
    complaint: 'Brake squealing',
    serviceType: 'Brake Service',
    mechanicId: 'emp5',
    status: 'Completed',
    priority: 'Normal',
    estimatedCost: 8500,
    createdAt: '2026-03-12T09:00:00Z',
    parts: [
      { id: 'p3', name: 'Brake Pads', qty: 2, unitPrice: 2500, total: 5000 },
    ],
    labour: [
      { id: 'l2', description: 'Brake Replacement', hours: 1.5, rate: 600, total: 900 },
    ],
  },
  {
    id: 'ro3',
    jobNo: 'JOB-1003',
    vehicleNo: 'HR 26 DQ 9999',
    make: 'Maruti Suzuki',
    model: 'Swift',
    year: '2019',
    customerName: 'Karan Mehra',
    customerPhone: '+91 97777 66666',
    complaint: 'AC not cooling',
    serviceType: 'AC Service',
    mechanicId: 'emp3',
    status: 'Inspection',
    priority: 'High',
    estimatedCost: 4500,
    createdAt: '2026-03-11T14:30:00Z',
    parts: [],
    labour: [],
  },
  {
    id: 'ro4',
    jobNo: 'JOB-1004',
    vehicleNo: 'MH 01 AX 4321',
    make: 'Toyota',
    model: 'Fortuner',
    year: '2023',
    customerName: 'Suresh Kumar',
    customerPhone: '+91 96666 55555',
    complaint: 'Periodic Maintenance',
    serviceType: 'Full Service',
    mechanicId: 'emp3',
    status: 'Awaiting Approval',
    priority: 'Urgent',
    estimatedCost: 25000,
    createdAt: '2026-03-05T11:00:00Z',
    parts: [],
    labour: [],
  },
  {
    id: 'ro5',
    jobNo: 'JOB-1005',
    vehicleNo: 'KA 05 MN 1111',
    make: 'Tata',
    model: 'Nexon',
    year: '2022',
    customerName: 'Deepak Rao',
    customerPhone: '+91 95555 44444',
    complaint: 'Clutch hard',
    serviceType: 'Clutch Repair',
    mechanicId: 'emp5',
    status: 'Ready for Delivery',
    priority: 'Normal',
    estimatedCost: 12000,
    createdAt: '2026-03-10T16:00:00Z',
    parts: [],
    labour: [],
  },
  {
    id: 'ro6',
    jobNo: 'JOB-1006',
    vehicleNo: 'DL 8C 1234',
    make: 'Mahindra',
    model: 'XUV700',
    year: '2023',
    customerName: 'Vikash Singh',
    customerPhone: '+91 94444 33333',
    complaint: 'Sunroof not closing',
    serviceType: 'Body Work',
    mechanicId: 'emp7',
    status: 'Inspection',
    priority: 'High',
    estimatedCost: 45000,
    createdAt: '2026-03-12T12:00:00Z',
    parts: [],
    labour: [],
  }
];

export const diagnostics = [
  {
    id: 'diag1',
    scanNo: 'SCAN-5001',
    vehicleNo: 'DL 1CA 1234',
    customerName: 'Rahul Verma',
    faultCodes: [
      { code: 'P0300', system: 'Engine', description: 'Random or Multiple Cylinder Misfire Detected', severity: 'Critical', status: 'Active' },
      { code: 'P0171', system: 'Fuel System', description: 'System Too Lean (Bank 1)', severity: 'Warning', status: 'Pending' },
    ],
    severity: 'Critical',
    mechanicId: 'emp3',
    date: '2026-03-12',
    notes: 'Needs immediate attention to spark plugs and ignition coils.',
    recommendations: [
      { recommendation: 'Replace Spark Plugs', priority: 'High', estCost: 2500 },
      { recommendation: 'Check Fuel Injectors', priority: 'Medium', estCost: 1500 },
    ],
  },
  {
    id: 'diag2',
    scanNo: 'SCAN-5002',
    vehicleNo: 'UP 16 AB 5678',
    customerName: 'Sandeep Tiwari',
    faultCodes: [
      { code: 'C1223', system: 'ABS', description: 'ABS Control System Malfunction', severity: 'High', status: 'Active' },
    ],
    severity: 'High',
    mechanicId: 'emp5',
    date: '2026-03-12',
    notes: 'ABS light is on. Sensor needs cleaning or replacement.',
    recommendations: [
      { recommendation: 'Clean ABS Sensors', priority: 'High', estCost: 800 },
    ],
  },
  {
    id: 'diag3',
    scanNo: 'SCAN-5003',
    vehicleNo: 'HR 26 DQ 9999',
    customerName: 'Karan Mehra',
    faultCodes: [
      { code: 'B1001', system: 'Airbag', description: 'Airbag Configuration Error', severity: 'Critical', status: 'Active' },
    ],
    severity: 'Critical',
    mechanicId: 'emp8',
    date: '2026-03-11',
    notes: 'SRS Airbag light fixed after clock spring replacement.',
    recommendations: [
      { recommendation: 'Replace Clock Spring', priority: 'High', estCost: 3500 },
    ],
  }
];

export const parts = [
  { id: 'p1', name: 'Engine Oil 5W-30', sku: 'OIL-001', category: 'Lubricants', stock: 45, minStock: 10, unitPrice: 800, supplierId: 's1', location: 'A-1-1', barcode: '123456789', status: 'In Stock' },
  { id: 'p2', name: 'Oil Filter', sku: 'FLT-001', category: 'Filters', stock: 5, minStock: 10, unitPrice: 450, supplierId: 's2', location: 'B-2-1', barcode: '987654321', status: 'Low Stock' },
  { id: 'p3', name: 'Brake Pads', sku: 'BRK-001', category: 'Brakes', stock: 20, minStock: 5, unitPrice: 2500, supplierId: 's3', location: 'C-3-1', barcode: '555666777', status: 'In Stock' },
];

export const customers = [
  { 
    id: 'c1', 
    name: 'Rahul Verma', 
    phone: '+91 99999 88888', 
    email: 'rahul@example.com', 
    vehicles: [
      { plate: 'DL 1CA 1234', make: 'Honda', model: 'City', variant: 'VX (O)', year: '2021', fuel: 'Petrol', color: 'White', vin: 'MA3E7S**************', engine: 'L15Z1*******' }
    ], 
    lastVisit: '2026-03-12', 
    serviceCount: 12,
    totalSpent: 45000, 
    loyaltyPoints: 450, 
    memberSince: '2026-01-15' 
  },
  { 
    id: 'c2', 
    name: 'Sandeep Tiwari', 
    phone: '+91 98888 77777', 
    email: 'sandeep@example.com', 
    vehicles: [
      { plate: 'UP 16 AB 5678', make: 'Hyundai', model: 'Creta', variant: 'SX', year: '2022', fuel: 'Diesel', color: 'Silver', vin: 'MALA*********', engine: 'D4FA********' }
    ], 
    lastVisit: '2026-03-12', 
    serviceCount: 8,
    totalSpent: 32000, 
    loyaltyPoints: 320, 
    memberSince: '2026-02-10' 
  },
  { 
    id: 'c3', 
    name: 'Karan Mehra', 
    phone: '+91 97777 66666', 
    email: 'karan@example.com', 
    vehicles: [
      { plate: 'HR 26 DQ 9999', make: 'Maruti Suzuki', model: 'Swift', variant: 'ZXI', year: '2019', fuel: 'Petrol', color: 'Red', vin: 'MA3EB*********', engine: 'K12M*********' }
    ], 
    lastVisit: '2026-03-11', 
    serviceCount: 5,
    totalSpent: 15000, 
    loyaltyPoints: 150, 
    memberSince: '2023-11-20' 
  },
];

export const invoices = [
  { id: 'inv1', invoiceNo: 'INV-2001', customer: 'Rahul Verma', vehicle: 'DL 1CA 1234', amount: 12000, gst: 2160, total: 14160, date: '2026-03-12', dueDate: '2024-03-15', status: 'Paid', paymentMethod: 'UPI' },
  { id: 'inv2', invoiceNo: 'INV-2002', customer: 'Sandeep Tiwari', vehicle: 'UP 16 AB 5678', amount: 8500, gst: 1530, total: 10030, date: '2026-03-11', dueDate: '2024-03-16', status: 'Paid', paymentMethod: 'Cash' },
];

export const revenueChartData = [
  { date: '2026-03-01', revenue: 15000 },
  { date: '2026-03-02', revenue: 18000 },
  { date: '2026-03-03', revenue: 12000 },
  // ...
];

export const jobsChartData = [
  { status: 'In Progress', count: 12 },
  { status: 'Completed', count: 25 },
  { status: 'Waiting', count: 5 },
  { status: 'Pending Approval', count: 8 },
];
