import { z } from 'zod';
import { ENodeEnv } from 'src/shared/types';

const expirationTimeRegex =
  /^\d+\s*(sec|secs|second|seconds|s|minute|minutes|min|mins|m|hour|hours|hr|hrs|h|day|days|d|week|weeks|w|year|years|yr|yrs|y)$/i;

export const configurationSchema = z.object({
  nodeEnv: z.nativeEnum(ENodeEnv),
  webServer: z.object({
    port: z.number().positive(),
  }),
  jwt: z.object({
    secret: z.string().min(1),
    accessToken: z.object({
      expirationTime: z.string().regex(expirationTimeRegex),
    }),
    refreshToken: z.object({
      expirationTime: z.string().regex(expirationTimeRegex),
    }),
  }),
});

export type TConfiguration = z.infer<typeof configurationSchema>;
