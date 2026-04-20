import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from '../types/global-api-response.Type';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message = 'Request failed';
    let error = exception.name;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object' && exceptionResponse) {
      const res = exceptionResponse as any;

      if (Array.isArray(res.message)) {
        message = res.message.join(', ');
      } else if (typeof res.message === 'string') {
        message = res.message;
      }
    }
    // else {
    //   this.logger.error(
    //     `Unhandled exception: ${String(exception)}`,
    //     exception instanceof Error ? exception.stack : undefined,
    //   );
    // }

    const errorResponse: ApiResponse<null> = {
      statusCode: status,
      success: false,
      message,
      data: null,
      meta: {
        path: request.url,
        method: request.method,
        timestamp: new Date().toISOString(),
        error,
      },
    };

    this.logger.warn(`${request.method} ${request.url} → ${message}`);

    response.status(status).json(errorResponse);
  }
}