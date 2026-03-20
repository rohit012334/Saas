// Dummy data for GMS Super Admin — no API calls

const cities = ['Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Pune', 'Chennai', 'Dubai', 'Abu Dhabi', 'Riyadh', 'Jeddah', 'Doha', 'Cairo']
const countries = { Delhi: 'India', Mumbai: 'India', Bengaluru: 'India', Hyderabad: 'India', Pune: 'India', Chennai: 'India', Dubai: 'UAE', 'Abu Dhabi': 'UAE', Riyadh: 'Saudi Arabia', Jeddah: 'Saudi Arabia', Doha: 'Qatar', Cairo: 'Egypt' }
const garageNames = ['Al Noor Auto', 'Premier Motors', 'SpeedX Garage', 'Royal Car Care', 'Desert Wheels', 'Metro Auto Hub', 'Crescent Service', 'King Motors', 'Falcon Garage', 'Elite Auto', 'Gulf Car Care', 'Nile Workshop']
const ownerFirst = ['Ahmed', 'Rashid', 'Vikram', 'Sanjay', 'Fatima', 'Khalid', 'Priya', 'Omar', 'Imran', 'Aisha']
const ownerLast = ['Khan', 'Patel', 'Al-Saud', 'Verma', 'Abdullah', 'Hussain', 'Singh', 'Sharma', 'El-Sayed', 'Nair']
const plans = ['Basic', 'Pro', 'Enterprise', 'Trial']
const statuses = ['Active', 'Suspended', 'Trial', 'Pending Approval']

