import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string().min(32),
    AUTH_URL: z.string().url().default('http://localhost:3000'),
    AUTH_TRUST_HOST: z.string().optional(),
    SOCKET_SERVER_URL: z.string().url().default('http://localhost:3001'),
    SOCKET_AUTH_TOKEN: z.string().optional(),
    UPSTASH_REDIS_REST_URL: z.string().url().optional().or(z.literal('').transform(() => undefined)),
    UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
    RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required for email sending'),
    RESEND_FROM_EMAIL: z.string().email().default('onboarding@resend.dev').transform((v) => `MediQueue <${v}>`),
  },
  client: {
    NEXT_PUBLIC_SOCKET_URL: z.string().url().default('http://localhost:3001'),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    AUTH_URL: process.env.AUTH_URL,
    AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST,
    SOCKET_SERVER_URL: process.env.SOCKET_SERVER_URL,
    SOCKET_AUTH_TOKEN: process.env.SOCKET_AUTH_TOKEN,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
    NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
