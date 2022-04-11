export default class Event {
  id?: string;

  userId?: string;

  emailNotifications: boolean;

  smsNotifications: boolean;

  createAt: Date;

  constructor(
    userId: string,
    emailNotifications: boolean,
    smsNotifications: boolean,
    id?: string,
    createAt?: Date
  ) {
    this.id = id;
    this.userId = userId;
    this.emailNotifications = emailNotifications;
    this.smsNotifications = smsNotifications;
    this.createAt = createAt;
  }
}