export const tenants = Array.from({ length: 50 }, (_, i) => {
  const city = cities[i % cities.length]
  const plan = plans[i % 4]
  const status = statuses[i % 4]
  const mrr = plan === 'Enterprise' ? 7999 + i * 100 : plan === 'Pro' ? 2999 + i * 50 : plan === 'Basic' ? 999 : 0
  return {
    id: `TNT-${String(i + 1).padStart(4, '0')}`,
    name: `${garageNames[i % garageNames.length]} ${city}`,
    ownerName: `${ownerFirst[i % 10]} ${ownerLast[i % 10]}`,
    email: `contact@tenant${i + 1}.gms`,
    phone: `+91-98${String(1000000 + i).slice(0, 7)}`,
    city,
    country: countries[city],
    plan,
    status,
    mrr,
    staffCount: 2 + (i % 20),
    jobsThisMonth: 50 + (i % 200),
    vehiclesRegistered: 100 + (i % 500),
    joinedDate: `2023-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
    address: `${i + 1} Main Road, ${city}`,
    logo: null,
  }
})

export const subscriptionPlans = [
  { id: 'basic', name: 'Basic', monthlyPrice: 999, yearlyPrice: 9990, savePercent: 17, features: ['2 staff', '100 jobs/month', 'Basic inventory', 'Email support'], excluded: ['WhatsApp', 'Fleet', 'Diagnostics'], subscribers: 1240 },
  { id: 'pro', name: 'Pro', monthlyPrice: 2999, yearlyPrice: 29990, savePercent: 17, features: ['10 staff', 'Unlimited jobs', 'Full inventory', 'WhatsApp', 'Fleet (50)', 'Priority support'], excluded: ['Custom branding', 'Diagnostics API'], subscribers: 892 },
  { id: 'enterprise', name: 'Enterprise', monthlyPrice: 7999, yearlyPrice: null, savePercent: null, features: ['Unlimited users', 'All modules', 'Diagnostics API', 'Custom branding', 'Dedicated manager', 'SLA 99.9%', 'API access'], excluded: [], subscribers: 209 },
]

// Admin subscription plans for Garage Workshop SaaS (full CRUD)
// 2 Wheeler / 4 Wheeler / Both — Monthly & Yearly alag plans, garage workshop data
export const subscriptionPlansAdmin = [
  {
    id: 'plan-mc-m',
    planName: 'Starter Moto',
    vehicleType: 'Motorcycles',
    duration: 'Monthly',
    price: 499,
    maxJobsPerMonth: 50,
    maxVehicles: 20,
    maxMechanics: 1,
    features: ['Job cards for Motorcycles', 'Up to 50 jobs/month', '20 vehicles', '1 mechanic', 'Email support'],
    inventoryEnabled: false,
    reportsEnabled: false,
    multiBranchEnabled: false,
    status: 'Active',
  },
  {
    id: 'plan-car-m',
    planName: 'Car Basic',
    vehicleType: 'Car',
    duration: 'Monthly',
    price: 1499,
    maxJobsPerMonth: 100,
    maxVehicles: 50,
    maxMechanics: 3,
    features: ['Job cards for Cars', '100 jobs/month', '50 vehicles', '3 mechanics', 'Standard reports'],
    inventoryEnabled: true,
    reportsEnabled: true,
    multiBranchEnabled: false,
    status: 'Active',
  },
  {
    id: 'plan-car-q',
    planName: 'Car Pro (3 Mo)',
    vehicleType: 'Car',
    duration: '3 Months',
    price: 3999,
    maxJobsPerMonth: 300,
    maxVehicles: 150,
    maxMechanics: 8,
    features: ['Priority support', '300 jobs/3 months', 'Full inventory control', 'WhatsApp integration'],
    inventoryEnabled: true,
    reportsEnabled: true,
    multiBranchEnabled: true,
    status: 'Active',
  },
  {
    id: 'plan-truck-m',
    planName: 'Fleet Truck',
    vehicleType: 'Truck',
    duration: 'Monthly',
    price: 4499,
    maxJobsPerMonth: 500,
    maxVehicles: 200,
    maxMechanics: 15,
    features: ['Heavy vehicle workflows', 'Fleet management', 'Advanced analytics', 'Multi-branch support'],
    inventoryEnabled: true,
    reportsEnabled: true,
    multiBranchEnabled: true,
    status: 'Active',
  },
  {
    id: 'plan-bus-y',
    planName: 'Enterprise Bus',
    vehicleType: 'Bus',
    duration: 'Yearly',
    price: 49990,
    maxJobsPerMonth: 2000,
    maxVehicles: 1000,
    maxMechanics: 50,
    features: ['Custom workflows', 'High volume jobs', 'Dedicated account manager', 'SLA 99.9%'],
    inventoryEnabled: true,
    reportsEnabled: true,
    multiBranchEnabled: true,
    status: 'Active',
  },
  {
    id: 'plan-he-q',
    planName: 'Heavy Equip (3 Mo)',
    vehicleType: 'Heavy Equipments',
    duration: '3 Months',
    price: 8999,
    maxJobsPerMonth: 1000,
    maxVehicles: 500,
    maxMechanics: 25,
    features: ['Specialized equipment tracking', 'Preventive maintenance', 'API access', 'Custom exports'],
    inventoryEnabled: true,
    reportsEnabled: true,
    multiBranchEnabled: true,
    status: 'Active',
  },
]

export const paymentHistory = Array.from({ length: 100 }, (_, i) => {
  const t = tenants[i % tenants.length]
  const plan = subscriptionPlans.find((p) => p.name === t.plan) || subscriptionPlans[0]
  const statuses = ['Paid', 'Paid', 'Paid', 'Failed', 'Refunded']
  return {
    id: `INV-${2025000 + i}`,
    invoice: `INV-${2025000 + i}`,
    tenantName: t.name,
    plan: plan.name,
    amount: plan.monthlyPrice,
    date: `2025-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
    method: ['UPI', 'Card', 'NetBanking', 'Razorpay'][i % 4],
    status: statuses[i % 5],
  }
})

// User subscriptions: kis user ne konsa plan buy kiya, kab buy kiya, kab expiry, status Active/Expired
function addMonths(d, months) {
  const out = new Date(d)
  out.setMonth(out.getMonth() + months)
  return out
}
function addYears(d, years) {
  const out = new Date(d)
  out.setFullYear(out.getFullYear() + years)
  return out
}
const today = new Date('2026-03-12')
export const userSubscriptions = (() => {
  const list = []
  const planIds = subscriptionPlansAdmin.map((p) => p.id)
  tenants.slice(0, 40).forEach((tenant, i) => {
    const plan = subscriptionPlansAdmin[i % subscriptionPlansAdmin.length]
    const purchaseDate = new Date(`2025-${String((i % 12) + 1).padStart(2, '0')}-15`)
    const expiryDate = plan.duration === 'Yearly'
      ? addYears(purchaseDate, 1)
      : plan.duration === '3 Months'
      ? addMonths(purchaseDate, 3)
      : addMonths(purchaseDate, 1)
    const isExpired = expiryDate < today
    const status = i % 11 === 0 ? 'Cancelled' : isExpired ? 'Expired' : 'Active'
    list.push({
      id: `SUB-${String(list.length + 1).padStart(4, '0')}`,
      userId: tenant.id,
      userName: tenant.name,
      userEmail: tenant.email,
      planId: plan.id,
      planName: plan.planName,
      vehicleType: plan.vehicleType,
      duration: plan.duration,
      purchaseDate: purchaseDate.toISOString().slice(0, 10),
      expiryDate: expiryDate.toISOString().slice(0, 10),
      status,
      price: plan.price,
    })
  })
  return list
})()

