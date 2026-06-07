import { AppointmentStatuses } from "../../constants/appointment-statuses";
import { Doctor } from "./doctor.model";
import { User } from "./user.model";

export type AppointmentStatus =
  (typeof AppointmentStatuses)[keyof typeof AppointmentStatuses];

export interface Appointment {
  id: number;
  doctor_id: number;
  patient_id?: number;
  appointment_date: string;
  time_slot: string;
  notes?: string;
  status: AppointmentStatus;
  doctor?: Doctor;
  patient?: User;
}

export interface CreateAppointmentRequest {
  doctor_id: number;
  appointment_date: string;
  time_slot: string;
  notes?: string;
}

export interface RescheduleAppointmentRequest {
  appointment_date: string;
  time_slot: string;
}
