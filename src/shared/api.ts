import axios from "axios";
import { API_URL } from "./constants";
import { toast } from "sonner";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default api;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createApiHandler<T, Args extends any[]>(
  apiCall: (...args: Args) => Promise<T>,
  errorMessage: string = "An error occurred",
): (...args: Args) => Promise<T | undefined> {
  return async (...args: Args) => {
    try {
      return await apiCall(...args);
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message);
      } else {
        toast.error(errorMessage);
      }
      console.error(errorMessage, e);
      return undefined;
    }
  };
}
