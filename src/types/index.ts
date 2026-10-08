export type ServiceType = "bus" | "train" | "hotel" | "cab";

// --- Bus Types ---
export interface BusOperator {
  id: string;
  name: string;
  logoText: string;
  rating: number;
  totalReviews: number;
}

export type BusTypeCategory = 
  | "AC Sleeper (2+1)" 
  | "AC Seater (2+2)" 
  | "Non-AC Sleeper (2+1)" 
  | "BharatBenz Multi-Axle Luxury";

export interface BusPoint {
  time: string;
  location: string;
  landmark: string;
}

export interface BusSchedule {
  id: string;
  operator: BusOperator;
  busNumber: string;
  busType: BusTypeCategory;
  fromCity: string;
  toCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  date: string;
  basePrice: number;
  rating: number;
  amenities: string[];
  boardingPoints: BusPoint[];
  droppingPoints: BusPoint[];
  cancellationPolicy: string;
  seatsAvailableCount: number;
  totalSeats: number;
}

export type SeatStatus = "available" | "selected" | "held" | "booked" | "female_only";
export type DeckType = "lower" | "upper";
export type SeatTier = "sleeper" | "seater";

export interface BusSeat {
  id: string;
  scheduleId: string;
  seatNumber: string;
  deck: DeckType;
  tier: SeatTier;
  row: number;
  col: number;
  price: number;
  status: SeatStatus;
  heldUntil?: number; // timestamp in ms
  heldBy?: string;
  bookedByGender?: "male" | "female";
}

// --- Train Types ---
export interface TrainClassOption {
  classCode: "1A" | "2A" | "3A" | "SL" | "CC";
  className: string;
  price: number;
  status: "AVAILABLE" | "RAC" | "WL";
  seatsCount: number;
}

export interface StationHalt {
  stationCode: string;
  stationName: string;
  arrivalTime: string;
  departureTime: string;
  distanceKm: number;
  day: number;
}

export interface TrainSchedule {
  id: string;
  trainNumber: string;
  trainName: string;
  fromStation: string;
  toStation: string;
  fromCity: string;
  toCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  daysOfRun: string[];
  classes: TrainClassOption[];
  halts: StationHalt[];
  pantryAvailable: boolean;
}

// --- Hotel Types ---
export interface HotelRoom {
  id: string;
  hotelId: string;
  name: string;
  description: string;
  pricePerNight: number;
  maxAdults: number;
  maxChildren: number;
  bedType: string;
  sizeSqFt: number;
  amenities: string[];
  availableCount: number;
  image: string;
}

export interface HotelProperty {
  id: string;
  name: string;
  tagline: string;
  city: string;
  address: string;
  starRating: number;
  guestRating: number;
  reviewCount: number;
  heroImage: string;
  images: string[];
  amenities: string[];
  checkInTime: string;
  checkOutTime: string;
  policies: string[];
  minPricePerNight: number;
  rooms: HotelRoom[];
}

// --- Cab Types ---
export type CabCategory = "mini" | "sedan" | "suv" | "premium";

export interface CabOption {
  id: string;
  category: CabCategory;
  title: string;
  modelExample: string;
  capacity: number;
  baseFare: number;
  perKmRate: number;
  estimatedPrice: number;
  etaMinutes: number;
  features: string[];
}

export interface CabDriver {
  name: string;
  vehicleModel: string;
  plateNumber: string;
  rating: number;
  ridesCompleted: number;
  phone: string;
  currentLat: number;
  currentLng: number;
}

export type CabRideStatus = 
  | "searching" 
  | "driver_assigned" 
  | "arriving" 
  | "in_trip" 
  | "completed";

// --- Passenger & Booking Entities ---
export interface Passenger {
  id: string;
  fullName: string;
  age: number;
  gender: "male" | "female" | "other";
  seatNumber?: string;
  berthPreference?: string;
  roomName?: string;
}

export type BookingStatus = "CONFIRMED" | "PENDING" | "CANCELLED" | "REFUNDED";
export type PaymentStatus = "PAID" | "PENDING" | "FAILED" | "REFUNDED";

export interface Booking {
  id: string;
  referenceNumber: string;
  userId: string;
  bookingType: ServiceType;
  tripId?: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  baseAmount: number;
  taxAmount: number;
  convenienceFee: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: "UPI" | "CREDIT_CARD" | "DEBIT_CARD" | "NET_BANKING" | "WALLET";
  transactionReference?: string;
  createdAt: string;
  contactEmail: string;
  contactPhone: string;
  passengers: Passenger[];
  // polymorphic details based on bookingType
  details: {
    transactionReference?: string;
    // For bus:
    busSchedule?: BusSchedule;
    seats?: string[];
    boardingPoint?: BusPoint;
    droppingPoint?: BusPoint;
    
    // For train:
    trainSchedule?: TrainSchedule;
    selectedClass?: string;
    pnrNumber?: string;
    
    // For hotel:
    hotel?: HotelProperty;
    room?: HotelRoom;
    checkInDate?: string;
    checkOutDate?: string;
    nightsCount?: number;
    roomsCount?: number;
    
    // For cab:
    cab?: CabOption;
    pickupLocation?: string;
    dropLocation?: string;
    pickupTime?: string;
    driver?: CabDriver;
    rideStatus?: CabRideStatus;
  };
}

// --- Unified Trip Timeline ---
export interface TripItem {
  id: string;
  tripId: string;
  bookingId: string;
  itemType: ServiceType;
  title: string;
  subtitle: string;
  location: string;
  startTime: string; // ISO date-time or formatted
  endTime: string;
  status: "CONFIRMED" | "SCHEDULED" | "CHECKED_IN" | "COMPLETED" | "CANCELLED";
  bookingRef: string;
  detailsSummary: string;
}

export interface Trip {
  id: string;
  userId: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: "upcoming" | "in_progress" | "completed" | "cancelled";
  createdAt: string;
  items: TripItem[];
}

// --- User & Profile Types ---
export type UserRole = "traveller" | "admin" | "operator";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: UserRole;
  walletBalance: number;
}

