import { MOCK_TRAIN_SCHEDULES } from "@/lib/data/mockTrains";
import { TrainSchedule } from "@/types";

export class TrainService {
  /**
   * Search trains by origin and destination
   */
  static searchTrains(from: string, to: string): TrainSchedule[] {
    const fromLower = from.toLowerCase().trim();
    const toLower = to.toLowerCase().trim();

    return MOCK_TRAIN_SCHEDULES.filter((train) => {
      const matchFrom =
        train.fromCity.toLowerCase().includes(fromLower) ||
        train.fromStation.toLowerCase().includes(fromLower);
      const matchTo =
        train.toCity.toLowerCase().includes(toLower) ||
        train.toStation.toLowerCase().includes(toLower);

      return matchFrom || matchTo;
    });
  }

  /**
   * Verify simulated 10-digit PNR status
   */
  static checkPnrStatus(pnrNumber: string): {
    pnr: string;
    trainNumber: string;
    trainName: string;
    coach: string;
    berth: string;
    status: "CONFIRMED" | "RAC" | "WL";
    chartStatus: "PREPARED" | "NOT_PREPARED";
  } {
    const cleanPnr = pnrNumber.trim();
    return {
      pnr: cleanPnr,
      trainNumber: "12115",
      trainName: "Siddheshwar Express",
      coach: "B2",
      berth: "34 (Side Lower)",
      status: "CONFIRMED",
      chartStatus: "PREPARED",
    };
  }
}
