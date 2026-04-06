import { apiRequest } from "./client";

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

export async function registerUser({
  email,
  password,
  confirmPassword,
  name,
  bio,
}: RegisterPayload) {
  return apiRequest<AuthResponse>("/users/register/", {
    method: "POST",
    body: {
      email,
      password,
      confirm_password: confirmPassword,
      name,
      bio: bio ?? "",
    },
  });
}

export async function loginUser(email: string, password: string) {
  return apiRequest<AuthResponse>("/users/login/", {
    method: "POST",
    body: {
      email,
      password,
    },
  });
}
