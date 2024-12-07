import { ConfigModule as ExternalConfigModule } from '@nestjs/config';
import { loadConfiguration } from '@/infra/config/configuration/load-configuration';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    ExternalConfigModule.forRoot({
      ignoreEnvFile: true,
      load: [loadConfiguration],
    }),
  ],
})
export class ConfigModule {}
