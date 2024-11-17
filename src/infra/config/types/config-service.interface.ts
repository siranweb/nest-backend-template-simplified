import { ConfigService } from "@nestjs/config";
import { Configuration } from '@/infra/config/configuration/configuration.schema';

export interface IConfigService extends ConfigService<Configuration, true> {}
