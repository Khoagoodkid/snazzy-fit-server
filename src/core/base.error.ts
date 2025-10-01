import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseError extends HttpException {
  public errors: any[];
  public isOperational: boolean;

  constructor(
    message: string,
    status: HttpStatus,
    errors: any[] = [],
    isOperational: boolean = true,
  ) {
    super(message, status);
    this.errors = errors;
    this.isOperational = isOperational;
  }
}

export class Api409Error extends BaseError {
  constructor(message = 'Conflict', errors: any[] = []) {
    super(message, HttpStatus.CONFLICT, errors);
  }
}

export class Api403Error extends BaseError {
  constructor(message = 'Forbidden', errors: any[] = []) {
    super(message, HttpStatus.FORBIDDEN, errors);
  }
}

export class Api401Error extends BaseError {
  constructor(message = 'Unauthorized', errors: any[] = []) {
    super(message, HttpStatus.UNAUTHORIZED, errors);
  }
}

export class Api400Error extends BaseError {
  constructor(message = 'Bad Request', errors: any[] = []) {
    super(message, HttpStatus.BAD_REQUEST, errors);
  }
}

export class Api404Error extends BaseError {
  constructor(message = 'Not Found', errors: any[] = []) {
    super(message, HttpStatus.NOT_FOUND, errors);
  }
}

export class BusinessLogicError extends BaseError {
  constructor(
    message: string = 'Internal Server Error',
    status: number = HttpStatus.INTERNAL_SERVER_ERROR,
    errors: any[] = [],
    result: boolean = false,
  ) {
    super(message, status, errors, result);
  }
}
