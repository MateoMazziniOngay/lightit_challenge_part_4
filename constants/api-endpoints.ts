export const ApiEndpoints = {
  AUTH_LOGIN: "/api/auth/login",
  USERS_ME: "/api/users/me",
  DOCTORS: "/api/doctors",
  doctorById: (id: number): string => `/api/doctors/${id}`,
  doctorAvailability: (id: number): string => `/api/doctors/${id}/availability`,
  APPOINTMENTS: "/api/appointments",
  appointmentById: (id: number): string => `/api/appointments/${id}`,
  rescheduleAppointment: (id: number): string =>
    `/api/appointments/${id}/reschedule`,
  cancelAppointment: (id: number): string => `/api/appointments/${id}/cancel`,
} as const;
