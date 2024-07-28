const { mongoose } = require("../utils/imports.util");

const hashtagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    countOfTweets: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Hashtag = mongoose.model("Hashtag", hashtagSchema);
module.exports = Hashtag;
