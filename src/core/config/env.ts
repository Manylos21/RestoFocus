import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.url(),
  NEXT_PUBLIC_API_BASE_URL: z.url(),
  OAUTH2_ISSUER_URL: z.url(),
  OAUTH2_AUDIENCE: z.string().min(1),
  JWT_ACCESS_TOKEN_SECRET: z.string().min(32),
  JWT_REFRESH_TOKEN_SECRET: z.string().min(32),
  COOKIE_ENCRYPTION_SECRET: z.string().min(32),
  DATABASE_URL: z.string().min(1),
});

const envParseResult = envSchema.safeParse({
  NODE_ENV: process.env["NODE_ENV"],
  NEXT_PUBLIC_APP_URL: process.env["NEXT_PUBLIC_APP_URL"],
  NEXT_PUBLIC_API_BASE_URL: process.env["NEXT_PUBLIC_API_BASE_URL"],
  OAUTH2_ISSUER_URL: process.env["OAUTH2_ISSUER_URL"],
  OAUTH2_AUDIENCE: process.env["OAUTH2_AUDIENCE"],
  JWT_ACCESS_TOKEN_SECRET: process.env["JWT_ACCESS_TOKEN_SECRET"],
  JWT_REFRESH_TOKEN_SECRET: process.env["JWT_REFRESH_TOKEN_SECRET"],
  COOKIE_ENCRYPTION_SECRET: process.env["COOKIE_ENCRYPTION_SECRET"],
  DATABASE_URL: process.env["DATABASE_URL"],
});

if (!envParseResult.success) {
  const formattedErrors = envParseResult.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("\n");

  throw new Error(`Invalid environment variables:\n${formattedErrors}`);
}

export const env = envParseResult.data;
export type Env = z.infer<typeof envSchema>;
