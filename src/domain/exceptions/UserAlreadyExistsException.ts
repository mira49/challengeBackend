export default class UserAlreadyExistsException extends Error {
  constructor(email: string) {
    super(`User already exists with email address: ${email}`);
  }
}
