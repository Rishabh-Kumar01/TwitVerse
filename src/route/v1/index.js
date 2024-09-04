import { express } from "../../utils/imports.util.js";
import {
  TweetController,
  UserController,
  LikeController,
  CommentController,
  SeedController,
} from "../../controller/index.controller.js";
import { authenticate } from "../../middleware/index.middleware.js";
import { multerUpload } from "../../config/index.config.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Seed
 *     description: Database seeding operations
 *   - name: Tweets
 *     description: Tweet management
 *   - name: User
 *     description: User management
 *   - name: Like
 *     description: Like management
 *   - name: Comment
 *     description: Comment management
 */

/**
 * @swagger
 * /api/v1/seed:
 *   get:
 *     summary: Seed the database with sample data
 *     tags: [Seed]
 *     responses:
 *       200:
 *         description: Database seeded successfully
 */
router.get("/seed", SeedController.seedData);

/**
 * @swagger
 * /api/v1/tweets:
 *   post:
 *     summary: Create a new tweet
 *     tags: [Tweets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Tweet created successfully
 */
router.post(
  "/tweets",
  authenticate,
  multerUpload.array("images", 5),
  TweetController.createTweet
);

/**
 * @swagger
 * /api/v1/upload-image:
 *   post:
 *     summary: Upload images
 *     tags: [Tweets]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Images uploaded successfully
 */
router.post(
  "/upload-image",
  multerUpload.array("images", 5),
  TweetController.uploadImage
);

/**
 * @swagger
 * /api/v1/tweets:
 *   get:
 *     summary: Get all tweets
 *     tags: [Tweets]
 *     responses:
 *       200:
 *         description: List of tweets retrieved successfully
 */
router.get("/tweets", TweetController.getTweets);

/**
 * @swagger
 * /api/v1/tweets/{id}:
 *   delete:
 *     summary: Delete a tweet by id
 *     tags: [Tweets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tweet deleted successfully
 */
router.delete("/tweets/:id", authenticate, TweetController.deleteTweet);

/**
 * @swagger
 * /api/v1/signup:
 *   post:
 *     summary: Sign up a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 */
router.post("/signup", UserController.signUp);

/**
 * @swagger
 * /api/v1/login:
 *   post:
 *     summary: Log in a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 */
router.post("/login", UserController.logIn);

/**
 * @swagger
 * /api/v1/toggle-likes:
 *   post:
 *     summary: Toggle like on a tweet or comment
 *     tags: [Like]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               modelId:
 *                 type: string
 *               modelType:
 *                 type: string
 *                 enum: [Tweet, Comment]
 *     responses:
 *       200:
 *         description: Like toggled successfully
 */
router.post("/toggle-likes", authenticate, LikeController.toggleLike);

/**
 * @swagger
 * /api/v1/comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               modelId:
 *                 type: string
 *               modelType:
 *                 type: string
 *                 enum: [Tweet, Comment]
 *     responses:
 *       201:
 *         description: Comment created successfully
 */
router.post("/comments", authenticate, CommentController.createComment);

/**
 * @swagger
 * /api/v1/comments/{id}:
 *   get:
 *     summary: Get a comment by id
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment retrieved successfully
 */
router.get("/comments/:id", CommentController.getComment);

export default router;
