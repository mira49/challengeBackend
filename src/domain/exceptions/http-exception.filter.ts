import { ExceptionFilter, Catch, ArgumentsHost, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import UserAlreadyExistsException from "./UserAlreadyExistsException";
import UserNotFoundException from "./UserNotFoundException";
import ValidationException from "./ValidationException";

@Catch()
export default class HttpExceptionFilter implements ExceptionFilter<Error> {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { message, status } = this.isBusinessException(exception);
    response.status(status).json({
      message,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url
    });
  }

  isBusinessException(exception: Error): any {
    if (
      exception instanceof UserNotFoundException ||
      exception instanceof UserAlreadyExistsException ||
      exception instanceof ValidationException
    ) {
      return {
        message: exception.message,
        status: 422
      };
    }
    Logger.log(exception.stack);
    return {
      message: exception.message,
      status: 500
    };
  }
}
