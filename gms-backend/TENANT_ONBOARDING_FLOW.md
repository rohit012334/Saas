# GMS — Tenant Onboarding Flow
### Become a Tenant — Complete Flow Documentation

---

## 📱 Entry Point — Customer App

```
Customer App open kiya
│
└── Home Screen — 2 Options:
    ┌─────────────────────┐   ┌─────────────────────┐
    │   🏢 Become a       │   │   👤 Sign up as      │
    │      Tenant         │   │      User            │
    └─────────────────────┘   └─────────────────────┘
              │
              ▼
    "Become a Tenant" click
              │
              ▼
    Multi-step onboarding begins
```

---

## 🪜 Step-by-Step Flow

```
STEP 1 ──── STEP 2 ──── STEP 3 ──── STEP 4 ──── STEP 5
Basic Info   OTP         Plan        Documents    Payment
& Email      Verify      Select      Upload
```

---

## 📋 STEP 1 — Basic Info

```
Fields:
├── Full Name        (text input)
├── Email Address    (email input)
└── Phone Number     (with country code)

Validation:
├── All fields required
├── Valid email format
└── Valid phone number

On Submit:
└── OTP send to email → move to Step 2
```

---

## 📧 STEP 2 — Email OTP Verification

```
Screen:
├── "Enter the 6-digit code sent to [email]"
├── OTP input (6 boxes)
├── Resend OTP (after 60 seconds)
└── Change email option

On Verify:
├── OTP match → move to Step 3
└── OTP wrong → error message, retry

OTP:
├── Expires in: 10 minutes
└── Max attempts: 3
```

---

## 💳 STEP 3 — Plan Selection

```
3 Plan Cards shown:

┌─────────────────────────────────────────────────────┐
│  BASIC           PRO ⭐ Popular    ENTERPRISE        │
│  ₹999/mo         ₹2,999/mo        ₹7,999/mo         │
│                                                     │
│  ✅ 2 Staff       ✅ 10 Staff       ✅ Unlimited      │
│  ✅ 100 Jobs/mo   ✅ Unlimited      ✅ Unlimited      │
│  ✅ Inventory     ✅ Inventory      ✅ All Modules    │
│  ❌ Fleet         ✅ Fleet(50)      ✅ Diagnostics    │
│  ❌ Diagnostics   ❌ Diagnostics    ✅ Custom Brand   │
│  ❌ WhatsApp      ✅ WhatsApp       ✅ SLA 99.9%      │
│                                                     │
│  [Select]         [Select]         [Select]         │
└─────────────────────────────────────────────────────┘

Monthly / Yearly toggle (yearly = 2 months free)

On Select:
└── Plan stored in state → move to Step 4
```

---

## 📁 STEP 4 — Documents & Garage Details

```
SECTION A — Legal Documents
──────────────────────────────────────
Trade License:
├── Front image upload   (JPG/PNG/PDF, max 5MB)
└── Back image upload    (JPG/PNG/PDF, max 5MB)

Owner Verification:
├── ID / Passport Front  (JPG/PNG/PDF, max 5MB)
└── ID / Passport Back   (JPG/PNG/PDF, max 5MB)

VAT Certificate:
└── Image / PDF upload   (JPG/PNG/PDF, max 5MB)


SECTION B — Garage Details
──────────────────────────────────────
├── Garage Name          (text)
├── Garage Address       (text)
├── City                 (text)
├── Country              (dropdown — default UAE)
├── Phone Number         (with country code)
├── Email                (pre-filled from Step 1)
├── Number of Branches   (number input)
└── Services Type        (multi-select checkboxes):
    ☐ Repair
    ☐ Paint
    ☐ Electrical
    ☐ Full Service
    ☐ Tyre & Wheel
    ☐ AC Service
    ☐ Body Work
    ☐ Diagnostics
    ☐ Car Wash


SECTION C — Billing & Tax Info
──────────────────────────────────────
├── TRN Number           (text)
├── Company Billing Name (text)
└── Billing Address      (textarea)


Validation:
├── All documents required
├── All garage details required
├── At least 1 service type selected
└── Valid TRN format

On Submit:
└── All data + docs uploaded to S3 → move to Step 5
```

---

## 💰 STEP 5 — Payment

```
Payment Summary screen:
┌─────────────────────────────────┐
│  Order Summary                  │
│  ─────────────────────────────  │
│  Plan:     Pro                  │
│  Billing:  Monthly              │
│  Amount:   ₹2,999/month         │
│  GST:      ₹539.82 (18%)        │
│  ─────────────────────────────  │
│  Total:    ₹3,538.82            │
│                                 │
│  [Pay with Razorpay]            │
│                                 │
│  🔒 Secure payment via Razorpay │
└─────────────────────────────────┘

Razorpay opens → Customer pays
        │
        ├── Payment SUCCESS → Step 6
        └── Payment FAILED  → Retry option
```

