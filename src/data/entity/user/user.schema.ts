import { Schema } from "mongoose";

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  createAt: {
    type: Date,
    default: Date.now
  }
});

export default UserSchema;
