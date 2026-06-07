import { ApiEndpoints } from "../../constants/api-endpoints";
import { User } from "../models/user.model";
import { BaseApiClient } from "./BaseApiClient";
import { APIRequestContext } from "@playwright/test";

export class UsersApiClient extends BaseApiClient {
  constructor(request: APIRequestContext, token: string) {
    super(request, token);
  }

  async getCurrentUser(): Promise<User> {
    return this.get<User>(ApiEndpoints.USERS_ME);
  }
}
