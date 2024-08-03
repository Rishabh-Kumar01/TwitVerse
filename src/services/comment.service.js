import CrudService from "./crud.service.js";
import {
  CommentRepository,
  TweetRepository,
} from "../repository/index.repository.js";

class CommentService extends CrudService {
  constructor() {
    const commentRepository = CommentRepository.getInstance();
    super(commentRepository);
    this.tweetRepository = TweetRepository.getInstance();
  }

  static getInstance() {
    if (!CommentService.instance) {
      CommentService.instance = new CommentService();
    }
    return CommentService.instance;
  }

  async create(data) {
    try {
      // Check if the Model Id exists
      let isExists;
      if (data.modelType === "Tweet") {
        isExists = await this.tweetRepository.getTweetById(data.modelId);
      } else if (data.modelType === "Comment") {
        isExists = await this.repository.getById(data.modelId);
      }

      if (!isExists) {
        throw new Error("Model Id not found");
      }

      // Create the comment
      const comment = await this.repository.create({
        content: data.content,
        onModel: data.modelType,
        commentable: data.modelId,
        userId: data.userId,
        comments: [],
      });

      // Update the Model Id with the created comment
      if (data.modelType === "Tweet") {
        this.tweetRepository.updateTweet(data.modelId, {
          $inc: { countOfComments: 1 },
        });
      } else if (data.modelType === "Comment") {
        this.repository.update(data.modelId, {
          $push: { comments: comment._id },
        });
      }
      return {
        content: comment.content,
        modelType: comment.onModel,
        modelId: comment.commentable,
        userId: comment.userId,
      };
    } catch (error) {
      console.log(error, "Error in Comment Service while creating");
      throw new Error(`Error in Comment Service while creating: ${error}`);
    }
  }
}

export default CommentService;
