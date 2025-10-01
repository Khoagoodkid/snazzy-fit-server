import { HttpStatus } from '@nestjs/common';

class SuccessResponse<T> {
  result: boolean;
  message: string;
  status: number;
  data: T;
  options?: object;
  totalPage?: number;
  totalRecord?: number;

  constructor({
    message,
    status = HttpStatus.OK,
    data,
    options = {},
    totalPage = -1,
    totalRecord = -1,
  }: {
    message: string;
    status?: number;
    data: T;
    options?: object;
    totalPage?: number;
    totalRecord?: number;
  }) {
    this.result = true;
    this.message = message;
    this.status = status;
    this.data = JSON.parse(
      JSON.stringify(data, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value,
      ),
    );
    this.options = options;

    if (totalPage >= 0) {
      this.totalPage = totalPage;
      this.totalRecord = totalRecord;
    }
  }
}

export class CreatedResponse<T> extends SuccessResponse<T> {
  constructor({
    data,
    options = {},
    message,
  }: {
    data: T;
    options?: object;
    message: string;
  }) {
    super({ message, status: HttpStatus.CREATED, data, options });
  }
}

export class UpdatedResponse<T> extends SuccessResponse<T> {
  constructor({
    data,
    options = {},
    message,
  }: {
    data: T;
    options?: object;
    message: string;
  }) {
    super({ message, data, options });
  }
}

export class GetResponse<T> extends SuccessResponse<T> {
  constructor({
    data,
    totalPage = 0,
    totalRecord = 0,
    options = {},
    message,
  }: {
    data: T;
    totalPage?: number;
    totalRecord?: number;
    options?: object;
    message: string;
  }) {
    super({
      message,
      status: HttpStatus.OK,
      data,
      options,
      totalPage,
      totalRecord,
    });
  }
}

export class DeletedResponse<T> extends SuccessResponse<T> {
  constructor({
    data,
    options = {},
    message,
  }: {
    data: T;
    options?: object;
    message: string;
  }) {
    super({ message, status: HttpStatus.OK, data, options });
  }
}

export class OkResponse<T> extends SuccessResponse<T> {
  constructor({
    data,
    options = {},
    message,
  }: {
    data: T;
    options?: object;
    message: string;
  }) {
    super({ message, status: HttpStatus.OK, data, options });
  }
}
