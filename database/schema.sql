-- ==============================================================================
-- ORIVYA — CANONICAL POSTGRESQL SCHEMA SPECIFICATION
-- ==============================================================================
-- Modular Monolith Architecture for Multi-Modal Travel Booking & Trip Management
-- Covers: Profiles, Bus, Train, Hotel, Cab, Universal Bookings, Trip Engine,
-- Payments, Refunds, Notifications, Reviews, Coupons, and Atomic Seat Locking.
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. ENUMS & DOMAINS
-- ==============================================================================
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('traveller', 'admin', 'operator');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE booking_service_type AS ENUM ('bus', 'train', 'hotel', 'cab');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM (
        'pending', 
        'payment_pending', 
        'confirmed', 
        'cancel_requested', 
        'cancelled', 
        'completed', 
        'refund_processing', 
        'refunded', 
        'failed', 
        'expired'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE seat_deck AS ENUM ('lower', 'upper');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE seat_tier AS ENUM ('sleeper', 'seater');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE seat_status AS ENUM ('available', 'held', 'booked', 'blocked');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE cab_category AS ENUM ('mini', 'sedan', 'suv', 'premium');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE cab_ride_status AS ENUM (
        'searching', 
        'driver_assigned', 
        'cab_arriving', 
        'in_trip', 
        'completed', 
        'cancelled'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- 2. USER PROFILES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE, -- Foreign key to auth.users in Supabase
    email TEXT,
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'traveller',
    wallet_balance NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (wallet_balance >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 3. BUS INVENTORY & SEAT TOPOLOGY
-- ==============================================================================
CREATE TABLE IF NOT EXISTS bus_operators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    logo_text TEXT NOT NULL,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 4.50 CHECK (rating >= 1.0 AND rating <= 5.0),
    total_reviews INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS buses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operator_id UUID NOT NULL REFERENCES bus_operators(id) ON DELETE CASCADE,
    bus_number TEXT NOT NULL UNIQUE,
    bus_type TEXT NOT NULL, -- e.g. 'AC Sleeper (2+1)', 'BharatBenz Luxury'
    total_seats INT NOT NULL DEFAULT 30,
    has_wifi BOOLEAN NOT NULL DEFAULT true,
    has_ac BOOLEAN NOT NULL DEFAULT true,
    amenities TEXT[] DEFAULT ARRAY['Charging Port', 'Blanket', 'Water Bottle', 'Reading Light'],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bus_trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bus_id UUID NOT NULL REFERENCES buses(id) ON DELETE CASCADE,
    from_city TEXT NOT NULL,
    to_city TEXT NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    duration_text TEXT NOT NULL,
    trip_date DATE NOT NULL,
    base_price NUMERIC(10, 2) NOT NULL CHECK (base_price > 0),
    cancellation_policy TEXT NOT NULL DEFAULT 'Free cancellation up to 12 hours prior to departure.',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bus_stops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bus_trip_id UUID NOT NULL REFERENCES bus_trips(id) ON DELETE CASCADE,
    stop_type TEXT NOT NULL CHECK (stop_type IN ('boarding', 'dropping')),
    stop_time TIME NOT NULL,
    location TEXT NOT NULL,
    landmark TEXT,
    sort_order INT NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS bus_seats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bus_trip_id UUID NOT NULL REFERENCES bus_trips(id) ON DELETE CASCADE,
    seat_number TEXT NOT NULL,
    deck seat_deck NOT NULL,
    tier seat_tier NOT NULL,
    row_num INT NOT NULL,
    col_num INT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
    is_female_reserved BOOLEAN NOT NULL DEFAULT false,
    status seat_status NOT NULL DEFAULT 'available',
    hold_token TEXT,
    hold_expires_at TIMESTAMPTZ,
    booking_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_bus_trip_seat UNIQUE (bus_trip_id, seat_number)
);

-- ==============================================================================
-- 4. TRAIN SYSTEM
-- ==============================================================================
CREATE TABLE IF NOT EXISTS trains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    train_number TEXT NOT NULL UNIQUE,
    train_name TEXT NOT NULL,
    from_city TEXT NOT NULL,
    to_city TEXT NOT NULL,
    from_station TEXT NOT NULL,
    to_station TEXT NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    duration_text TEXT NOT NULL,
    days_of_run TEXT[] NOT NULL DEFAULT ARRAY['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    pantry_available BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS train_classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    train_id UUID NOT NULL REFERENCES trains(id) ON DELETE CASCADE,
    class_code TEXT NOT NULL, -- e.g. '1A', '2A', '3A', 'SL', 'CC'
    class_name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
    quota_status TEXT NOT NULL DEFAULT 'AVAILABLE', -- 'AVAILABLE', 'RAC', 'WL'
    available_count INT NOT NULL DEFAULT 20,
    CONSTRAINT unique_train_class UNIQUE (train_id, class_code)
);

CREATE TABLE IF NOT EXISTS train_halts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    train_id UUID NOT NULL REFERENCES trains(id) ON DELETE CASCADE,
    station_code TEXT NOT NULL,
    station_name TEXT NOT NULL,
    arrival_time TEXT NOT NULL,
    departure_time TEXT NOT NULL,
    distance_km INT NOT NULL DEFAULT 0,
    day_num INT NOT NULL DEFAULT 1,
    sort_order INT NOT NULL DEFAULT 1
);

-- ==============================================================================
-- 5. HOTEL INVENTORY & ROOM TIERS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS hotels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    tagline TEXT,
    city TEXT NOT NULL,
    address TEXT NOT NULL,
    star_rating INT NOT NULL CHECK (star_rating BETWEEN 1 AND 5),
    guest_rating NUMERIC(3, 2) NOT NULL DEFAULT 4.5 CHECK (guest_rating BETWEEN 1 AND 5),
    review_count INT NOT NULL DEFAULT 0,
    hero_image TEXT NOT NULL,
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    amenities TEXT[] DEFAULT ARRAY[]::TEXT[],
    check_in_time TEXT NOT NULL DEFAULT '14:00',
    check_out_time TEXT NOT NULL DEFAULT '11:00',
    min_price_per_night NUMERIC(10, 2) NOT NULL CHECK (min_price_per_night > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hotel_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price_per_night NUMERIC(10, 2) NOT NULL CHECK (price_per_night > 0),
    max_adults INT NOT NULL DEFAULT 2,
    max_children INT NOT NULL DEFAULT 1,
    bed_type TEXT NOT NULL DEFAULT '1 King Bed',
    size_sq_ft INT NOT NULL DEFAULT 350,
    amenities TEXT[] DEFAULT ARRAY[]::TEXT[],
    total_inventory INT NOT NULL DEFAULT 5,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hotel_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES hotel_rooms(id) ON DELETE CASCADE,
    inventory_date DATE NOT NULL,
    booked_count INT NOT NULL DEFAULT 0,
    hold_count INT NOT NULL DEFAULT 0,
    CONSTRAINT unique_room_date UNIQUE (room_id, inventory_date)
);

-- ==============================================================================
-- 6. CAB MOBILITY SYSTEM
-- ==============================================================================
CREATE TABLE IF NOT EXISTS cab_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category cab_category NOT NULL UNIQUE,
    title TEXT NOT NULL,
    model_example TEXT NOT NULL,
    capacity INT NOT NULL DEFAULT 4,
    base_fare NUMERIC(10, 2) NOT NULL CHECK (base_fare > 0),
    per_km_rate NUMERIC(10, 2) NOT NULL CHECK (per_km_rate > 0),
    estimated_price NUMERIC(10, 2) NOT NULL,
    eta_minutes INT NOT NULL DEFAULT 5,
    features TEXT[] DEFAULT ARRAY[]::TEXT[]
);

