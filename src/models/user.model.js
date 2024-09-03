import { mongoose, bcrypt } from "../utils/imports.util.js";
import { serverConfig } from "../config/index.config.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    // profilePic: {
    //   type: String,
    // },
    // coverPic: {
    //   type: String,
    // },
    // followers: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    //   },
    // ],
    // followings: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    //   },
    // ],
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
