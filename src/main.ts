import { ValidationError, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import AppModule from "./app.module";
import HttpExceptionFilter from "./domain/exceptions/http-exception.filter";
import ValidationException from "./domain/exceptions/ValidationException";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule.foorRoot({}));
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (
        validationErrors: ValidationError[] = []
      ): ValidationException => {
        return new ValidationException(
          `${validationErrors?.[0]?.property} is not valid.`
        );
      }
    })
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
