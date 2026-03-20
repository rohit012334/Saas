import React, { useState, useMemo } from 'react'
import { Search, Filter, User, Building2, Calendar, MoreVertical, Eye, Phone, Mail, MapPin, History, Car, Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../../components/shared/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '../../../components/shared/Badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '../../../components/shared/DataTable'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { tenants } from '../../../data/dummyData'

// Dummy Customers Data
// Initial data source - Customers ka dummy data
const customers = [
  {
    id: 'CUST-001',
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    phone: '+91-9876543210',
    garage: 'Al Noor Auto Delhi',
    joinedDate: '2024-02-15',
    serviceCount: 12,
    vehicles: [
      { plate: 'DL 1CA 1234', make: 'Honda', model: 'City', variant: 'VX (O)', year: '2021', fuel: 'Petrol', color: 'Black', vin: 'MA3E7S**************', engine: 'L15Z1*******' }
    ]
  },
  {
    id: 'CUST-002',
    name: 'Zaid Al-Farsi',
    email: 'zaid@example.com',
    phone: '+971-50-1234567',
    garage: 'Premier Motors Dubai',
    joinedDate: '2024-02-20',
    serviceCount: 8,
    vehicles: [
      { plate: 'DXB-5678', make: 'Toyota', model: 'Land Cruiser', variant: 'VXR', year: '2023', fuel: 'Petrol', color: 'Black', vin: 'JTEBU*********', engine: 'V35A*********' }
    ]
  },
  {
    id: 'CUST-003',
    name: 'Amit Patel',
    email: 'amit@example.com',
    phone: '+91-9988776655',
    garage: 'SpeedX Garage Mumbai',
    joinedDate: '2024-03-01',
    serviceCount: 5,
    vehicles: [
      { plate: 'MH 01 AX 9999', make: 'Mercedes-Benz', model: 'S-Class', variant: 'S450', year: '2022', fuel: 'Diesel', color: 'Silver', vin: 'W1K*********', engine: '656*********' }
    ]
  },
]

export function CustomerList() {
  const { t } = useTranslation('customers')
  const [search, setSearch] = useState('') // Search input state
  const [garageFilter, setGarageFilter] = useState('') // Garage base filter
  const [timeFilter, setTimeFilter] = useState('all') // Date base filter
  const [viewModal, setViewModal] = useState({ open: false, customer: null }) // Specific customer details dekhne ke liye modal ki state

  const filtered = useMemo(() => {
    return customers.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.id.toLowerCase().includes(search.toLowerCase());

      const matchesGarage = garageFilter === '' || c.garage === garageFilter;

      if (!matchesSearch || !matchesGarage) return false;

      if (timeFilter === 'all') return true;

      const joined = new Date(c.joinedDate);
      const now = new Date('2026-03-11');
      const diffDays = (now - joined) / (1000 * 60 * 60 * 24);

      if (timeFilter === 'today') return diffDays < 1 && joined.getDate() === now.getDate();
      if (timeFilter === 'yesterday') {
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        return joined.getDate() === yesterday.getDate() && joined.getMonth() === yesterday.getMonth();
      }
      if (timeFilter === 'week') return diffDays <= 7;

      return true;
    })
  }, [search, garageFilter, timeFilter]) // Search ya filters change hone par list update hogi

  const columns = [
    { id: 'index', header: '#', cell: ({ row }) => row.index + 1 },
    {
      id: 'name', header: t('table.customer'), accessorKey: 'name', cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{row.original.name}</span>
            <span className="text-xs text-muted-foreground">{row.original.email}</span>
          </div>
        </div>
      )
    },
    { id: 'phone', header: t('table.phone'), accessorKey: 'phone' },
    {
      id: 'garage', header: t('table.garage'), accessorKey: 'garage', cell: ({ getValue }) => (
        <div className="flex items-center gap-2">
          <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm">{getValue()}</span>
        </div>
      )
    },
    {
      id: 'joinedDate', header: t('table.joined'), accessorKey: 'joinedDate', cell: ({ getValue }) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm">{getValue()}</span>
        </div>
      )
    },
    {
      id: 'serviceCount', header: t('table.serviceCount'), accessorKey: 'serviceCount', cell: ({ getValue }) => (
        <div className="flex items-center gap-2">
          <History className="h-3.5 w-3.5 text-primary" />
          <span className="font-bold">{getValue()} {t('times')}</span>
        </div>
      )
    },
    {
      id: 'actions', header: t('table.actions'), cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="gap-2" onClick={() => setViewModal({ open: true, customer: row.original })}>
              <Eye className="h-4 w-4" /> {t('table.viewDetails')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  ]

  return (
    <div className="space-y-6 animate-in">
      <PageHeader title={t('title')} />

      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 pt-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('searchPlaceholder')}
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={garageFilter}
            onChange={(e) => setGarageFilter(e.target.value)}
          >
            <option value="">{t('allGarages')}</option>
            {Array.from(new Set(tenants.slice(0, 10).map(t => t.name))).map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 h-9 px-3">
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {t(`filters.${timeFilter}`)}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => setTimeFilter('all')}>{t('filters.all')}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeFilter('today')}>{t('filters.today')}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeFilter('yesterday')}>{t('filters.yesterday')}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeFilter('week')}>{t('filters.week')}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
      </Card>

      {/* DataTable component jo customers ki list show kar rha hai */}
      <DataTable
        columns={columns}
        data={filtered.map((r, i) => ({ ...r, index: i }))}
      />

      <ViewCustomerModal
        open={viewModal.open}
        customer={viewModal.customer}
        onClose={() => setViewModal({ open: false, customer: null })}
      />
    </div>
  )
}

