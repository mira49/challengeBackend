export default class UserNotFoundException extends Error {
  constructor(id: string) {
    super(`User not found with id: ${id}`);
  }
}