export const apiKeys = [
  { id: '1', serviceName: 'TecAlliance Parts API', category: 'Parts Catalog', key: 'TA12****9XZ1', fullKey: 'TA12abcd12349XZ1', status: 'Active', lastUsed: '5 mins ago' },
  { id: '2', serviceName: 'PartsTech API', category: 'Parts Catalog', key: 'PT45****7QW9', fullKey: 'PT45xyz7897QW9', status: 'Active', lastUsed: '18 mins ago' },
  { id: '3', serviceName: 'Google Maps API', category: 'Location', key: 'AIza****F3kL', fullKey: 'AIzaSyAbc123F3kL', status: 'Active', lastUsed: '2 mins ago' },
  { id: '4', serviceName: 'Twilio SMS', category: 'Messaging', key: 'TW89****1PL2', fullKey: 'TW89xyz1PL2', status: 'Active', lastUsed: '12 mins ago' },
  { id: '5', serviceName: 'MSG91 SMS', category: 'Messaging', key: 'MS91****3DK8', fullKey: 'MS91abc3DK8', status: 'Active', lastUsed: '25 mins ago' },
  { id: '6', serviceName: 'SendGrid Email', category: 'Email', key: 'SG55****2ZP7', fullKey: 'SG55xyz2ZP7', status: 'Active', lastUsed: '8 mins ago' },
  { id: '7', serviceName: 'Amazon SES', category: 'Email', key: 'AS88****9MN1', fullKey: 'AS88abc9MN1', status: 'Inactive', lastUsed: '2 days ago' },
  { id: '8', serviceName: 'Meta WhatsApp Business', category: 'WhatsApp', key: 'WA33****6TY4', fullKey: 'WA33def6TY4', status: 'Active', lastUsed: '1 min ago' },
  { id: '9', serviceName: 'AutoEnginuity OBD', category: 'Diagnostics', key: 'AE77****4BV3', fullKey: 'AE77ghi4BV3', status: 'Active', lastUsed: '40 mins ago' },
  { id: '10', serviceName: 'Firebase Auth', category: 'Authentication', key: 'FB66****8RE2', fullKey: 'FB66jkl8RE2', status: 'Active', lastUsed: '3 mins ago' },
  { id: '11', serviceName: 'Razorpay Platform', category: 'Payments', key: 'RZ11****5HG9', fullKey: 'RZ11mno5HG9', status: 'Active', lastUsed: 'Just now' },
  { id: '12', serviceName: 'AWS S3', category: 'Storage', key: 'S345****2LP6', fullKey: 'S345pqr2LP6', status: 'Active', lastUsed: '7 mins ago' },
]

export const adminUsers = [
  { id: 'ADM-001', name: 'Yassir Al-Mansoor', email: 'admin@yassir.com', role: 'Super Admin', status: 'Active', lastLogin: '2026-03-12 14:20', permissions: ['All Access'] },
  { id: 'ADM-002', name: 'Zaid Khan', email: 'zaid@yassir.com', role: 'Subscription Manager', status: 'Active', lastLogin: '2026-03-12 09:05', permissions: ['Subscriptions', 'Plans'] },
  { id: 'ADM-003', name: 'Sarah Ahmed', email: 'sarah@yassir.com', role: 'Support Specialist', status: 'Active', lastLogin: '2026-03-11 19:45', permissions: ['Support Tickets', 'CMS'] },
  { id: 'ADM-004', name: 'Rahul Gupta', email: 'rahul@yassir.com', role: 'Banner Admin', status: 'Active', lastLogin: '2026-03-12 11:30', permissions: ['Banners', 'Announcements'] },
  { id: 'ADM-005', name: 'Ayesha Malik', email: 'ayesha@yassir.com', role: 'Content Manager', status: 'Active', lastLogin: '2026-03-12 08:40', permissions: ['CMS', 'Banners'] },
  { id: 'ADM-006', name: 'Vikram Singh', email: 'vikram@yassir.com', role: 'Billing Admin', status: 'Active', lastLogin: '2026-03-12 20:10', permissions: ['Subscriptions', 'Billing'] },
  { id: 'ADM-007', name: 'Fatima Zahra', email: 'fatima@yassir.com', role: 'Account Executive', status: 'Active', lastLogin: '2026-03-12 23:02', permissions: ['Tenants', 'Support'] },
  { id: 'ADM-008', name: 'Arjun Mehta', email: 'arjun@yassir.com', role: 'Support Specialist', status: 'Inactive', lastLogin: '2026-02-15 10:11', permissions: ['Support Tickets'] },
]

