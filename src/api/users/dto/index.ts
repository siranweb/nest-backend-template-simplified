import { createZodDto } from '@/lib/zod-dto/dto-helpers';
import { userCredentialsSchema } from '@/api/users/schemas/user-credentials.schema';

export class UserCredentialsDto extends createZodDto(userCredentialsSchema) {}
