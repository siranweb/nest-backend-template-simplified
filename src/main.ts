import 'zod-openapi/extend';
import { bootstrap } from '@/bootstrap';
import { patchNestJsSwagger } from '@/lib/zod-dto/patch-nest-swagger';

patchNestJsSwagger();
bootstrap();
