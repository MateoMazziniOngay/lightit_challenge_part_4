import { expect, Locator, Page } from "@playwright/test";
import { PageTexts } from "../constants/page-texts";
import { Routes } from "../constants/routes";
import { formatAppointmentDateTime } from "../utils/date.utils";
import { BasePage } from "./BasePage";

export interface AppointmentListItemTarget {
  date: string;
  timeSlot: string;
  notes?: string;
}

export class AppointmentsPage extends BasePage {
  private get mainHeading() {
    return this.page.getByRole("heading", {
      name: PageTexts.APPOINTMENTS.HEADING,
      level: 1,
    });
  }

  private get bookAppointmentLink() {
    return this.page.locator('main a[href="/appointments/new"]', {
      hasText: PageTexts.APPOINTMENTS.BOOK_APPOINTMENT,
    });
  }

  private get appointmentCards() {
    return this.page.locator("main .space-y-sm > div");
  }

  private appointmentCard(target: AppointmentListItemTarget) {
    const card = this.appointmentCards.filter({
      hasText: formatAppointmentDateTime(target.date, target.timeSlot),
    });

    return (
      target.notes ? card.filter({ hasText: target.notes }) : card
    ).first();
  }

  private appointmentDateTime(card: Locator) {
    return card.locator("p.text-body-md").first();
  }

  private appointmentNotes(card: Locator) {
    return card.locator("p.text-label-md").first();
  }

  private appointmentStatus(card: Locator, status: string) {
    return card.getByText(new RegExp(`^${this.escapeRegExp(status)}$`, "i"));
  }

  private rescheduleButton(card: Locator) {
    return card.getByRole("button", {
      name: new RegExp(PageTexts.APPOINTMENTS.RESCHEDULE, "i"),
    });
  }

  private cancelButton(card: Locator) {
    return card.getByRole("button", {
      name: new RegExp(`^${PageTexts.APPOINTMENTS.CANCEL}$`, "i"),
    });
  }

  private rescheduleForm(card: Locator) {
    return card
      .locator("form")
      .filter({ hasText: PageTexts.APPOINTMENTS.CONFIRM });
  }

  private rescheduleDateInput(card: Locator) {
    return this.rescheduleForm(card).locator('input[type="date"]');
  }

  private rescheduleTimeSelect(card: Locator) {
    return this.rescheduleForm(card).locator("select");
  }

  private confirmRescheduleButton(card: Locator) {
    return this.rescheduleForm(card).getByRole("button", {
      name: PageTexts.APPOINTMENTS.CONFIRM,
    });
  }

  private get cancellationSuccessAlert() {
    return this.successAlert(PageTexts.APPOINTMENTS.CANCELLATION_SUCCESS);
  }

  private get rescheduleSuccessAlert() {
    return this.successAlert(PageTexts.APPOINTMENTS.RESCHEDULE_SUCCESS);
  }

  private successAlert(message: string) {
    return this.page.locator("main .bg-success-container", {
      has: this.page.getByText(message, { exact: true }),
    });
  }

  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.page.goto(Routes.APPOINTMENTS);
    await this.waitForPageReady();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.mainHeading).toBeVisible();
    await expect(this.bookAppointmentLink).toBeVisible();
  }

  async openBookAppointment(): Promise<void> {
    await this.bookAppointmentLink.click();
    await this.waitForPageReady();
  }

  async expectAppointmentVisible(
    target: AppointmentListItemTarget,
  ): Promise<void> {
    const card = this.appointmentCard(target);

    await expect(card).toBeVisible();
    await expect(this.appointmentDateTime(card)).toHaveText(
      formatAppointmentDateTime(target.date, target.timeSlot),
    );

    if (target.notes) {
      await expect(this.appointmentNotes(card)).toHaveText(target.notes);
    }
  }

  async expectAppointmentStatus(
    target: AppointmentListItemTarget,
    status: string,
  ): Promise<void> {
    await expect(
      this.appointmentStatus(this.appointmentCard(target), status),
    ).toBeVisible();
  }

  async openRescheduleForAppointment(
    target: AppointmentListItemTarget,
  ): Promise<void> {
    await this.goto();
    await this.rescheduleButton(this.appointmentCard(target)).click();
  }

  async rescheduleAppointment(
    target: AppointmentListItemTarget,
    date: string,
    timeSlot: string,
  ): Promise<void> {
    await this.openRescheduleForAppointment(target);

    const card = this.appointmentCard(target);
    await expect(this.rescheduleForm(card)).toBeVisible();
    await this.rescheduleDateInput(card).fill(date);
    await this.rescheduleTimeSelect(card).selectOption(timeSlot);
    await this.confirmRescheduleButton(card).click();
    await this.page.waitForLoadState("networkidle");
  }

  async cancelAppointment(target: AppointmentListItemTarget): Promise<void> {
    await this.goto();
    await this.cancelButton(this.appointmentCard(target)).click();
    await this.page.waitForLoadState("networkidle");
  }

  async expectCancellationSuccessMessage(): Promise<void> {
    await expect(this.cancellationSuccessAlert).toBeVisible();
  }

  async expectRescheduleSuccessMessage(): Promise<void> {
    await expect(this.rescheduleSuccessAlert).toBeVisible();
  }
}
