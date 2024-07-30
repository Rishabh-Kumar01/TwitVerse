import { express } from "../../utils/imports.util.js";
import { TweetController } from "../../controllers/index.controller.js";

const router = express.Router();

router.post("/tweets", TweetController.createTweet);

router.get("/tweets", TweetController.getTweets);

export default router;