---

## ⏳ STEP 6 — Application Submitted

```
Screen after successful payment:

┌─────────────────────────────────┐
│                                 │
│   ✅ Payment Received!           │
│                                 │
│   Your application is under     │
│   review by our team.           │
│                                 │
│   Expected time: 24-48 hours    │
│                                 │
│   We'll notify you via:         │
│   📧 Email                      │
│   📱 App notification           │
│                                 │
│   Application ID: APP-2024-001  │
│                                 │
│   [Track Application Status]    │
│                                 │
└─────────────────────────────────┘

Email sent to tenant:
Subject: "Application Received — GMS"
Body:
  "Hi [Name], we have received your
  application for [Garage Name].
  Our team will verify your documents
  within 24-48 hours. Application ID: APP-001"
```

---

## 🛡️ SUPER ADMIN — Verification Flow

### New Application Alert

```
Super Admin Panel:
├── 🔔 Notification bell: "New tenant application"
├── Dashboard: "Pending Verifications" count +1
└── Tenant Management → "Pending" tab → new entry
```

### Application Detail Page

```
┌─────────────────────────────────────────────────────┐
│  Application: APP-2024-001          Status: PENDING  │
│  Submitted: 15 Jan 2024, 3:45 PM                     │
├─────────────────────────────────────────────────────┤
│                                                      │
│  OWNER INFO                                          │
│  Name:    Rajesh Sharma                              │
│  Email:   rajesh@sharma.com                          │
│  Phone:   +971 50 123 4567                           │
│                                                      │
│  PLAN SELECTED                                       │
│  Plan:    Pro — ₹2,999/month                         │
│  Payment: ✅ PAID — ₹3,538.82 (incl. GST)            │
│  Razorpay ID: pay_xxx123                             │
│                                                      │
│  GARAGE DETAILS                                      │
│  Name:     Sharma Motors                             │
│  Address:  Shop 12, Al Quoz Industrial               │
│  City:     Dubai                                     │
│  Country:  UAE                                       │
│  Services: Repair, Electrical, Full Service          │
│  Branches: 2                                         │
│                                                      │
│  BILLING INFO                                        │
│  Company:  Sharma Motors LLC                         │
│  TRN:      100234567890003                           │
│  Address:  PO Box 1234, Dubai, UAE                   │
│                                                      │
│  DOCUMENTS                                           │
│  Trade License Front:   [👁 View] [✅ / ❌]           │
│  Trade License Back:    [👁 View] [✅ / ❌]           │
│  Owner ID Front:        [👁 View] [✅ / ❌]           │
│  Owner ID Back:         [👁 View] [✅ / ❌]           │
│  VAT Certificate:       [👁 View] [✅ / ❌]           │
│                                                      │
│  Admin Notes: (internal textarea)                    │
│                                                      │
├─────────────────────────────────────────────────────┤
│                                                      │
│     [✅ APPROVE]              [❌ REJECT]             │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## ✅ APPROVE Flow

```
Super Admin → APPROVE click
        ↓
Confirm Dialog:
"Activate Sharma Motors with Pro plan?
 They will receive login credentials via email."
[Confirm] [Cancel]
        ↓
Confirm clicked
        ↓
Backend actions:
├── tenant.status       = "ACTIVE"
├── tenant.planStatus   = "ACTIVE"
├── tenant.verifiedBy   = adminId
├── tenant.verifiedAt   = now()
├── Login credentials generate:
│   email:    rajesh@sharma.com
│   password: auto-generated temp password
└── Email sent to tenant:

Subject: "🎉 Welcome to GMS — Account Approved!"
Body:
  "Congratulations Rajesh!
   Your garage Sharma Motors has been approved.

   Login here: app.yassir.com/login
   Email: rajesh@sharma.com
   Temp Password: Xk9#mP2q

   Please change your password after first login.

   Your Pro plan is now active.
   Support: support@yassir.com"
        ↓
Tenant can now login to Tenant Admin Panel ✅
```

---

## ❌ REJECT Flow

```
Super Admin → REJECT click
        ↓
Reject Modal:
┌─────────────────────────────────────────┐
│  Rejection Reason (required):           │
│                                         │
│  ○ Invalid Trade License                │
│  ○ ID / Passport not clear              │
│  ○ VAT Certificate mismatch             │
│  ○ Incomplete documents                 │
│  ○ TRN Number invalid                   │
│  ○ Other (enter reason below)           │
│                                         │
│  Custom Note: _________________________ │
│                                         │
│  Refund Policy:                         │
│  ● Full Refund                          │
│  ○ No Refund                            │
│  ○ Partial Refund (enter amount)        │
│                                         │
│  [Send Rejection]                       │
└─────────────────────────────────────────┘
        ↓
