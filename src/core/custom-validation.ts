import { BadRequestException, ValidationPipe } from '@nestjs/common';

export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true, // Transform the request body to the DTO
      whitelist: true, // Remove any fields that are not defined in the DTO
      exceptionFactory: (errors) => {
        return new BadRequestException({
          result: false,
          status: 400,
          message: 'Validation failed',
          errors: errors.map((err) => ({
            property: err.property,
            constraints: err.constraints,
          })),
        });
      },
    });
  }
}
