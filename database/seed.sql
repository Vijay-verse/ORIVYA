-- ==============================================================================
-- ORIVYA — DATABASE SEED SCRIPT
-- ==============================================================================
-- Populates the PostgreSQL database with realistic inventory, operators,
-- buses, seats, trains, hotels, cabs, seed bookings, and master trips.
-- ==============================================================================

-- 1. Default Demo Profile
INSERT INTO profiles (id, user_id, email, full_name, phone, avatar_url, role, wallet_balance)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'vijay.traveler@example.com',
    'Vijay Sharma',
    '+91 98765 43210',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    'traveller',
    1500.00
) ON CONFLICT (id) DO NOTHING;

-- 2. Bus Operators
INSERT INTO bus_operators (id, name, code, logo_text, rating, total_reviews)
VALUES 
    ('b0000000-0000-0000-0000-000000000001', 'VRL Travels', 'VRL', 'VRL', 4.80, 1420),
    ('b0000000-0000-0000-0000-000000000002', 'Neeta Travels', 'NEETA', 'NEETA', 4.40, 980),
    ('b0000000-0000-0000-0000-000000000003', 'IntrCity SmartBus', 'SMART', 'SMART', 4.70, 2150),
    ('b0000000-0000-0000-0000-000000000004', 'Zingbus Plus', 'ZING', 'ZING', 4.60, 870)
ON CONFLICT (id) DO NOTHING;

