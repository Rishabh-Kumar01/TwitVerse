import { express } from "../../utils/imports.util.js";
import {
  TweetController,
  UserController,
  LikeController,
  CommentController,
} from "../../controllers/index.controller.js";

const router = express.Router();

// Tweets

// POST - api/v1/tweets
// Create a new tweet
// Request body:
// {
//   "content": "string"
// }
// Response body:
// {
//   "success": true,
//   "message": "Tweet created successfully",
//   "data": {
//     "content": "string",
//     "id": "string",
//     "userId": "string",
//     "createdAt": "string",
//     "updatedAt": "string"
//   },
//   "error": []
// }
router.post("/tweets", TweetController.createTweet);

// GET - api/v1/tweets
// Get all tweets
router.get("/tweets", TweetController.getTweets);

// User

// POST - api/v1/users
// Create a new user
router.post("/users", UserController.createUser);

// Like

// POST - api/v1/toggle-likes
// Toggle like on a tweet, comment
router.post("/toggle-likes", LikeController.toggleLike);


// Comment

// POST - api/v1/comments
// Create a new comment
router.post("/comments", CommentController.createComment);

export default router;
