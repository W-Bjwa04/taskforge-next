import mongoose, {Schema, Document} from "mongoose"



export interface IUser extends Document {
    email: string;
    password: string;
    isVerified: boolean;
    verificationToken?: string;
    verificationTokenExpires?: Date;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    verificationTokenExpires: {
      type: Date,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);