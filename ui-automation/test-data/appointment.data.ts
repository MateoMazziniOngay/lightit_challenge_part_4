import { randomUUID } from "crypto";
import { testEnv } from "../utils/env.utils";

export function buildAppointmentNotes(flowName: string): string {
  return `${testEnv.DEFAULT_APPOINTMENT_NOTES} - ${flowName} - ${new Date().toISOString()} - ${randomUUID()}`;
}
