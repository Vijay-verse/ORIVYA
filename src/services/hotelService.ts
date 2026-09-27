import { MOCK_HOTEL_PROPERTIES } from "@/lib/data/mockHotels";
import { HotelProperty, HotelRoom } from "@/types";

export interface HotelAvailabilityResult {
  hotel: HotelProperty;
  room: HotelRoom;
  checkIn: string;
  checkOut: string;
  nightsCount: number;
  pricePerNight: number;
  roomSubtotal: number;
  taxAmount: number;
  totalPayable: number;
  isAvailable: boolean;
}

export class HotelService {
  /**
   * Search hotels by city destination
   */
  static searchHotels(city: string): HotelProperty[] {
    const cleanCity = city.toLowerCase().trim();
    return MOCK_HOTEL_PROPERTIES.filter((h) =>
      h.city.toLowerCase().includes(cleanCity)
    );
  }

  /**
   * Calculate date-overlap and server-side hospitality pricing
   */
  static checkAvailabilityAndPrice(params: {
    hotelId: string;
    roomId: string;
    checkIn: string;
    checkOut: string;
  }): HotelAvailabilityResult | null {
    const { hotelId, roomId, checkIn, checkOut } = params;

    const hotel = MOCK_HOTEL_PROPERTIES.find((h) => h.id === hotelId);
    if (!hotel) return null;

    const room = hotel.rooms.find((r) => r.id === roomId);
    if (!room) return null;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Calculate nights with minimum 1 night
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    const nightsCount = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)));

    const roomSubtotal = room.pricePerNight * nightsCount;
    const taxAmount = Math.round(roomSubtotal * 0.12); // 12% Hospitality GST
    const totalPayable = roomSubtotal + taxAmount;

    return {
      hotel,
      room,
      checkIn,
      checkOut,
      nightsCount,
      pricePerNight: room.pricePerNight,
      roomSubtotal,
      taxAmount,
      totalPayable,
      isAvailable: room.availableCount > 0,
    };
  }
}