const auditActions = ['TENANT_SUSPENDED', 'PLAN_UPDATED', 'API_KEY_ROTATED', 'ADMIN_LOGIN', 'ADMIN_CREATED', 'TENANT_DELETED', 'ANNOUNCEMENT_SENT', 'SETTINGS_CHANGED']

export const auditLogs = Array.from({ length: 200 }, (_, i) => ({
  id: `LOG-${String(i + 1).padStart(4, '0')}`,
  timestamp: `2026-03-${String((i % 9) + 1).padStart(2, '0')} ${String(10 + (i % 10)).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}`,
  adminUser: adminUsers[i % adminUsers.length].name,
  action: auditActions[i % auditActions.length],
  target: tenants[i % tenants.length].name,
  ipAddress: `192.168.${i % 255}.${(i * 3) % 255}`,
  location: `${cities[i % cities.length]}, ${countries[cities[i % cities.length]]}`,
  status: i % 5 === 0 ? 'Failed' : 'Success',
}))

export const announcements = Array.from({ length: 15 }, (_, i) => ({
  id: `ANN-${String(i + 1).padStart(3, '0')}`,
  title: `Platform update ${i + 1}`,
  message: 'We are rolling out new improvements to the GMS platform.',
  sentDate: `2026-02-${String((i % 20) + 1).padStart(2, '0')}`,
  target: ['All Tenants', 'Basic Plan Only', 'Pro Plan Only', 'Enterprise Only'][i % 4],
  channels: [['In-App', 'Email'], ['In-App'], ['Email'], ['In-App', 'Email', 'SMS']][i % 4],
  deliveredCount: 1000 + i * 37,
  readCount: 800 + i * 29,
  status: ['Sent', 'Scheduled', 'Draft'][i % 3],
}))

export const revenueChart = [
  { month: 'Jan', revenue: 5123400, target: 4800000 },
  { month: 'Feb', revenue: 5932100, target: 5200000 },
  { month: 'Mar', revenue: 6423400, target: 6000000 },
  { month: 'Apr', revenue: 7021500, target: 6500000 },
  { month: 'May', revenue: 7432100, target: 7000000 },
  { month: 'Jun', revenue: 8123400, target: 7600000 },
  { month: 'Jul', revenue: 8423400, target: 8000000 },
  { month: 'Aug', revenue: 7923400, target: 8200000 },
  { month: 'Sep', revenue: 8323400, target: 8400000 },
  { month: 'Oct', revenue: 8823400, target: 8800000 },
  { month: 'Nov', revenue: 8423400, target: 9000000 },
  { month: 'Dec', revenue: 9123400, target: 9400000 },
]

const categories = ['Parts', 'Messaging', 'Auth', 'Email', 'Payments']
export const apiUsageChart = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1
  const base = 20000 + i * 1500
  const entry = { day }
  categories.forEach((cat, ci) => { entry[cat] = base + ci * 3000 + (i % 5) * 700 })
  return entry
})

export const topTenants = [...tenants]
  .sort((a, b) => (b.mrr || 0) - (a.mrr || 0))
  .slice(0, 10)
  .map((t, i) => ({
    rank: i + 1,
    name: t.name,
    city: t.city,
    plan: t.plan,
    revenue: (t.mrr || 0) * 12,
    jobsPerMonth: t.jobsThisMonth,
    status: t.status,
  }))

// Dashboard stats (derived)
export const dashboardStats = {
  totalTenants: 2847,
  totalTenantsChange: 12,
  activeSubscriptions: 2341,
  activeSubscriptionsChange: 8,
  monthlyRevenue: 8423400,
  monthlyRevenueChange: 23,
  newSignupsWeek: 143,
  churnedThisMonth: 24,
  avgRevenuePerTenant: 2847,
  platformUptime: '99.97%',
  openSupportTickets: 18,
  apiCallsToday: 124892,
  apiCallsThisMonth: 3847201,
}

export const recentSignups = tenants.slice(0, 8)
