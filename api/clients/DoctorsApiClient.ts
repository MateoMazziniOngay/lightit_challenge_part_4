import { ApiEndpoints } from "../../constants/api-endpoints";
import { Doctor, DoctorAvailability } from "../models/doctor.model";
import { BaseApiClient } from "./BaseApiClient";
import { APIRequestContext } from "@playwright/test";

export class DoctorsApiClient extends BaseApiClient {
  constructor(request: APIRequestContext, token: string) {
    super(request, token);
  }

  async getDoctors(): Promise<Doctor[]> {
    const doctors = await this.get<Doctor[]>(ApiEndpoints.DOCTORS);

    if (!Array.isArray(doctors)) {
      throw new Error("Expected GET /api/doctors to return an array.");
    }

    return doctors;
  }

  async getDoctorById(id: number): Promise<Doctor> {
    return this.get<Doctor>(ApiEndpoints.doctorById(id));
  }

  async getDoctorAvailability(id: number): Promise<DoctorAvailability> {
    const availability = await this.get<DoctorAvailability>(
      ApiEndpoints.doctorAvailability(id),
    );

    if (!Array.isArray(availability.time_slots)) {
      throw new Error(
        `Expected doctor ${id} availability response to include a time_slots array.`,
      );
    }

    return availability;
  }

  async getFirstDoctorWithAvailability(): Promise<{
    doctor: Doctor;
    timeSlot: string;
  }> {
    const doctors = await this.getDoctors();

    for (const doctor of doctors) {
      const availability = await this.getDoctorAvailability(doctor.id);
      const timeSlot = availability.time_slots[0];

      if (timeSlot) {
        return { doctor, timeSlot };
      }
    }

    throw new Error("No doctor with available time slots was found.");
  }

  async getDifferentTimeSlot(
    doctorId: number,
    currentSlot: string,
  ): Promise<string> {
    const availability = await this.getDoctorAvailability(doctorId);
    const differentSlot = availability.time_slots.find(
      (slot) => slot !== currentSlot,
    );

    if (!differentSlot) {
      throw new Error(
        `No alternate time slot found for doctor ${doctorId}. Current slot: ${currentSlot}`,
      );
    }

    return differentSlot;
  }
}
