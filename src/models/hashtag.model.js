import { mongoose } from "../utils/imports.util.js";

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

hashtagSchema.pre("save", function (next) {
  this.title = this.title.toLowerCase();
  next();
});

const Hashtag = mongoose.model("Hashtag", hashtagSchema);
export default Hashtag;
