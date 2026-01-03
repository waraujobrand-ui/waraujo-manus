import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";

// Type-only import to avoid circular dependency
type AppRouter = any;

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://127.0.0.1:3000/trpc",
      transformer: superjson,
      headers: {
        "Content-Type": "application/json",
      },
    }),
  ],
});