-- 3. Buses
INSERT INTO buses (id, operator_id, bus_number, bus_type, total_seats, has_wifi, has_ac, amenities)
VALUES
    ('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'MH 12 QX 4920', 'AC Sleeper (2+1)', 30, true, true, ARRAY['Wi-Fi', 'Charging Port', 'Blanket & Pillow', 'Reading Light', 'Live GPS']),
    ('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'MH 14 BG 7102', 'AC Sleeper (2+1)', 30, false, true, ARRAY['Charging Port', 'Blanket', 'Water Bottle', 'Emergency Exit']),
    ('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 'KA 01 AJ 3391', 'BharatBenz Multi-Axle Luxury', 30, true, true, ARRAY['Smart Lounge Access', 'High-speed Wi-Fi', 'Clean Washroom Onboard', 'Snack Box'])
ON CONFLICT (id) DO NOTHING;

-- 4. Bus Trips (Pune to Goa)
INSERT INTO bus_trips (id, bus_id, from_city, to_city, departure_time, arrival_time, duration_text, trip_date, base_price, cancellation_policy)
VALUES
    ('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Pune', 'Goa', '21:30:00', '08:00:00', '10h 30m', '2026-10-02', 1299.00, 'Full refund 12h prior. 50% refund 6h prior.'),
    ('d0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 'Pune', 'Goa', '20:45:00', '07:15:00', '10h 30m', '2026-10-02', 1149.00, 'Standard cancellation: ₹150 deduction.'),
    ('d0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000003', 'Pune', 'Goa', '22:00:00', '08:30:00', '10h 30m', '2026-10-02', 1399.00, 'Instant wallet refund.')
ON CONFLICT (id) DO NOTHING;

-- 5. Bus Stops (Boarding & Dropping)
INSERT INTO bus_stops (id, bus_trip_id, stop_type, stop_time, location, landmark, sort_order)
VALUES
    (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000001', 'boarding', '21:30:00', 'Swargate', 'Near Laxmi Narayan Theater', 1),
    (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000001', 'boarding', '22:00:00', 'Katraj', 'Wonder City Bus Stop', 2),
    (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000001', 'boarding', '22:30:00', 'Wakad Hinjewadi Flyover', 'Under Bridge', 3),
    (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000001', 'dropping', '07:15:00', 'Mapusa', 'Taxi Stand', 1),
    (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000001', 'dropping', '07:45:00', 'Panaji', 'KTC Bus Stand', 2),
    (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000001', 'dropping', '08:00:00', 'Madgaon', 'Railway Station Gate 1', 3);

-- 6. Trains
INSERT INTO trains (id, train_number, train_name, from_city, to_city, from_station, to_station, departure_time, arrival_time, duration_text, pantry_available)
VALUES
    ('e0000000-0000-0000-0000-000000000001', '12115', 'Siddheshwar Express', 'Pune', 'Hyderabad', 'PUNE (Pune Jn)', 'HYB (Hyderabad Deccan)', '21:10:00', '10:30:00', '13h 20m', true),
    ('e0000000-0000-0000-0000-000000000002', '12780', 'Goa Express', 'Pune', 'Goa', 'PUNE (Pune Jn)', 'MAO (Madgaon Jn)', '16:35:00', '05:40:00', '13h 05m', true),
    ('e0000000-0000-0000-0000-000000000003', '12124', 'Deccan Queen Superfast', 'Pune', 'Mumbai', 'PUNE (Pune Jn)', 'CSMT (Mumbai CSMT)', '07:15:00', '10:25:00', '3h 10m', true)
ON CONFLICT (id) DO NOTHING;

-- 7. Hotels
INSERT INTO hotels (id, name, tagline, city, address, star_rating, guest_rating, review_count, hero_image, amenities, check_in_time, check_out_time, min_price_per_night)
VALUES
    ('f0000000-0000-0000-0000-000000000001', 'SeaView Beachfront Resort & Spa', 'Panoramic Arabian Sea vistas with private beach access & cabanas', 'Goa', 'Calangute Beach Road, North Goa, 403516', 5, 4.80, 642, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80', ARRAY['Infinity Swimming Pool', 'Complimentary Buffet Breakfast', 'High-speed Wi-Fi', 'Ayurvedic Spa'], '14:00', '11:00', 4500.00),
    ('f0000000-0000-0000-0000-000000000002', 'The Grand Regency & Convention Center', 'Contemporary 5-star luxury in the heart of Pune business corridor', 'Pune', 'Senapati Bapat Road, Shivajinagar, Pune, 411016', 5, 4.70, 890, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80', ARRAY['Rooftop Pool', 'Fine Dining', 'Fitness Center', 'Airport Transfer'], '14:00', '12:00', 5100.00)
ON CONFLICT (id) DO NOTHING;

-- 8. Cab Categories
INSERT INTO cab_types (id, category, title, model_example, capacity, base_fare, per_km_rate, estimated_price, eta_minutes, features)
VALUES
    (gen_random_uuid(), 'mini', 'ORIVYA Mini', 'WagonR, Indica, Tiago', 3, 80.00, 14.00, 320.00, 3, ARRAY['Pocket-friendly', 'AC']),
    (gen_random_uuid(), 'sedan', 'ORIVYA Sedan', 'Dzire, Etios, Aura', 4, 120.00, 18.00, 450.00, 5, ARRAY['Spacious Boot', 'Extra Legroom']),
    (gen_random_uuid(), 'suv', 'ORIVYA SUV Prime', 'Ertiga, Innova', 6, 180.00, 24.00, 650.00, 7, ARRAY['6 Passenger Seating', 'Great for Groups']),
    (gen_random_uuid(), 'premium', 'ORIVYA Premium Luxe', 'Camry, Octavia, BMW', 4, 300.00, 35.00, 900.00, 9, ARRAY['Chauffeur in Uniform', 'Leather Seats']);

-- 9. Master Trip Seed: Goa Vacation
INSERT INTO trips (id, user_id, trip_reference, title, destination, start_date, end_date, status)
VALUES (
    '10000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'ORV-TRIP-2026-001',
    'Goa Coastal Getaway',
    'Goa',
    '2026-10-02',
    '2026-10-05',
    'upcoming'
) ON CONFLICT (id) DO NOTHING;

-- 10. Master Trip Items
INSERT INTO trip_items (id, trip_id, item_type, title, subtitle, location, start_at, end_at, status, booking_ref, sort_order)
VALUES
    (gen_random_uuid(), '10000000-0000-0000-0000-000000000001', 'bus', 'VRL Travels (AC Sleeper 2+1)', 'Pune (Swargate) ➔ Goa (Panaji)', 'Swargate Terminal Gate 2', '2026-10-02 21:30:00+05:30', '2026-10-03 08:00:00+05:30', 'CONFIRMED', 'ORV-BUS-783421', 1),
    (gen_random_uuid(), '10000000-0000-0000-0000-000000000001', 'cab', 'Station / Terminal Transfer', 'Panaji KTC Stand ➔ SeaView Resort', 'Panaji Terminal Taxi Bay', '2026-10-03 08:15:00+05:30', '2026-10-03 09:00:00+05:30', 'SCHEDULED', 'ORV-CAB-112094', 2),
    (gen_random_uuid(), '10000000-0000-0000-0000-000000000001', 'hotel', 'SeaView Beachfront Resort & Spa', '3 Nights • Deluxe Ocean View Room', 'Calangute Beach Road, North Goa', '2026-10-03 14:00:00+05:30', '2026-10-06 11:00:00+05:30', 'CONFIRMED', 'ORV-HTL-559103', 3),
    (gen_random_uuid(), '10000000-0000-0000-0000-000000000001', 'bus', 'IntrCity SmartBus Return', 'Goa (Panaji) ➔ Pune (Wakad)', 'Panaji IntrCity SmartLounge', '2026-10-06 20:00:00+05:30', '2026-10-07 07:00:00+05:30', 'CONFIRMED', 'ORV-BUS-990234', 4);