CREATE TABLE IF NOT EXISTS cab_drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    vehicle_model TEXT NOT NULL,
    plate_number TEXT NOT NULL UNIQUE,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 4.8,
    rides_completed INT NOT NULL DEFAULT 0,
    phone TEXT NOT NULL,
    current_lat NUMERIC(9, 6),
    current_lng NUMERIC(9, 6),
    status TEXT NOT NULL DEFAULT 'available'
);

-- ==============================================================================
-- 7. MASTER TRIPS (UNIFIED TRIP ENGINE)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    trip_reference TEXT NOT NULL UNIQUE, -- e.g. 'ORV-TRIP-2026-001'
    title TEXT NOT NULL,
    destination TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 8. UNIVERSAL BOOKINGS ENGINE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    booking_reference TEXT NOT NULL UNIQUE, -- e.g. 'ORV-BUS-783421'
    booking_type booking_service_type NOT NULL,
    trip_id UUID REFERENCES trips(id) ON DELETE SET NULL,
    status booking_status NOT NULL DEFAULT 'pending',
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    tax_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (tax_amount >= 0),
    fee_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (fee_amount >= 0),
    discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (discount_amount >= 0),
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    payment_status payment_status NOT NULL DEFAULT 'pending',
    payment_method TEXT NOT NULL DEFAULT 'UPI',
    travel_start TIMESTAMPTZ,
    travel_end TIMESTAMPTZ,
    contact_email TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS booking_passengers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    age INT NOT NULL CHECK (age BETWEEN 1 AND 120),
    gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
    seat_number TEXT,
    berth_preference TEXT,
    phone TEXT,
    email TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trip_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    item_type booking_service_type NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    location TEXT NOT NULL,
    start_at TIMESTAMPTZ NOT NULL,
    end_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'CONFIRMED',
    booking_ref TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 1,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 9. PAYMENTS & REFUNDS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    transaction_reference TEXT NOT NULL UNIQUE,
    provider TEXT NOT NULL DEFAULT 'mock', -- 'mock', 'razorpay'
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    status TEXT NOT NULL DEFAULT 'PAID', -- 'PENDING', 'PAID', 'FAILED'
    payment_method TEXT NOT NULL DEFAULT 'UPI',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS refunds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
    requested_amount NUMERIC(10, 2) NOT NULL,
    fee_amount NUMERIC(10, 2) NOT NULL DEFAULT 150.00,
    refund_amount NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'completed', -- 'requested', 'processing', 'completed', 'failed'
    reason TEXT NOT NULL DEFAULT 'Customer requested cancellation',
    processed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 10. NOTIFICATIONS, REVIEWS, COUPONS & AUDIT LOGS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'booking_confirmed',
    is_read BOOLEAN NOT NULL DEFAULT false,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'flat')),
    discount_value NUMERIC(10, 2) NOT NULL CHECK (discount_value > 0),
    min_order_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    max_discount NUMERIC(10, 2),
    valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    valid_until TIMESTAMPTZ NOT NULL,
    usage_limit INT DEFAULT 1000,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    service_type booking_service_type NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 11. INDEXES FOR HIGH-PERFORMANCE SEARCH & TIMELINE COMPILATION
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_bus_trips_route ON bus_trips(from_city, to_city, trip_date);
CREATE INDEX IF NOT EXISTS idx_bus_seats_status ON bus_seats(bus_trip_id, status);
CREATE INDEX IF NOT EXISTS idx_trains_route ON trains(from_city, to_city);
CREATE INDEX IF NOT EXISTS idx_hotels_city ON hotels(city);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_ref ON bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_trip_items_timeline ON trip_items(trip_id, start_at ASC);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read, created_at DESC);

-- ==============================================================================
-- 12. ATOMIC SEAT LOCKING FUNCTION (5-MINUTE LEASE)
-- ==============================================================================
CREATE OR REPLACE FUNCTION hold_bus_seat_atomic(
    p_bus_trip_id UUID,
    p_seat_number TEXT,
    p_hold_token TEXT,
    p_hold_minutes INT DEFAULT 5
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    v_rows_affected INT;
BEGIN
    -- Atomically lease seat if available OR previously held but expired
    UPDATE bus_seats
    SET 
        status = 'held',
        hold_token = p_hold_token,
        hold_expires_at = NOW() + (INTERVAL '1 minute' * p_hold_minutes),
        updated_at = NOW()
    WHERE bus_trip_id = p_bus_trip_id
      AND seat_number = p_seat_number
      AND (
          status = 'available' 
          OR (status = 'held' AND hold_expires_at < NOW())
      );

    GET DIAGNOSTICS v_rows_affected = ROW_COUNT;
    RETURN v_rows_affected > 0;
END;
$$;
