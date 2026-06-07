# Medical Appointments UI Automation

Playwright + TypeScript UI automation for a medical appointment management web app. The suite covers three patient E2E flows:

- Book an appointment
- Reschedule an appointment
- Cancel an appointment

The flows are performed and validated through the UI. Playwright's native `APIRequestContext` is used for setup data, supporting data, and cleanup.

## Tech Stack

- Playwright
- TypeScript
- dotenv
- Page Object Model
- Typed API clients using Playwright `APIRequestContext`

## Folder Structure

```text
ui-automation/
  tests/appointments/       Appointment E2E spec
  pages/                    Page Object Model classes
  api/clients/              Typed API clients
  api/models/               API request/response interfaces
  fixtures/                 Playwright fixtures for pages, auth, and API clients
  test-data/                Dynamic test data helpers
  utils/                    Environment and date helpers
  constants/                UI routes and API endpoint constants
```

## Prerequisites

- Node.js 18 or newer
- npm
- The target application and API must be reachable from the test machine
- A valid patient account for UI and API authentication

## Environment Setup

Create a local `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Set the required values:

```env
BASE_URL=http://localhost:3000
API_BASE_URL=http://localhost:3000
PATIENT_EMAIL=patient@example.com
PATIENT_PASSWORD="change-me"
DEFAULT_APPOINTMENT_NOTES=Created by Playwright UI automation
```

`BASE_URL`, `API_BASE_URL`, `PATIENT_EMAIL`, and `PATIENT_PASSWORD` are required. The test run fails fast with a clear error if any required variable is missing.

Wrap values in quotes when they contain special characters such as `#`.

## Install Dependencies

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

## Run Tests

Run all tests:

```bash
npm test
```

Run only appointment tests:

```bash
npx playwright test tests/appointments
```

Run in headed mode:

```bash
npm run test:headed
```

Run with Playwright UI mode:

```bash
npm run test:ui
```

Debug tests:

```bash
npm run test:debug
```

Open the HTML report:

```bash
npm run report
```

## Authentication

Authentication is handled by an automatic Playwright fixture in `fixtures/test.fixture.ts`. Before each test, the fixture logs in through the UI with the configured patient credentials and verifies the dashboard is loaded.

This keeps the test run simple: there is no separate auth setup command and no stored browser state file to manage.

## API Usage And Cleanup

Tests create prerequisite data with API clients, register created appointment IDs in the `createdAppointmentIds` fixture, and delete those appointments during teardown even if a test fails.

API calls are used to:

- Authenticate API clients.
- Get doctors and availability.
- Create appointments needed for reschedule and cancel setup.
- Find the UI-created booking so it can be registered for cleanup.
- Delete created appointments after each test.

The E2E assertions are UI-facing:

- Book flow validates the booking success container and the appointment card.
- Reschedule flow validates the reschedule success banner and updated appointment card.
- Cancel flow validates the cancellation success banner and cancelled status on the appointment card.

## Known Backend Issue

`PUT /api/appointments/{id}/reschedule` may return stale `appointment_date` or `time_slot` values. The UI test does not assert the `PUT` response body; it validates the reschedule result through the rendered appointment card.

## Known UI Date Issue

The UI date format itself is acceptable. The issue is that the appointment list may show one calendar day earlier than the date the patient selected. For example, if the patient books `2026-06-14`, the appointment card may display `6/13/2026`.

This commonly happens when the frontend parses a date-only value like `YYYY-MM-DD` with `new Date(dateString)` and then formats it in local time. JavaScript interprets that value as midnight UTC, which can shift the displayed day backward in US timezones.

The tests intentionally expect the same calendar date selected by the patient, displayed in the app's current US-style `M/D/YYYY` format. If the UI displays the previous day, the affected test should fail and can be reported as a timezone/date parsing bug.
