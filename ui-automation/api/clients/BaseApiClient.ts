import { APIRequestContext, APIResponse } from "@playwright/test";

export abstract class BaseApiClient {
  protected constructor(
    protected readonly request: APIRequestContext,
    private readonly token?: string,
  ) {}

  protected async get<T>(
    endpoint: string,
    expectedStatus: number | number[] = 200,
  ): Promise<T> {
    const response = await this.request.get(endpoint, {
      headers: this.getHeaders(),
    });

    await this.expectStatus(response, expectedStatus);
    return this.parseJson<T>(response);
  }

  protected async post<T>(
    endpoint: string,
    data?: unknown,
    expectedStatus: number | number[] = [200, 201],
  ): Promise<T> {
    const response = await this.request.post(endpoint, {
      data,
      headers: this.getHeaders(),
    });

    await this.expectStatus(response, expectedStatus);
    return this.parseJson<T>(response);
  }

  protected async put<T>(
    endpoint: string,
    data?: unknown,
    expectedStatus: number | number[] = [200, 204],
  ): Promise<T | undefined> {
    const response = await this.request.put(endpoint, {
      data,
      headers: this.getHeaders(),
    });

    await this.expectStatus(response, expectedStatus);
    return this.parseJson<T | undefined>(response);
  }

  protected async delete(
    endpoint: string,
    expectedStatus: number | number[] = [200, 202, 204],
  ): Promise<void> {
    const response = await this.request.delete(endpoint, {
      headers: this.getHeaders(),
    });

    await this.expectStatus(response, expectedStatus);
  }

  protected async expectStatus(
    response: APIResponse,
    expectedStatus: number | number[],
  ): Promise<void> {
    const expectedStatuses = Array.isArray(expectedStatus)
      ? expectedStatus
      : [expectedStatus];

    if (expectedStatuses.includes(response.status())) {
      return;
    }

    const responseBody = await response
      .text()
      .catch(() => "<unable to read response body>");

    throw new Error(
      `Unexpected API status for ${response.url()}. Expected ${expectedStatuses.join(
        ", ",
      )}, received ${response.status()}. Response: ${responseBody}`,
    );
  }

  protected async parseJson<T>(response: APIResponse): Promise<T> {
    const text = await response.text();

    if (!text) {
      return undefined as T;
    }

    try {
      return JSON.parse(text) as T;
    } catch (error) {
      throw new Error(
        `Unable to parse JSON response from ${response.url()}: ${(error as Error).message}`,
      );
    }
  }

  private getHeaders(): Record<string, string> {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }
}
