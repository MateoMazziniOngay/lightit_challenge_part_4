import { ApiEndpoints } from "../../constants/api-endpoints";
import {
  Appointment,
  CreateAppointmentRequest,
  RescheduleAppointmentRequest,
} from "../models/appointment.model";
import { BaseApiClient } from "./BaseApiClient";
import { APIRequestContext } from "@playwright/test";

export class AppointmentsApiClient extends BaseApiClient {
  constructor(request: APIRequestContext, token: string) {
    super(request, token);
  }

  async getAppointments(): Promise<Appointment[]> {
    const appointments = await this.get<Appointment[]>(
      ApiEndpoints.APPOINTMENTS,
    );

    if (!Array.isArray(appointments)) {
      throw new Error("Expected GET /api/appointments to return an array.");
    }

    return appointments;
  }

  async createAppointment(
    payload: CreateAppointmentRequest,
  ): Promise<Appointment> {
    return this.post<Appointment>(ApiEndpoints.APPOINTMENTS, payload);
  }

  async getAppointmentById(id: number): Promise<Appointment> {
    return this.get<Appointment>(ApiEndpoints.appointmentById(id));
  }

  async rescheduleAppointment(
    id: number,
    payload: RescheduleAppointmentRequest,
  ): Promise<void> {
    // The backend can return stale appointment_date/time_slot values here; tests validate persisted state via GET.
    await this.put<unknown>(ApiEndpoints.rescheduleAppointment(id), payload);
  }

  async cancelAppointment(id: number): Promise<void> {
    await this.put<unknown>(ApiEndpoints.cancelAppointment(id));
  }

  async deleteAppointment(id: number): Promise<void> {
    await this.delete(ApiEndpoints.appointmentById(id));
  }
}
