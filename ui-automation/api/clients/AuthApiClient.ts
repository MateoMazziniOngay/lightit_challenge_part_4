import { ApiEndpoints } from "../../constants/api-endpoints";
import { AuthLoginRequest, AuthLoginResponse } from "../models/auth.model";
import { BaseApiClient } from "./BaseApiClient";
import { APIRequestContext } from "@playwright/test";

export class AuthApiClient extends BaseApiClient {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async login(email: string, password: string): Promise<AuthLoginResponse> {
    const payload: AuthLoginRequest = { email, password };

    return this.post<AuthLoginResponse>(ApiEndpoints.AUTH_LOGIN, payload);
  }
}
