import { BusSchedule, BusSeat } from "@/types";

export const MOCK_BUS_SCHEDULES: BusSchedule[] = [
  {
    id: "bus-vrl-01",
    operator: {
      id: "op-vrl",
      name: "VRL Travels",
      logoText: "VRL",
      rating: 4.8,
      totalReviews: 1420,
    },
    busNumber: "MH 12 QX 4920",
    busType: "AC Sleeper (2+1)",
    fromCity: "Pune",
    toCity: "Goa",
    departureTime: "21:30",
    arrivalTime: "08:00",
    duration: "10h 30m",
    date: "2026-10-02",
    basePrice: 1299,
    rating: 4.8,
    amenities: ["Wi-Fi", "Charging Port", "Blanket & Pillow", "Reading Light", "Water Bottle", "Live GPS"],
    boardingPoints: [
      { time: "21:30", location: "Swargate", landmark: "Near Laxmi Narayan Theater" },
      { time: "22:00", location: "Katraj", landmark: "Wonder City Bus Stop" },
      { time: "22:30", location: "Wakad Hinjewadi Flyover", landmark: "Under Bridge" },
    ],
    droppingPoints: [
      { time: "07:15", location: "Mapusa", landmark: "Taxi Stand" },
      { time: "07:45", location: "Panaji", landmark: "KTC Bus Stand" },
      { time: "08:00", location: "Madgaon", landmark: "Railway Station Gate 1" },
    ],
    cancellationPolicy: "Full refund 12h prior. 50% refund 6h prior. Non-refundable within 6h of departure.",
    seatsAvailableCount: 18,
    totalSeats: 30,
  },
  {
    id: "bus-neeta-02",
    operator: {
      id: "op-neeta",
      name: "Neeta Travels",
      logoText: "NEETA",
      rating: 4.4,
      totalReviews: 980,
    },
    busNumber: "MH 14 BG 7102",
    busType: "AC Sleeper (2+1)",
    fromCity: "Pune",
    toCity: "Goa",
    departureTime: "20:45",
    arrivalTime: "07:15",
    duration: "10h 30m",
    date: "2026-10-02",
    basePrice: 1149,
    rating: 4.4,
    amenities: ["Charging Port", "Blanket", "Water Bottle", "Emergency Exit"],
    boardingPoints: [
      { time: "20:45", location: "Swargate", landmark: "Neeta Office" },
      { time: "21:15", location: "Chandani Chowk", landmark: "Paud Road Corner" },
    ],
    droppingPoints: [
      { time: "06:45", location: "Mapusa", landmark: "Old Bus Stand" },
      { time: "07:15", location: "Panaji", landmark: "Opp. Collectorate" },
    ],
    cancellationPolicy: "Standard cancellation policy: ₹150 cancellation charge before 24h.",
    seatsAvailableCount: 12,
    totalSeats: 30,
  },
  {
    id: "bus-intrcity-03",
    operator: {
      id: "op-intrcity",
      name: "IntrCity SmartBus",
      logoText: "SMART",
      rating: 4.7,
      totalReviews: 2150,
    },
    busNumber: "KA 01 AJ 3391",
    busType: "BharatBenz Multi-Axle Luxury",
    fromCity: "Pune",
    toCity: "Goa",
    departureTime: "22:00",
    arrivalTime: "08:30",
    duration: "10h 30m",
    date: "2026-10-02",
    basePrice: 1399,
    rating: 4.7,
    amenities: ["Smart Lounge Access", "High-speed Wi-Fi", "Clean Washroom Onboard", "Snack Box", "CCTV"],
    boardingPoints: [
      { time: "22:00", location: "Wakad", landmark: "IntrCity SmartLounge, Hinjewadi Bridge" },
      { time: "22:40", location: "Swargate", landmark: "Mitra Mandal Chowk" },
    ],
    droppingPoints: [
      { time: "08:00", location: "Panaji", landmark: "IntrCity Lounge, Patto Plaza" },
      { time: "08:30", location: "Madgaon", landmark: "KTC Terminal" },
    ],
    cancellationPolicy: "Instant refund to wallet. Free rescheduling up to 4 hours before journey.",
    seatsAvailableCount: 9,
    totalSeats: 30,
  },
  {
    id: "bus-zing-04",
    operator: {
      id: "op-zing",
      name: "Zingbus Plus",
      logoText: "ZING",
      rating: 4.6,
      totalReviews: 870,
    },
    busNumber: "DL 01 AA 9912",
    busType: "AC Seater (2+2)",
    fromCity: "Pune",
    toCity: "Goa",
    departureTime: "23:00",
    arrivalTime: "09:30",
    duration: "10h 30m",
    date: "2026-10-02",
    basePrice: 999,
    rating: 4.6,
    amenities: ["Reclining Push-Back Seats", "USB Charging", "Reading Lamp", "On-Time Guarantee"],
    boardingPoints: [
      { time: "23:00", location: "Nigdi", landmark: "Pawan Chowk" },
      { time: "23:30", location: "Swargate", landmark: "Near State Bank" },
    ],
    droppingPoints: [
      { time: "09:00", location: "Panaji", landmark: "Kadamba Bus Stand" },
      { time: "09:30", location: "Calangute Circle", landmark: "Mall Road" },
    ],
    cancellationPolicy: "100% refund if cancelled 24 hours in advance.",
    seatsAvailableCount: 22,
    totalSeats: 40,
  },
  // Additional route: Pune to Hyderabad
  {
    id: "bus-hyd-01",
    operator: {
      id: "op-orange",
      name: "Orange Tours & Travels",
      logoText: "ORANGE",
      rating: 4.5,
      totalReviews: 1840,
    },
    busNumber: "TS 09 UA 4421",
    busType: "AC Sleeper (2+1)",
    fromCity: "Pune",
    toCity: "Hyderabad",
    departureTime: "20:00",
    arrivalTime: "06:30",
    duration: "10h 30m",
    date: "2026-10-02",
    basePrice: 1150,
    rating: 4.5,
    amenities: ["Blanket", "Water Bottle", "Charging Points", "Movie Screen"],
    boardingPoints: [
      { time: "20:00", location: "Swargate", landmark: "Jedhe Chowk" },
      { time: "20:45", location: "Hadapsar", landmark: "Gadital" },
    ],
    droppingPoints: [
      { time: "05:45", location: "Gachibowli", landmark: "ORR Junction" },
      { time: "06:30", location: "MGBS", landmark: "Imlibun Bus Terminal" },
    ],
    cancellationPolicy: "Cancellation fee ₹100 before 12 hours.",
    seatsAvailableCount: 14,
    totalSeats: 30,
  }
];

