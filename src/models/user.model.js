import { mongoose } from "../utils/imports.util.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // email: {
    //   type: String,
    //   required: true,
    //   unique: true,
    //   trim: true,
    // },
    // password: {
    //   type: String,
    //   required: true,
    //   trim: true,
    // },
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

const User = mongoose.model("User", userSchema);
export default User;
