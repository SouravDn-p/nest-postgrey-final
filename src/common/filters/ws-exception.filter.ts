import {
  Catch,
  ArgumentsHost,
  WsExceptionFilter,
} from '@nestjs/common';

@Catch()
export class WsAllExceptionFilter implements WsExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();

    const message =
      exception instanceof Error
        ? exception.message
        : 'WebSocket error';

    client.emit('error', {
      success: false,
      message,
    });
  }
}