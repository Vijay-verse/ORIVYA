# ORIVYA — Multi-Modal Travel & Trip-Management Platform

> **Plan. Book. Travel.**  
> *One trip. Every booking. One place.*

---

## 🌟 Overview

**ORIVYA** is a full-stack multi-modal travel discovery, booking, and trip-management platform that unifies four critical travel services into a single cohesive experience:

**🚌 Bus + 🚆 Train + 🏨 Hotel + 🚕 Cab = 🧭 Unified Trip**

Instead of forcing travellers to jump between disparate platforms, keep track of fragmented confirmation codes, and manually connect dates, ORIVYA compiles an entire journey into **one master chronological itinerary**.

---

## 🏗️ Architecture: Modular Monolith

ORIVYA is structured as a **modular monolith** running within the Next.js App Router, powered by TypeScript and PostgreSQL via Supabase.

```text
                    ORIVYA
                       │
               Next.js Application
                       │
        ┌──────────────┼──────────────┐
        │              │              │
     Customer       Booking         Admin
        UI            APIs           Hub
        │              │              │
        └──────────────┼──────────────┘
                       │
                 Domain Services
        (Pricing, SeatLock, Refund, Trips)
                       │
              Supabase PostgreSQL
                       │
       ┌───────────────┼────────────────┐
       │               │                │
   Authentication   Inventory        Payments
       │               │                │
       └───────────────┼────────────────┘
                       │
                Unified Trip Engine
```

---

## 🚀 Implemented Modules & Capabilities

### 1. 🚌 Bus Booking Engine (Vertical Slice)
- **Interactive Multi-Deck Seat Layout:** Visual 2-deck representation (Lower & Upper) supporting single sleeper berths, double sleeper berths, and female-only seat protection.
- **Atomic 5-Minute Seat Locking:** Server-side `SeatLockService` creates a temporary 300-second lease to prevent race conditions during checkout.
- **Boarding & Dropping Points:** Dynamic selector with milestone timestamps and pickup landmarks.
- **Digital Boarding Pass & QR Code:** Client-side cryptographic QR generation using `qrcode` for onboard verification.

### 2. 🚆 Train Reservation System
- **Station-to-Station Route Explorer:** Multi-city search with train numbers (e.g., 12115 Siddheshwar Express, 12780 Goa Express).
- **Class Quota Availability:** Live simulation across Sleeper (SL), AC 3 Tier (3A), AC 2 Tier (2A), and AC Chair Car (CC).
- **Intermediate Station Halts:** Route timetable viewer with distance markers and arrival/departure times.
- **Simulated PNR Status Checker:** 10-digit PNR lookup with coach and berth allocation.

### 3. 🏨 Hotel & Resort Stays
- **Destination Inventory:** Premium coastal resorts and business hotels with star ratings and verified amenities.
- **Custom Room Tiers:** Deluxe Ocean View, Premium Executive Club, and Presidential Suites with transparent price breakdowns.
- **Automated Tax Calculation:** Real-time computation of 12% hospitality GST and check-in vouchers.

### 4. 🚕 Local Cabs & Station Transfers
- **Point-to-Point Local Mobility:** Airport and railway station connectors directly to hotel resorts.
- **Fleet Tiers:** ORIVYA Mini, Sedan, SUV Prime, and Premium Luxe with upfront fixed pricing.
- **Live Ride Lifecycle Simulation:** Animated radar tracking from *Searching* ➔ *Driver Assigned* ➔ *Arriving (km countdown)* ➔ *In Trip* ➔ *Completed*.

### 5. 🧭 Unified Trips Engine ("My Trips")
- **Chronological Master Itinerary:** Timeline ordering transportation, check-in/check-out, and local transfers for a single trip based on real timestamps.
- **Master Print Pass:** Printable summary itinerary.
- **Trip Generator:** Create custom travel plans and attach new bookings dynamically.

### 6. 🎟️ Digital Bookings & Instant Refund Cancellation
- **Pass Management:** Centralized view of all active, confirmed, and past travel passes.
- **Cancellation Engine:** Transparent cancellation policy enforcement (₹150 deduction) with instant wallet/source credit calculation via `RefundService`.

