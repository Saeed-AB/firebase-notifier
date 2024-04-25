import axios, { AxiosError, AxiosPromise, AxiosRequestConfig } from "axios";
import toast from "react-hot-toast";

const serverKey = process.env.NEXT_PUBLIC_FIREBASE_SERVER_KEY;
const instance = axios.create({
  baseURL: "/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `key=${serverKey}`,
  },
});

export function apiRequest<T>(config: AxiosRequestConfig): AxiosPromise<T> {
  return instance(config);
}

export const handleApiError = (e: unknown) => {
  const error = e as AxiosError<{ error: string }>;
  toast.error(error.response?.data?.error || error.message);
};
