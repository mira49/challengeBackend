import { IsEmail } from "class-validator";

export default class RegisterUserReq {
  @IsEmail()
  email: string;

  constructor(email: string) {
    this.email = email;
  }
}
