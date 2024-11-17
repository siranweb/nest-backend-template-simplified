import { ConfigModule as ExternalConfigModule } from '@nestjs/config';
import { loadConfiguration } from '@/infra/config/configuration/load-configuration';
import { Module } from '@nestjs/common';
import { configurationSchema } from '@/infra/config/configuration/configuration.schema';

@Module({
  imports: [ExternalConfigModule.forRoot({
    ignoreEnvFile: true,
    load: [loadConfiguration],
    validate: (config) => configurationSchema.parse(config),
  })],
})
export class ConfigModule {}
