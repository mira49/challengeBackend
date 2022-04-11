import { Document } from "mongoose";

export interface EventEntity extends Document {
  userId: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  readonly createAt: Date;
}
