export default class ValidationException extends Error {
  constructor(message: string) {
    super(`Validation error : ${message}`);
  }
}
