import { ConfigService } from '@nestjs/config';
import { TConfiguration } from '@/infra/config/configuration/configuration.schema';

export interface IConfigService extends ConfigService<TConfiguration, true> {}
