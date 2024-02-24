import axios, { AxiosError, AxiosPromise, AxiosRequestConfig } from "axios";
import toast from "react-hot-toast";

const serverEndpoint = "http://localhost:3000";

const instance = axios.create({
  baseURL: serverEndpoint,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

export function apiRequest<T>(
  config: AxiosRequestConfig
): AxiosPromise<T> {
  return instance(config);
}

export const handleApiError = (e: unknown) => {
  const error = e as AxiosError<{ message: string }>;
  toast.error(error.response?.data.message || error.message);
};
