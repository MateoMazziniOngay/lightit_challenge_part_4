export function getFutureDate(daysFromToday: number): string {
  if (!Number.isInteger(daysFromToday) || daysFromToday <= 0) {
    throw new Error("daysFromToday must be a positive integer.");
  }

  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);

  return date.toISOString().split("T")[0];
}

export function normalizeApiDate(date: string): string {
  if (!date) {
    throw new Error("Cannot normalize an empty date value.");
  }

  return date.includes("T") ? date.split("T")[0] : date;
}

export function formatUiDate(date: string): string {
  const normalizedDate = normalizeApiDate(date);
  const [year, month, day] = normalizedDate.split("-");

  if (!year || !month || !day) {
    throw new Error(`Cannot format invalid API date for UI: ${date}`);
  }

  return `${Number(month)}/${Number(day)}/${year}`;
}

export function formatAppointmentDateTime(
  date: string,
  timeSlot: string,
): string {
  return `${formatUiDate(date)} • ${timeSlot}`;
}
