import mongoose, { Document, Schema } from "mongoose";

export interface User extends Document {
  email: string,
  password: string,
  role: string;
  verificationCode: string;
  verificationCodeExpiry: Date;
  isVerified: boolean;
  token: string | null;
}

const UserSchema: Schema<User> = new Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "Please use a valid email."]
  },
  password: {
    type: String,
    required: [true, "Password is required."]
  },
  role: {
    type: String,
    required: [true, "Role is required."]
  },
  verificationCode: {
    type: String,
    required: [true, "Verification code is required."]
  },
  verificationCodeExpiry: {
    type: Date,
    required: [true, "Verification code expiry is required."]
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  token: {
    type: String,
    default: null
  }
}, { timestamps: true });

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User", UserSchema));
export default UserModel;