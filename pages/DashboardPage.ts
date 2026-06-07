import { expect, Page } from "@playwright/test";
import { PageTexts } from "../constants/page-texts";
import { Routes } from "../constants/routes";
import { BasePage } from "./BasePage";

export class DashboardPage extends BasePage {
  private get mainHeading() {
    return this.page.locator("main h1");
  }

  private get appointmentsSidebarLink() {
    return this.page.locator('aside nav a[href="/appointments"]');
  }

  private get newAppointmentSidebarLink() {
    return this.page.locator('aside a[href="/appointments/new"]', {
      hasText: PageTexts.DASHBOARD.NEW_APPOINTMENT,
    });
  }

  private get upcomingAppointmentsCount() {
    return this.page.getByTestId("upcoming-count");
  }

  private get nextAppointmentDoctor() {
    return this.page.getByTestId("next-appointment-doctor");
  }

  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.page.goto(Routes.DASHBOARD);
    await this.waitForPageReady();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.mainHeading).toBeVisible();
    await expect(this.appointmentsSidebarLink).toBeVisible();
    await expect(this.newAppointmentSidebarLink).toBeVisible();
  }

  async goToAppointments(): Promise<void> {
    await this.appointmentsSidebarLink.click();
    await this.waitForPageReady();
  }

  async goToNewAppointment(): Promise<void> {
    await this.newAppointmentSidebarLink.click();
    await this.waitForPageReady();
  }

  async expectUpcomingAppointmentsCountVisible(): Promise<void> {
    await expect(this.upcomingAppointmentsCount).toBeVisible();
  }

  async expectNextAppointmentDoctorVisible(): Promise<void> {
    await expect(this.nextAppointmentDoctor).toBeVisible();
  }
}
