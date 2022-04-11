import { Schema } from "mongoose";

const EventSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  emailNotifications: {
    type: Boolean
  },
  smsNotifications: {
    type: Boolean
  },
  createAt: {
    type: Date,
    default: Date.now
  }
});

export default EventSchema;
