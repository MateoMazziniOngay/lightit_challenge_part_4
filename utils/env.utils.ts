import { config } from "dotenv";

config();

const requiredEnvVars = [
  "BASE_URL",
  "API_BASE_URL",
  "PATIENT_EMAIL",
  "PATIENT_PASSWORD",
] as const;

export type RequiredEnvVar = (typeof requiredEnvVars)[number];

export interface TestEnvironment {
  BASE_URL: string;
  API_BASE_URL: string;
  PATIENT_EMAIL: string;
  PATIENT_PASSWORD: string;
  DEFAULT_APPOINTMENT_NOTES: string;
}

function readRequiredEnv(name: RequiredEnvVar): string {
  const value = process.env[name];

  if (!value || value.trim().length === 0) {
    throw new Error(
      `Missing required environment variable ${name}. Create a .env file from .env.example and set ${name}.`,
    );
  }

  return value;
}

export function getValidatedEnv(): TestEnvironment {
  return {
    BASE_URL: readRequiredEnv("BASE_URL"),
    API_BASE_URL: readRequiredEnv("API_BASE_URL"),
    PATIENT_EMAIL: readRequiredEnv("PATIENT_EMAIL"),
    PATIENT_PASSWORD: readRequiredEnv("PATIENT_PASSWORD"),
    DEFAULT_APPOINTMENT_NOTES:
      process.env.DEFAULT_APPOINTMENT_NOTES?.trim() ||
      "Created by Playwright UI automation",
  };
}

export const testEnv = getValidatedEnv();
