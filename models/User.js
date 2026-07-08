import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [
        true,
        "[CRITICAL] Terminal handle identifier token is mandatory.",
      ],
      unique: true,
      trim: true,
      lowercase: true,
      minLength: [3, "Handle signature must contain at least 3 alpha metrics."],
      index: true,
    },
    password: {
      type: String,
      required: [
        true,
        "[CRITICAL] Security authentication passcode hash required.",
      ],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

const User = mongoose.model("User", UserSchema)
export default User
