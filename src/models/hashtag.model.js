const { mongoose } = require("../utils/imports.util");

const hashtagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    tweets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tweet",
      },
    ],
  },
  { timestamps: true }
);

const Hashtag = mongoose.model("Hashtag", hashtagSchema);
module.exports = Hashtag;
