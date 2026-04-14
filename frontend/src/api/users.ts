import { apiClient } from "./client";
import type { AuthUser } from "./auth";

export async function fetchCurrentUser(): Promise<AuthUser> {
  const { data } = await apiClient.get<AuthUser>("/users/me/");
  return data;
}

export async function updateCurrentUser(
  payload: Partial<Pick<AuthUser, "name" | "bio">>,
): Promise<AuthUser> {
  const { data } = await apiClient.patch<AuthUser>("/users/me/", payload);
  return data;
}
