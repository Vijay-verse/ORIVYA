import { MOCK_CAB_OPTIONS, MOCK_DRIVERS } from "@/lib/data/mockCabs";
import { CabOption, CabDriver, CabRideStatus } from "@/types";

export class CabService {
  /**
   * Get dynamic vehicle quotes based on simulated distance
   */
  static getCabQuotes(estimatedKm: number = 18): CabOption[] {
    return MOCK_CAB_OPTIONS.map((cab) => {
      const calculatedPrice = Math.round(cab.baseFare + cab.perKmRate * estimatedKm);
      return {
        ...cab,
        estimatedPrice: calculatedPrice,
      };
    });
  }

  /**
   * Advance ride lifecycle state machine
   */
  static getNextRideState(current: CabRideStatus): {
    nextStatus: CabRideStatus;
    driver?: CabDriver;
    etaMessage: string;
  } {
    switch (current) {
      case "searching":
        return {
          nextStatus: "driver_assigned",
          driver: MOCK_DRIVERS[0],
          etaMessage: "Ramesh Pawar assigned • Maruti Dzire (GA 03 Z 8841)",
        };
      case "driver_assigned":
        return {
          nextStatus: "arriving",
          driver: MOCK_DRIVERS[0],
          etaMessage: "Driver 2.5 km away",
        };
      case "arriving":
        return {
          nextStatus: "in_trip",
          driver: MOCK_DRIVERS[0],
          etaMessage: "Trip Started • En route to destination",
        };
      case "in_trip":
      default:
        return {
          nextStatus: "completed",
          driver: MOCK_DRIVERS[0],
          etaMessage: "Trip Completed! Arrived at destination.",
        };
    }
  }
}
