import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from '../types/global-api-response.Type';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof Error
        ? exception.message
        : 'Internal server error';

    const stack =
      exception instanceof Error ? exception.stack : undefined;

    this.logger.error(
      `[UNHANDLED ERROR] ${request.method} ${request.url} - ${message}`,
      stack,
    );

    const errorResponse: ApiResponse<null> = {
      statusCode: status,
      success: false,
      message,
      data: null,
      meta: {
        path: request.url,
        method: request.method,
        timestamp: new Date().toISOString(),
        error: 'InternalServerError',
      },
    };

    response.status(status).json(errorResponse);
  }
}