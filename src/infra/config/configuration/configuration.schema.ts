import { z } from 'zod';
import { NodeEnv } from '@/common/types';

const expirationTimeRegex  = /^\d+\s*(sec|secs|second|seconds|s|minute|minutes|min|mins|m|hour|hours|hr|hrs|h|day|days|d|week|weeks|w|year|years|yr|yrs|y)$/i;

export const configurationSchema = z.object({
  nodeEnv: z.nativeEnum(NodeEnv),
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
    })
  }),
  database: z.object({
    user: z.string().min(1),
    password: z.string().min(1),
    db: z.string().min(1),
    host: z.string().min(1),
    port: z.number().positive(),
  })
});

export type Configuration = z.infer<typeof configurationSchema>;
