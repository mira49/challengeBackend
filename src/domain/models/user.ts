export default class User {
  id?: string;

  email: string;

  createAt: Date;

  constructor(email: string, id?: string, createAt?: Date) {
    this.id = id;
    this.email = email;
    this.createAt = createAt;
  }
}
