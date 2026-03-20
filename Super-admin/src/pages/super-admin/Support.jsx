import React, { useState } from 'react'
import { Search, Filter, MessageSquare, Clock, CheckCircle, XCircle, MoreVertical, Eye, User, Calendar } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/shared/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '../../components/shared/Badge'
import { Button } from '@/components/ui/button'
import { toast } from '../../utils/toast'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// Initial data source - isme tickets ki dummy information store hai
const initialTickets = [
  {
    id: 'TKT-1024',
    user: 'Ahmed Khan',
    email: 'ahmed.k@example.com',
    subject: 'Login issue',
    description: 'Bhai, subah se dashboard login nahi ho raha hai. "Invalid Credentials" ka error aa raha hai jabki password sahi hai. Kal tak sab thik tha. Pls check karke batao kya issue hai.',
    status: 'Enquiry',
    date: '2026-03-11 10:20'
  },
  {
    id: 'TKT-1025',
    user: 'Sarah Al-Said',
    email: 'sarah.s@example.com',
    subject: 'Billing question',
    description: 'I noticed a discrepancy in my latest invoice (INV-2025004). The monthly charge for Enterprise plan is showing more than the agreed 7999. Can someone explain why there is an extra charge of 500?',
    status: 'Pending',
    date: '2026-03-11 09:15'
  },
  {
    id: 'TKT-1026',
    user: 'Vikram Singh',
    email: 'vikram.v@example.com',
    subject: 'Plan upgrade',
    description: 'I am currently on Basic plan and want to upgrade to Pro immediately. We have more staff now and need the WhatsApp integration features. Pls send the payment link.',
    status: 'Solved',
    date: '2026-03-10 16:40'
  },
  {
    id: 'TKT-1027',
    user: 'Omar Ali',
    email: 'omar.a@example.com',
    subject: 'Technical support',
    description: 'The mobile app is crashing whenever I try to upload a photo for a new job card. I have reinstalled several times but the issue persists. Device: iPhone 15, iOS 17.',
    status: 'Away',
    date: '2026-03-10 14:00'
  }
]

const statusMap = {
  Enquiry: 'default',
  Pending: 'warning',
  Solved: 'active',
  Away: 'inactive',
}

