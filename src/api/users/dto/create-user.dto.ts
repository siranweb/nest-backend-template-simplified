import { createZodDto } from '@/lib/zod-dto/dto-helpers';
import { userCredentialsSchema } from '@/api/users/schemas/user-credentials.schema';

const createUserSchema = userCredentialsSchema.extend({
  login: userCredentialsSchema.shape.login.min(5),
  password: userCredentialsSchema.shape.password.min(8),
});

export class CreateUserDto extends createZodDto(createUserSchema) {}