### 7. 📊 Operations & Admin Analytics Portal (`/admin`)
- **KPI Dashboards:** Gross Platform GMV (₹8,42,500), Volume, Confirmation Rate, Active Trips, and Registered Travellers.
- **Date Filter Controls:** All Time, 30 Days, 7 Days, and Today.
- **Service Mix Distribution:** Volume share across Bus (42%), Train (25%), Hotel (22%), and Cab (11%).
- **Top Inter-City Corridors:** Revenue tracking for Pune ⇄ Goa, Pune ⇄ Hyderabad, and Pune ⇄ Mumbai.
- **Role-Based Access Guard:** Strictly limits access to users with the `admin` role, with a demo elevation switcher for evaluation.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router with Turbopack) + TypeScript |
| **Styling** | Tailwind CSS v4 + Custom Brand Design Tokens |
| **Icons & Visuals** | Lucide React |
| **Animation & Effects**| Framer Motion + Canvas Confetti |
| **Data Layer & State**| Supabase Client + Typed Data Access Layer + React Context |
| **QR Generation** | `qrcode` Library for digital boarding pass rendering |
| **Testing** | Node.js Test Runner + `tsx` TypeScript Execution |
| **Architecture** | Modular Monolith with Domain-Driven Service Isolation |

---

## 💾 Database Schema & Seed Data

The complete canonical PostgreSQL schema and seed data are available in:
* **Schema DDL:** [`database/schema.sql`](file:///c:/Users/trill/ORIVYA/database/schema.sql) (24 tables, enums, composite indexes, and `hold_bus_seat_atomic` function)
* **Seed Script:** [`database/seed.sql`](file:///c:/Users/trill/ORIVYA/database/seed.sql) (operators, buses, routes, trains, hotels, cabs, seed bookings, and master trips)

To apply to your live Supabase project:
1. Open the **SQL Editor** in your Supabase Dashboard.
2. Run `database/schema.sql`.
3. Run `database/seed.sql`.

---

## 🧪 Running Automated Tests

Run the automated test suite covering `PricingService`, `RefundService`, `TripEngine`, and `SeatLockService`:

```bash
npm test
```

Sample output:
```text
▶ PricingService Unit Tests
  ✔ calculates bus pricing with 5% GST and booking fee
  ✔ calculates hotel luxury stays with 12% hospitality GST
  ✔ applies UPI instant discount and promotional coupon
✔ PricingService Unit Tests
▶ RefundService Unit Tests
  ✔ enforces standard operator cancellation fee deduction
  ✔ handles low value booking refunds without negative amounts
✔ RefundService Unit Tests
▶ TripEngine Itinerary Sorting Tests
  ✔ strictly orders itinerary items chronologically by timestamp
✔ TripEngine Itinerary Sorting Tests
▶ SeatLockService Unit Tests
  ✔ leases seats atomically with 5-minute TTL
✔ SeatLockService Unit Tests
ℹ tests 7 | pass 7 | fail 0
```

---

## 🏃 Getting Started Locally

### 1. Installation
```bash
cd c:\Users\trill\ORIVYA
npm install
```

### 2. Environment Configuration
Copy the environment template:
```bash
cp .env.example .env.local
```
*(Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` if connecting to a live Supabase project; otherwise the app will gracefully run in full local demo mode).*

### 3. Start Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

---

## 📌 Simulation Disclosures (Viva & Portfolio Notice)

In accordance with good engineering ethics and portfolio criteria:
* **Railway inventory:** Realistic Indian Railways simulation (quota counts, PNR format, station halts).
* **Payment processing:** Mock sandbox provider (UPI, Cards, NetBanking, ORIVYA Wallet).
* **Cab location tracking:** Realistic state machine and simulated radar dispatch.
* **External supplier APIs:** Abstracted behind provider interfaces (`PaymentProvider`, `SeatLockService`, `TripEngine`) for future live API integration.
