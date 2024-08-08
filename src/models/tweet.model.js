import { mongoose } from "../utils/imports.util.js";

const tweetSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      max: ["250", "Tweet cannot exceed 250 characters"],
    },
    countOfLikes: {
      type: Number,
      default: 0,
    },
    countOfComments: {
      type: Number,
      default: 0,
    },
    images: [
      {
        type: String,
      },
    ]
  },
  { timestamps: true }
);

const Tweet = mongoose.model("Tweet", tweetSchema);
export default Tweet;
