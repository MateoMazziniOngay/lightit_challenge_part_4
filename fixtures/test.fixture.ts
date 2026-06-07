import {
  APIRequestContext,
  request as playwrightRequest,
  test as base,
} from "@playwright/test";
import { AuthApiClient } from "../api/clients/AuthApiClient";
import { AppointmentsApiClient } from "../api/clients/AppointmentsApiClient";
import { DoctorsApiClient } from "../api/clients/DoctorsApiClient";
import { UsersApiClient } from "../api/clients/UsersApiClient";
import { AppointmentsPage } from "../pages/AppointmentsPage";
import { BookAppointmentPage } from "../pages/BookAppointmentPage";
import { DashboardPage } from "../pages/DashboardPage";
import { LoginPage } from "../pages/LoginPage";
import { testEnv } from "../utils/env.utils";

interface PageFixtures {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  appointmentsPage: AppointmentsPage;
  bookAppointmentPage: BookAppointmentPage;
}

interface ApiFixtures {
  authApi: AuthApiClient;
  usersApi: UsersApiClient;
  doctorsApi: DoctorsApiClient;
  appointmentsApi: AppointmentsApiClient;
  createdAppointmentIds: number[];
}

interface InternalFixtures {
  _authenticatedPatient: void;
  _apiContext: APIRequestContext;
  _authToken: string;
}

export const test = base.extend<PageFixtures & ApiFixtures & InternalFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  appointmentsPage: async ({ page }, use) => {
    await use(new AppointmentsPage(page));
  },
  bookAppointmentPage: async ({ page }, use) => {
    await use(new BookAppointmentPage(page));
  },
  _authenticatedPatient: [
    async ({ loginPage, dashboardPage }, use) => {
      await loginPage.goto();
      await loginPage.login(testEnv.PATIENT_EMAIL, testEnv.PATIENT_PASSWORD);
      await dashboardPage.expectLoaded();

      await use();
    },
    { auto: true },
  ],
  _apiContext: async ({}, use) => {
    const apiContext = await playwrightRequest.newContext({
      baseURL: testEnv.API_BASE_URL,
    });

    await use(apiContext);
    await apiContext.dispose();
  },
  authApi: async ({ _apiContext }, use) => {
    await use(new AuthApiClient(_apiContext));
  },
  _authToken: async ({ authApi }, use) => {
    const { token } = await authApi.login(
      testEnv.PATIENT_EMAIL,
      testEnv.PATIENT_PASSWORD,
    );
    await use(token);
  },
  usersApi: async ({ _apiContext, _authToken }, use) => {
    await use(new UsersApiClient(_apiContext, _authToken));
  },
  doctorsApi: async ({ _apiContext, _authToken }, use) => {
    await use(new DoctorsApiClient(_apiContext, _authToken));
  },
  appointmentsApi: async ({ _apiContext, _authToken }, use) => {
    await use(new AppointmentsApiClient(_apiContext, _authToken));
  },
  createdAppointmentIds: async ({ appointmentsApi }, use) => {
    const ids: number[] = [];

    await use(ids);

    for (const appointmentId of ids.reverse()) {
      await appointmentsApi
        .deleteAppointment(appointmentId)
        .catch((error: Error) => {
          console.warn(
            `Failed to delete appointment ${appointmentId}: ${error.message}`,
          );
        });
    }
  },
});

export { expect } from "@playwright/test";
