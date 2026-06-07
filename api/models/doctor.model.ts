export interface Doctor {
  id: number;
  name?: string;
  first_name?: string;
  last_name?: string;
  specialty?: string;
  specialization?: string;
  is_active?: boolean;
  consultation_fee?: number;
}

export interface DoctorAvailability {
  time_slots: string[];
}

export function getDoctorDisplayName(doctor: Doctor): string {
  if (doctor.name) {
    return doctor.name;
  }

  const composedName = [doctor.first_name, doctor.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  if (composedName.length > 0) {
    return composedName;
  }

  return String(doctor.id);
}
