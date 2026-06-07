import { expect, Page } from "@playwright/test";
import { PageTexts } from "../constants/page-texts";
import { BasePage } from "./BasePage";

export interface BookAppointmentInput {
  doctorNameOrId: string | number;
  date: string;
  timeSlot: string;
  notes?: string;
}

export class BookAppointmentPage extends BasePage {
  private get doctorField() {
    return this.page.locator("#doctor_id");
  }

  private get dateField() {
    return this.page.locator("#appointment_date");
  }

  private get timeSlotField() {
    return this.page.locator("#time_slot");
  }

  private get notesField() {
    return this.page.locator("#notes");
  }

  private get submitButton() {
    return this.page.getByTestId("submit-appointment");
  }

  private get appointmentSuccessContainer() {
    return this.page.getByTestId("appointment-success");
  }

  private get appointmentSuccessTitle() {
    return this.appointmentSuccessContainer.getByRole("heading", {
      name: PageTexts.BOOK_APPOINTMENT.SUCCESS_TITLE,
    });
  }

  private get appointmentSuccessMessage() {
    return this.appointmentSuccessContainer.getByText(
      PageTexts.BOOK_APPOINTMENT.SUCCESS_MESSAGE,
    );
  }

  private get viewAppointmentsButton() {
    return this.appointmentSuccessContainer.getByRole("button", {
      name: PageTexts.BOOK_APPOINTMENT.VIEW_APPOINTMENTS,
    });
  }

  constructor(page: Page) {
    super(page);
  }

  async selectDoctor(doctorNameOrId: string | number): Promise<void> {
    const doctorValue = String(doctorNameOrId);

    await this.doctorField.selectOption(doctorValue).catch(async () => {
      await this.doctorField.selectOption({ label: doctorValue });
    });
  }

  async selectDate(date: string): Promise<void> {
    await this.dateField.fill(date);
  }

  async selectTimeSlot(slot: string): Promise<void> {
    await this.timeSlotField.selectOption(slot).catch(async () => {
      await this.timeSlotField.selectOption({ label: slot });
    });
  }

  async fillNotes(notes: string): Promise<void> {
    await this.notesField.fill(notes);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
    await this.page.waitForLoadState("networkidle");
  }

  async expectAppointmentSuccessVisible(): Promise<void> {
    await expect(this.appointmentSuccessContainer).toBeVisible();
    await expect(this.appointmentSuccessTitle).toBeVisible();
    await expect(this.appointmentSuccessMessage).toBeVisible();
    await expect(this.viewAppointmentsButton).toBeVisible();
  }

  async viewAppointments(): Promise<void> {
    await this.viewAppointmentsButton.click();
    await this.waitForPageReady();
  }

  async bookAppointment(input: BookAppointmentInput): Promise<void> {
    await this.selectDoctor(input.doctorNameOrId);
    await this.selectDate(input.date);
    await this.selectTimeSlot(input.timeSlot);

    if (input.notes) {
      await this.fillNotes(input.notes);
    }

    await this.submit();
  }
}
