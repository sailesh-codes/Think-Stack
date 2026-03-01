import { z } from "zod";
import { insertQuizSchema, generateQuizSchema, type Quiz, type UserUsage } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
  paymentRequired: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    me: {
      method: "GET" as const,
      path: "/api/auth/me",
      responses: {
        200: z.object({
          user: z.any(), // Type from auth model
          usage: z.custom<UserUsage>(),
        }),
        401: errorSchemas.unauthorized,
      },
    },
  },
  quizzes: {
    generate: {
      method: "POST" as const,
      path: "/api/quizzes/generate",
      input: generateQuizSchema,
      responses: {
        201: z.custom<Quiz>(),
        400: errorSchemas.validation,
        402: errorSchemas.paymentRequired, // Credits exceeded
        500: errorSchemas.internal,
      },
    },
    list: {
      method: "GET" as const,
      path: "/api/quizzes",
      responses: {
        200: z.array(z.custom<Quiz>()),
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/quizzes/:id",
      responses: {
        200: z.custom<Quiz>(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: "DELETE" as const,
      path: "/api/quizzes/:id",
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
        403: errorSchemas.unauthorized,
      },
    },
  },
  stripe: {
    createCheckout: {
      method: "POST" as const,
      path: "/api/stripe/checkout",
      responses: {
        200: z.object({ url: z.string() }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
