import { apiClient } from "./axios";
import { User } from "../types";

export interface RegisterPayload {
  email: string;
  password: string;
  phoneNumber: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
  token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  getUser?: User;
  user?: User;
  token?: string;
}

export const registerApi = async (payload: RegisterPayload): Promise<RegisterResponse> => {
  const response = await apiClient.post<RegisterResponse>("/auth/register", payload);
  return response.data;
};

export const loginApi = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>("/auth/login", payload);
  // Some backends return 200 with an error message on wrong credentials
  if (!response.data.token && response.data.message?.toLowerCase().includes("incorrect")) {
    throw new Error(response.data.message || "Invalid credentials");
  }
  return response.data;
};