Backend actions:
├── tenant.status       = "REJECTED"
├── tenant.rejectionReason = reason
├── Refund initiate via Razorpay API
│   (if full/partial refund selected)
└── Email sent to tenant:

Subject: "Application Update — GMS"
Body:
  "Hi Rajesh,
   Unfortunately we could not verify
   your application for Sharma Motors.

   Reason: Invalid Trade License

   You can resubmit with correct documents:
   [Resubmit Application]

   Refund of ₹3,538.82 will be processed
   in 5-7 business days to your account.

   Questions? support@yassir.com"
```

---

## 🔁 RESUBMIT Flow

```
Tenant receives rejection email
        ↓
"Resubmit Application" link click
        ↓
App opens → Resubmit screen
├── Previous details pre-filled
├── Rejection reason highlighted in red
├── Only Documents section editable
│   (name, email etc. locked)
└── Re-upload required documents
        ↓
Submit → No payment again
(already paid, just re-verification)
        ↓
Super Admin ko notification:
"Resubmission received — APP-2024-001"
        ↓
Super Admin reviews again →
Approve or Reject again
```

---

## 📊 Tenant Status States

| Status | Matlab | Action |
|---|---|---|
| `PENDING_VERIFICATION` | Payment done, SA review pending | Wait |
| `ACTIVE` | Approved, full access | Use panel |
| `REJECTED` | Documents rejected | Resubmit |
| `RESUBMITTED` | Docs dobara bheje | SA review |
| `SUSPENDED` | SA ne suspend kiya | Contact support |
| `BLOCKED` | Permanently blocked | - |
| `EXPIRED` | Subscription khatam | Renew |

---

## 🗄️ Database Schema (Prisma)

```prisma
model Tenant {
  id                    String    @id @default(cuid())

  // Basic Info
  ownerName             String
  email                 String    @unique
  phone                 String

  // Plan
  planId                String
  plan                  Plan      @relation(fields: [planId], references: [id])

  // Status
  status                TenantStatus @default(PENDING_VERIFICATION)

  // Payment
  razorpayPaymentId     String?
  razorpayOrderId       String?
  amountPaid            Float?
  paymentStatus         String?

  // Garage Details
  garageName            String
  garageAddress         String
  city                  String
  country               String    @default("UAE")
  garagePhone           String
  garageEmail           String
  numberOfBranches      Int       @default(1)
  serviceTypes          String[]

  // Billing & Tax
  trnNumber             String?
  companyBillingName    String?
  billingAddress        String?

  // Documents (S3 URLs)
  tradeLicenseFront     String?
  tradeLicenseBack      String?
  ownerIdFront          String?
  ownerIdBack           String?
  vatCertificate        String?

  // Verification
  rejectionReason       String?
  verifiedBy            String?
  verifiedAt            DateTime?

  // Timestamps
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
}

enum TenantStatus {
  PENDING_VERIFICATION
  ACTIVE
  REJECTED
  RESUBMITTED
  SUSPENDED
  BLOCKED
  EXPIRED
}
```

---

## 🔔 Notifications Summary

| Event | Tenant Email | Tenant App | SA Notification |
|---|---|---|---|
| OTP sent | ✅ | ✅ | ❌ |
| Payment success | ✅ | ✅ | ✅ |
| Application approved | ✅ | ✅ | ❌ |
| Application rejected | ✅ | ✅ | ❌ |
| Resubmission received | ✅ | ✅ | ✅ |
| Subscription expiring | ✅ | ✅ | ✅ |

---

## 🔗 API Endpoints

```
POST /api/tenant-onboarding/start
     → Name, email, phone → send OTP

POST /api/tenant-onboarding/verify-otp
     → email, otp → verify

GET  /api/plans
     → Get all active plans

POST /api/tenant-onboarding/create-order
     → planId → Razorpay order create

POST /api/tenant-onboarding/submit-documents
     → All documents + garage details upload

POST /api/tenant-onboarding/verify-payment
     → Razorpay payment verify → save tenant

GET  /api/tenant-onboarding/status/:applicationId
     → Check application status

POST /api/tenant-onboarding/resubmit/:tenantId
     → Resubmit documents

── Super Admin ──

GET  /api/admin/tenants/pending
     → All pending applications

POST /api/admin/tenants/:id/approve
     → Approve tenant

POST /api/admin/tenants/:id/reject
     → Reject with reason + refund
```

---

*GMS — Tenant Onboarding Flow v1.0*
