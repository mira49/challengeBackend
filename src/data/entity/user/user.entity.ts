import { Document } from "mongoose";

export interface UserEntity extends Document {
  email: string;
  readonly createAt: Date;
}
