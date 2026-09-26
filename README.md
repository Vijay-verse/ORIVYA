# ORIVYA — Multi-Modal Travel & Trip-Management Platform

> **Plan. Book. Travel.**  
> *One trip. Every booking. One place.*

---

## 🌟 Overview

**ORIVYA** is a full-stack multi-modal travel discovery, booking, and trip-management platform that unifies four critical travel services into a single cohesive experience:

**🚌 Bus + 🚆 Train + 🏨 Hotel + 🚕 Cab = 🧭 Unified Trip**

Instead of forcing travellers to jump between disparate platforms, keep track of fragmented confirmation codes, and manually connect dates, ORIVYA compiles an entire journey into **one chronological itinerary**.

---

## 🚀 Live Implemented Modules

### 1. 🚌 Bus Booking Engine (Vertical Slice)
- **Interactive Multi-Deck Seat Layout:** Visual 2-deck representation (Lower & Upper) supporting single sleeper berths, double sleeper berths, and female-only seat protection.
- **5-Minute Temporary Seat Locking:** Live countdown lock prevents race conditions and holds inventory during the checkout flow.
- **Boarding & Dropping Points:** Dynamic selector with milestone timestamps and pickup landmarks.
- **Digital Boarding Pass & QR Code:** Instantly generates scannable cryptographically hashed QR codes.

### 2. 🚆 Train Reservation System
- **Station-to-Station Route Explorer:** Multi-city search with train numbers (e.g., 12115 Siddheshwar Express, 12780 Goa Express).
- **Class Quota Availability:** Live simulation across Sleeper (SL), AC 3 Tier (3A), AC 2 Tier (2A), and AC Chair Car (CC).
- **Intermediate Station Halts:** Route timetable viewer with distance markers and arrival/departure times.
- **Simulated PNR Status Checker:** 10-digit PNR lookup with coach and berth allocation.

### 3. 🏨 Hotel & Resort Stays
- **Destination Inventory:** Premium coastal resorts and business hotels with star ratings and verified amenities.
- **Custom Room Tiers:** Deluxe Ocean View, Premium Executive Club, and Presidential Suites with transparent price breakdowns.
- **Automated Tax Calculation:** Instant calculation of 12% hospitality GST and check-in vouchers.

### 4. 🚕 Local Cabs & Station Transfers
- **Point-to-Point Local Mobility:** Airport and railway station connectors directly to hotel resorts.
- **Fleet Tiers:** ORIVYA Mini, Sedan, SUV Prime, and Premium Luxe with upfront fixed pricing.
- **Live Ride Lifecycle Simulation:** Animated radar tracking from *Searching* ➔ *Driver Assigned* ➔ *Arriving (km distance countdown)* ➔ *In Trip* ➔ *Completed*.

### 5. 🧭 Unified Trips ("My Trips")
- **Chronological Master Itinerary:** Seamless timeline organizing transportation, check-in/check-out, and local transfers for a single trip.
- **Master Print Pass:** Printable summary itinerary.
- **Trip Generator:** Create custom travel plans and attach new bookings dynamically.

### 6. 🎟️ Digital Bookings & Instant Refund Cancellation
- **Pass Management:** Centralized view of all active, confirmed, and past travel passes.
- **Cancellation Engine:** Transparent cancellation policy enforcement (₹150 deduction) with instant wallet/source credit simulation.

### 7. 📊 Operations & Admin Analytics Portal (`/admin`)
- **KPI Dashboards:** Gross Platform GMV (₹8,42,500), Volume, Confirmation Rate, Active Trips, and Registered Travellers.
- **Service Mix Distribution:** Volume share across Bus (42%), Train (25%), Hotel (22%), and Cab (11%).
- **Top Inter-City Corridors:** Revenue tracking for Pune ⇄ Goa, Pune ⇄ Hyderabad, and Pune ⇄ Mumbai.
- **Live Telemetry & Transaction Table:** Real-time synchronized booking records.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router with Turbopack) + TypeScript |
| **Styling** | Tailwind CSS v4 + Custom Brand Design Tokens |
| **Icons & Visuals** | Lucide React |
| **Animation & Effects**| Framer Motion + Canvas Confetti |
| **Data Layer & State**| Typed Data Access Layer + React Context + LocalStorage Persistence |
| **QR Generation** | `qrcode` Library for client-side cryptographic ticket rendering |
| **Architecture** | Modular Monolith with Domain-Driven Service Isolation |

---

## 🏃 Getting Started Locally

### Prerequisites
- Node.js 18.x or newer
- npm or pnpm

### Installation

1. Clone or navigate to the project directory:
   ```bash
   cd c:\Users\trill\ORIVYA
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```text
   http://localhost:3000
   ```

5. Explore the main routes:
   - **Homepage:** `http://localhost:3000`
   - **Bus Search & Seat Map:** `http://localhost:3000/bus`
   - **Train Engine & PNR:** `http://localhost:3000/train`
   - **Hotels & Suites:** `http://localhost:3000/hotels`
   - **Local Cabs & Live Radar:** `http://localhost:3000/cabs`
   - **My Trips (Master Itinerary):** `http://localhost:3000/trips`
   - **Digital Passes & Refunds:** `http://localhost:3000/bookings`
   - **Admin SaaS Dashboard:** `http://localhost:3000/admin`

---

## 💬 Interview & Viva Talking Points

- **Why a Modular Monolith?** Rather than premature microservice overhead, ORIVYA's modular monolith keeps domain logic cleanly separated by module (Bus, Train, Hotel, Cab, Booking, Trip) while sharing authentication, transactions, and UI primitives.
- **How Seat Locking Works:** When a user proceeds to checkout, a 5-minute temporary lease is created. If the countdown expires or the user abandons checkout, the held seats are released back into inventory without requiring full database writes.
- **Unified Itinerary Aggregation:** Every confirmed booking creates a corresponding `TripItem` linked to a master `Trip` record, producing a clean, chronological timeline for the traveller.
