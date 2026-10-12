import axios from "axios";

export const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<{ message?: unknown; error?: unknown }>(error)) {
    const responseMessage = error.response?.data?.message;
    if (typeof responseMessage === "string") return responseMessage;

    const responseError = error.response?.data?.error;
    if (typeof responseError === "string") return responseError;

    if (error.message) return error.message;
  }

  return fallback;
};