function ViewCustomerModal({ open, customer, onClose }) {
  const { t } = useTranslation('customers')
  if (!customer) return null

  // Niche dummy history array hai jo details modal me dikhegi
  const history = [
    { date: '2024-03-10', task: 'Oil Change & Filter Replacement', garage: customer.garage, status: 'Completed' },
    { date: '2024-02-28', task: 'Brake Pad Check and Alignment', garage: customer.garage, status: 'Completed' },
    { date: '2024-02-15', task: 'General Inspection', garage: customer.garage, status: 'Completed' },
  ]

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-w-2xl gap-0 p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b bg-primary/5">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-2xl font-bold shadow-lg shadow-primary/20">
              {customer.name.charAt(0)}
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-xl">{customer.name}</DialogTitle>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground font-mono">{customer.id}</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-5 h-[450px]">
          {/* Left: Info */}
          <div className="col-span-2 border-r bg-muted/10 p-6 space-y-6">
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t('modal.contactInfo')}</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg border bg-white flex items-center justify-center shadow-sm">
                    <Mail className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-muted-foreground leading-none mb-1">{t('modal.email')}</p>
                    <p className="text-xs font-bold truncate">{customer.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg border bg-white flex items-center justify-center shadow-sm">
                    <Phone className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-muted-foreground leading-none mb-1">{t('modal.phone')}</p>
                    <p className="text-xs font-bold">{customer.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg border bg-white flex items-center justify-center shadow-sm">
                    <Building2 className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-muted-foreground leading-none mb-1">{t('modal.associatedGarage')}</p>
                    <p className="text-xs font-bold truncate">{customer.garage}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-dashed border-primary/20 bg-primary/5 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase text-primary/70 tracking-tight">{t('modal.totalServices')}</span>
                <Badge variant="outline" className="bg-white border-primary/20 text-primary">{customer.serviceCount}</Badge>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">{t('modal.memberSince')} {customer.joinedDate}</p>
            </div>
          </div>

          {/* Right: Vehicle Details */}
          <div className="col-span-3 overflow-y-auto p-6 space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Car className="h-4 w-4" /> {t('modal.registeredVehicles')}
            </h4>
            <div className="space-y-4">
              {customer.vehicles?.map((v, i) => (
                <div key={i} className="rounded-2xl border border-border/60 bg-white p-4 shadow-sm hover:border-primary/30 transition-all">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/30">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                        <Car className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-black uppercase tracking-wider text-black">{v.plate}</span>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-bold bg-primary/5 border-primary/10 text-primary uppercase">{v.fuel}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                    <div>
                      <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-tighter mb-1">{t('tenants:table.plan').split('/')[0].trim() || 'Plan'}</p>
                      <p className="text-xs font-bold text-text text-black">{v.make} {v.model}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-tighter mb-1">{t('tenants:detailTitle').includes('Detail') ? 'Variant' : 'الطراز'}</p>
                      <p className="text-xs font-bold text-text text-black">{v.variant}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-tighter mb-1">{t('tenants:table.joinedDate')}</p>
                      <p className="text-xs font-bold text-text text-black">{v.year}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-tighter mb-1">{t('dashboard:revenueVsTarget').includes('Revenue') ? 'Color' : 'اللون'}</p>
                      <p className="text-xs font-bold text-text text-black">{v.color}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-tighter mb-1">{t('modal.vin')}</p>
                      <p className="text-[10px] font-mono font-bold text-primary/80 bg-primary/5 p-1.5 rounded border border-primary/5">{v.vin}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {(!customer.vehicles || customer.vehicles.length === 0) && (
              <div className="flex flex-col items-center justify-center h-40 text-center opacity-40">
                <Car className="h-10 w-10 mb-2" />
                <p className="text-xs">{t('modal.noVehicles')}</p>
              </div>
            )}
            <Button variant="ghost" className="w-full text-[10px] text-primary h-8 hover:bg-primary/5">{t('modal.fullHistory')}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
