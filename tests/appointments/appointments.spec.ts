import { TestTexts } from "../../constants/test-texts";
import { PageTexts } from "../../constants/page-texts";
import { test } from "../../fixtures/test.fixture";
import { buildAppointmentNotes } from "../../test-data/appointment.data";
import { getFutureDate, normalizeApiDate } from "../../utils/date.utils";

test.describe("Appointments", () => {
  test("patient can book an appointment through the UI", async ({
    appointmentsPage,
    bookAppointmentPage,
    appointmentsApi,
    doctorsApi,
    createdAppointmentIds,
  }) => {
    const { doctor, timeSlot } =
      await doctorsApi.getFirstDoctorWithAvailability();
    const appointmentDate = getFutureDate(7);
    const notes = buildAppointmentNotes(TestTexts.APPOINTMENT_NOTE_FLOW.BOOK);

    await appointmentsPage.goto();
    await appointmentsPage.openBookAppointment();
    await bookAppointmentPage.bookAppointment({
      doctorNameOrId: doctor.id,
      date: appointmentDate,
      timeSlot,
      notes,
    });

    await bookAppointmentPage.expectAppointmentSuccessVisible();
    await bookAppointmentPage.viewAppointments();

    const appointments = await appointmentsApi.getAppointments();
    const createdAppointment = appointments.find(
      (appointment) =>
        appointment.doctor_id === doctor.id &&
        normalizeApiDate(appointment.appointment_date) === appointmentDate &&
        appointment.time_slot === timeSlot &&
        appointment.notes === notes,
    );

    if (createdAppointment) {
      createdAppointmentIds.push(createdAppointment.id);
    }

    await appointmentsPage.expectAppointmentVisible({
      date: appointmentDate,
      timeSlot,
      notes,
    });
  });

  test("patient can reschedule an appointment through the UI", async ({
    appointmentsPage,
    appointmentsApi,
    doctorsApi,
    createdAppointmentIds,
  }) => {
    const { doctor, timeSlot: originalTimeSlot } =
      await doctorsApi.getFirstDoctorWithAvailability();
    const originalDate = getFutureDate(8);
    const newDate = getFutureDate(15);
    const notes = buildAppointmentNotes(
      TestTexts.APPOINTMENT_NOTE_FLOW.RESCHEDULE,
    );
    const newTimeSlot = await doctorsApi.getDifferentTimeSlot(
      doctor.id,
      originalTimeSlot,
    );

    const appointment = await appointmentsApi.createAppointment({
      doctor_id: doctor.id,
      appointment_date: originalDate,
      time_slot: originalTimeSlot,
      notes,
    });
    createdAppointmentIds.push(appointment.id);

    await appointmentsPage.rescheduleAppointment(
      {
        date: originalDate,
        timeSlot: originalTimeSlot,
        notes,
      },
      newDate,
      newTimeSlot,
    );
    await appointmentsPage.expectRescheduleSuccessMessage();
    await appointmentsPage.goto();
    await appointmentsPage.expectAppointmentVisible({
      date: newDate,
      timeSlot: newTimeSlot,
      notes,
    });
  });

  test("patient can cancel an appointment through the UI", async ({
    appointmentsPage,
    appointmentsApi,
    doctorsApi,
    createdAppointmentIds,
  }) => {
    const { doctor, timeSlot } =
      await doctorsApi.getFirstDoctorWithAvailability();
    const appointmentDate = getFutureDate(10);
    const notes = buildAppointmentNotes(TestTexts.APPOINTMENT_NOTE_FLOW.CANCEL);

    const appointment = await appointmentsApi.createAppointment({
      doctor_id: doctor.id,
      appointment_date: appointmentDate,
      time_slot: timeSlot,
      notes,
    });
    createdAppointmentIds.push(appointment.id);

    await appointmentsPage.cancelAppointment({
      date: appointmentDate,
      timeSlot,
      notes,
    });
    await appointmentsPage.expectCancellationSuccessMessage();
    await appointmentsPage.expectAppointmentStatus(
      {
        date: appointmentDate,
        timeSlot,
        notes,
      },
      PageTexts.APPOINTMENTS.STATUS_CANCELLED,
    );
  });
});