// Generator for realistic 2-deck sleeper bus layout (Lower Deck & Upper Deck)
export function generateBusSeats(scheduleId: string, basePrice: number): BusSeat[] {
  const seats: BusSeat[] = [];

  // Lower Deck: 15 seats (5 rows x 3 berths: 1 Single on left + 2 Double on right)
  const lowerRows = 5;
  for (let r = 1; r <= lowerRows; r++) {
    // Single Berth (Left: col 1)
    const singleNum = `L${r}A`;
    // Pre-seed some booked seats realistically
    const isBooked = (r === 2 && scheduleId.includes("vrl")) || (r === 4 && scheduleId.includes("neeta"));
    const isFemale = r === 1;

    seats.push({
      id: `${scheduleId}-${singleNum}`,
      scheduleId,
      seatNumber: singleNum,
      deck: "lower",
      tier: "sleeper",
      row: r,
      col: 1,
      price: basePrice + 100, // single berth premium
      status: isBooked ? "booked" : isFemale ? "female_only" : "available",
      bookedByGender: isBooked ? "male" : undefined,
    });

    // Double Berths (Right: col 2, 3)
    const doubleLeft = `L${r}B`;
    const doubleRight = `L${r}C`;
    const isLeftBooked = r === 3;
    const isRightBooked = r === 3;

    seats.push({
      id: `${scheduleId}-${doubleLeft}`,
      scheduleId,
      seatNumber: doubleLeft,
      deck: "lower",
      tier: "sleeper",
      row: r,
      col: 2,
      price: basePrice,
      status: isLeftBooked ? "booked" : "available",
      bookedByGender: isLeftBooked ? "female" : undefined,
    });

    seats.push({
      id: `${scheduleId}-${doubleRight}`,
      scheduleId,
      seatNumber: doubleRight,
      deck: "lower",
      tier: "sleeper",
      row: r,
      col: 3,
      price: basePrice,
      status: isRightBooked ? "booked" : "available",
      bookedByGender: isRightBooked ? "female" : undefined,
    });
  }

  // Upper Deck: 15 seats (5 rows x 3 berths)
  const upperRows = 5;
  for (let r = 1; r <= upperRows; r++) {
    // Single Berth (Left: col 1)
    const singleNum = `U${r}A`;
    const isBooked = (r === 1 && scheduleId.includes("vrl")) || r === 5;

    seats.push({
      id: `${scheduleId}-${singleNum}`,
      scheduleId,
      seatNumber: singleNum,
      deck: "upper",
      tier: "sleeper",
      row: r,
      col: 1,
      price: basePrice + 150,
      status: isBooked ? "booked" : "available",
    });

    // Double Berths (Right: col 2, 3)
    const doubleLeft = `U${r}B`;
    const doubleRight = `U${r}C`;
    const isBookedPair = r === 2;

    seats.push({
      id: `${scheduleId}-${doubleLeft}`,
      scheduleId,
      seatNumber: doubleLeft,
      deck: "upper",
      tier: "sleeper",
      row: r,
      col: 2,
      price: basePrice + 50,
      status: isBookedPair ? "booked" : "available",
    });

    seats.push({
      id: `${scheduleId}-${doubleRight}`,
      scheduleId,
      seatNumber: doubleRight,
      deck: "upper",
      tier: "sleeper",
      row: r,
      col: 3,
      price: basePrice + 50,
      status: isBookedPair ? "booked" : "available",
    });
  }

  return seats;
}
