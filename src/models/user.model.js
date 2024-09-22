import { mongoose, bcrypt } from "../utils/imports.util.js";
import { serverConfig } from "../config/index.config.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    followersCount: {
      type: Number,
      default: 0,
    },
    followingCount: {
      type: Number,
      default: 0,
    },
    // profilePic: {
    //   type: String,
    // },
    // coverPic: {
    //   type: String,
    // },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;
  const hashedPassword = bcrypt.hashSync(user.password, serverConfig.SALT);
  user.password = hashedPassword;
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