export function Support() {
  const { t } = useTranslation('support')
  const [tickets, setTickets] = useState(initialTickets) // Main state jo tickets ka data hold karti hai
  const [search, setSearch] = useState('') // Search keyword store karne ke liye
  const [timeFilter, setTimeFilter] = useState('all') // Time (Today, Week etc) base filter ke liye
  const [viewModal, setViewModal] = useState({ open: false, ticket: null }) // Ticket details modal aur selected ticket ka data store karne ke liye

  // Ticket ka status update karne wala function
  const handleStatusChange = (id, newStatus) => {
    // Tickets list me se specific ID wala ticket find karke uska status badal rha hai
    setTickets(tickets.map(t => t.id === id ? { ...t, status: newStatus } : t))
    toast.success(`${t('statusChanged')} ${t(`status.${newStatus}`)}`)
  }

  const filtered = tickets.filter(t => {
    const matchesSearch = t.user.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (timeFilter === 'all') return true;

    const ticketDate = new Date(t.date);
    const now = new Date('2026-03-11 12:19'); // Consistent with metadata time
    const diffDays = (now - ticketDate) / (1000 * 60 * 60 * 24);

    if (timeFilter === 'today') return diffDays < 1 && ticketDate.getDate() === now.getDate();
    if (timeFilter === 'yesterday') {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      return ticketDate.getDate() === yesterday.getDate() && ticketDate.getMonth() === yesterday.getMonth();
    }
    if (timeFilter === 'week') return diffDays <= 7;

    return true;
  });

  return (
    <div className="space-y-6 animate-in">
      <PageHeader title={t('title')} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-500 delay-150">
        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-orange-100/50 bg-gradient-to-br from-orange-50/30 to-background">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <Clock className="w-20 h-20 text-orange-600" />
          </div>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-orange-100 text-orange-600 shadow-sm group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t('status.Pending')}</p>
                <div className="flex items-baseline gap-1">
                  <h3 className="text-3xl font-bold tracking-tight text-orange-700">{tickets.filter(t => t.status === 'Pending').length}</h3>
                  <span className="text-xs text-orange-600/60 font-medium">Tickets</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-emerald-100/50 bg-gradient-to-br from-emerald-50/30 to-background">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <CheckCircle className="w-20 h-20 text-emerald-600" />
          </div>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-600 shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t('status.Solved')}</p>
                <div className="flex items-baseline gap-1">
                  <h3 className="text-3xl font-bold tracking-tight text-emerald-700">{tickets.filter(t => t.status === 'Solved').length}</h3>
                  <span className="text-xs text-emerald-600/60 font-medium">Tickets</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-blue-100/50 bg-gradient-to-br from-blue-50/30 to-background">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <MessageSquare className="w-20 h-20 text-blue-600" />
          </div>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-blue-100 text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t('status.Enquiry')}</p>
                <div className="flex items-baseline gap-1">
                  <h3 className="text-3xl font-bold tracking-tight text-blue-700">{tickets.filter(t => t.status === 'Enquiry').length}</h3>
                  <span className="text-xs text-blue-600/60 font-medium">Tickets</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="flex items-center gap-3 pt-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('search')}
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                {t(`filters.${timeFilter}`)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTimeFilter('all')}>{t('filters.all')}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeFilter('today')}>{t('filters.today')}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeFilter('yesterday')}>{t('filters.yesterday')}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeFilter('week')}>{t('filters.week')}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('table.id')}</TableHead>
                <TableHead>{t('table.user')}</TableHead>
                <TableHead>{t('table.subject')}</TableHead>
                <TableHead>{t('table.date')}</TableHead>
                <TableHead>{t('table.status')}</TableHead>
                <TableHead>{t('table.action')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-mono text-xs">{ticket.id}</TableCell>
                  <TableCell className="font-medium">{ticket.user}</TableCell>
                  <TableCell className="max-w-[250px] truncate">{ticket.subject}</TableCell>
                  <TableCell className="text-muted-foreground">{ticket.date}</TableCell>
                  <TableCell>
                    <Badge variant={statusMap[ticket.status]}>{t(`status.${ticket.status}`)}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon-sm" onClick={() => setViewModal({ open: true, ticket })}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setViewModal({ open: true, ticket })}>{t('actions.viewDetails')}</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(ticket.id, 'Enquiry')}>{t('actions.setEnquiry')}</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(ticket.id, 'Pending')}>{t('actions.setPending')}</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(ticket.id, 'Solved')}>{t('actions.setSolved')}</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(ticket.id, 'Away')}>{t('actions.setAway')}</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ViewTicketModal
        open={viewModal.open}
        ticket={viewModal.ticket}
        onClose={() => setViewModal({ open: false, ticket: null })}
      />
    </div>
  )
}

function ViewTicketModal({ open, ticket, onClose }) {
  const { t } = useTranslation('support')
  if (!ticket) return null

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>{t('modal.details')} — {ticket.id}</DialogTitle>
            <Badge variant={statusMap[ticket.status]}>{t(`status.${ticket.status}`)}</Badge>
          </div>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex items-start gap-4 rounded-xl bg-muted/50 p-4 border border-border/50 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <User className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-text">{ticket.user}</p>
              <p className="text-xs text-muted-foreground">{ticket.email}</p>
              <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1 font-medium italic"><Calendar className="h-3 w-3" /> {t('modal.submitted')}: {ticket.date}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary/80">{t('modal.subject')}</h4>
            <p className="text-base font-semibold text-text">{ticket.subject}</p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary/80">{t('modal.description')}</h4>
            <div className="rounded-xl border border-border/50 bg-background/50 p-4 shadow-inner">
              <p className="text-sm leading-relaxed text-text-secondary whitespace-pre-wrap">
                {ticket.description}
              </p>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>{t('modal.close')}</Button>
            <Button className="flex-1">{t('modal.reply')}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

