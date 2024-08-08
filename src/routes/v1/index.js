import { express } from "../../utils/imports.util.js";
import {
  TweetController,
  UserController,
  LikeController,
  CommentController,
} from "../../controllers/index.controller.js";
import {authenticate} from "../../middlewares/index.middleware.js"
import {multerUpload} from "../../config/index.config.js"

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
router.post("/tweets", authenticate,  TweetController.createTweet);

// POST - api/v1/upload-image
// Upload an image
router.post("/upload-image", multerUpload.array("images", 5), TweetController.uploadImage);

// GET - api/v1/tweets
// Get all tweets
router.get("/tweets", TweetController.getTweets);

// User

// POST - api/v1/signup
// SignUp a new user
router.post("/signup", UserController.signUp);

// POST - api/v1/login
// Login User
router.post("/login", UserController.logIn)

// Like

// POST - api/v1/toggle-likes
// Toggle like on a tweet, comment
router.post("/toggle-likes", authenticate,  LikeController.toggleLike);

// Comment

// POST - api/v1/comments
// Create a new comment
router.post("/comments",authenticate, CommentController.createComment);

// GET - api/v1/comments/:id
// Get a comment by id
router.get("/comments/:id", CommentController.getComment);

export default router;
