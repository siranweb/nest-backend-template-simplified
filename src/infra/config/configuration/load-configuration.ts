import * as process from 'node:process';
import { NodeEnv } from 'src/shared/types';
import {
  configurationSchema,
  TConfiguration,
} from '@/infra/config/configuration/configuration.schema';

export function loadConfiguration(): TConfiguration {
  const config = {
    nodeEnv: (process.env.NODE_ENV ?? NodeEnv.DEVELOPMENT) as NodeEnv,
    webServer: {
      port: Number(process.env.WEB_SERVER_PORT),
    },
    jwt: {
      secret: process.env.JWT_SECRET ?? '',
      accessToken: {
        expirationTime: '2h',
      },
      refreshToken: {
        expirationTime: '30d',
      },
    },
    database: {
      user: process.env.POSTGRES_USER ?? '',
      password: process.env.POSTGRES_PASSWORD ?? '',
      db: process.env.POSTGRES_DB ?? '',
      host: process.env.POSTGRES_HOST ?? '',
      port: Number(process.env.POSTGRES_PORT),
    },
  };

  configurationSchema.parse(config);

  return config;
}
