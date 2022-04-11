import { IsNotEmpty } from "class-validator";

export default class CreateConsentsReq {
  @IsNotEmpty()
  userId: string;

  emailNotifications = false;

  smsNotifications = false;

  constructor(
    userId: string,
    emailNotifications: boolean,
    smsNotifications: boolean
  ) {
    this.userId = userId;
    this.emailNotifications = emailNotifications;
    this.smsNotifications = smsNotifications;
  }
}
