import { apiClient } from "./client";

export type HealthResponse = {
  status: number;
  message: string;
};

export async function fetchHealth(): Promise<HealthResponse> {
  const { data } = await apiClient.get<HealthResponse>("/health/");
  return data;
}
