import { QueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

const shouldRetryQuery = (failureCount: number, error: unknown) => {
  if (isAxiosError(error)) {
    const status = error.response?.status;

    if (status && status < 500) {
      return false;
    }
  }

  return failureCount < 2;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: shouldRetryQuery,
      staleTime: 30_000,
    },
    mutations: {
      retry: false,
    },
  },
});
