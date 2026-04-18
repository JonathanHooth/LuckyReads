import { apiClient } from "./client";

export type AuthUser = {
  id: number;
  username: string;
  email: string;
  name?: string;
  bio?: string;
  avatar_url?: string;
};

export type AuthResponse = {
  token?: string;
  user: AuthUser;
};

export type RegisterPayload = {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  bio?: string;
};

export function normalizeAuthUser(user: AuthUser): AuthUser {
  return {
    ...user,
    name: user.name ?? user.username,
  };
}

export async function registerUser({
  email,
  password,
  confirmPassword,
  name,
  bio,
}: RegisterPayload) {
  const { data } = await apiClient.post<AuthResponse>("/users/register/", {
    email,
    password,
    confirm_password: confirmPassword,
    username: name,
    bio: bio ?? "",
  });

  return {
    ...data,
    user: normalizeAuthUser(data.user),
  };
}

export async function loginUser(email: string, password: string) {
  const { data } = await apiClient.post<AuthResponse>("/users/login/", {
    email,
    password,
  });

  return {
    ...data,
    user: normalizeAuthUser(data.user),
  };
}
