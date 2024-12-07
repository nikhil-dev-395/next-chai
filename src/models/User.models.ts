import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const messageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  isVerified: boolean;
  verifyCodeExpiry: Date;
  isAcceptingMessage: boolean;
  message: Message[];
}

const userSchema: Schema<User> = new Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
    required: [true, "username is require"],
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    required: [true, "email is require"],
  },
  password: {
    type: String,
    trim: true,
    required: [true, "password is require"],
  },
  verifyCode: {
    type: String,
    trim: true,
    required: [true, "verifyCode is require"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "verifyCodeExpiry is require"],
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  message: [
    messageSchema,
  ] /*messageSchema because we are making here relation between both*/,
});

const userModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", userSchema);

export default userModel;
