import CrudRepository from "./crud.repository.js";
import { Comment } from "../models/index.js";
import { mongoose } from "../utils/imports.util.js";

class CommentRepository extends CrudRepository {
  constructor() {
    super(Comment);
  }

  static getInstance() {
    if (!CommentRepository.instance) {
      CommentRepository.instance = new CommentRepository();
    }
    return CommentRepository.instance;
  }

  async delete(id) {
    try {
      const deletedData = await this.model.deleteMany({ commentable: id });
      return deletedData;
    } catch (error) {
      console.log(error, "Error in Comment Repository while deleting");
      throw new Error(`Error in Comment Repository while deleting: ${error}`);
    }
  }

  // async getById(data) {
  //   try {
  //     console.log(data, "Data in Comment Repository while getting by id");
  //     const response = await this.model.findById(data._id).populate("comments");
  //     return response;
  //   } catch (error) {
  //     console.log(error, "Error in Comment Repository while getting by id");
  //     throw new Error(
  //       `Error in Comment Repository while getting by id: ${error}`
  //     );
  //   }
  // }

  async getById(data) {
    try {
      const comments = await this.model.aggregate([
        {
          $match: {
            onModel: "Tweet",
            commentable: new mongoose.Types.ObjectId(data._id),
          },
        },
        {
          $graphLookup: {
            from: "comments",
            startWith: "$_id",
            connectFromField: "_id",
            connectToField: "commentable",
            as: "nestedComments",
            maxDepth: 100,
            depthField: "depth",
          },
        },
        {
          $addFields: {
            comments: {
              $function: {
                body: function (root, nestedComments) {
                  function nestComments(parentId) {
                    return nestedComments
                      .filter(
                        (comment) =>
                          comment.commentable.toString() === parentId.toString()
                      )
                      .map((comment) => ({
                        ...comment,
                        comments: nestComments(comment._id),
                      }));
                  }
                  return nestComments(root._id);
                },
                args: ["$$ROOT", "$nestedComments"],
                lang: "js",
              },
            },
          },
        },
        {
          $project: {
            nestedComments: 0,
          },
        },
      ]);

      return comments;
    } catch (error) {
      console.log(
        error,
        "Error in Comment Repository while getting comments for tweet"
      );
      throw new Error(
        `Error in Comment Repository while getting comments for tweet: ${error}`
      );
    }
  }

  // async getById(data, page = 1, size = 20) {
  //   try {
  //     console.log(data, "Data in Comment Repository while getting by id");
  //     if (!mongoose.Types.ObjectId.isValid(data._id)) {
  //       throw new Error("Invalid tweet ID");
  //     }
  
  //     const skip = (page - 1) * size;
  
  //     const result = await this.model.aggregate([
  //       {
  //         $match: {
  //           onModel: "Tweet",
  //           commentable: new mongoose.Types.ObjectId(data._id),
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: "users",
  //           localField: "userId",
  //           foreignField: "_id",
  //           as: "user",
  //         },
  //       },
  //       {
  //         $addFields: {
  //           userId: { $arrayElemAt: ["$user._id", 0] },
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: "comments",
  //           let: { parentId: "$_id" },
  //           pipeline: [
  //             { $match: { $expr: { $eq: ["$commentable", "$$parentId"] } } },
  //             {
  //               $lookup: {
  //                 from: "users",
  //                 localField: "userId",
  //                 foreignField: "_id",
  //                 as: "user",
  //               },
  //             },
  //             {
  //               $addFields: {
  //                 userId: { $arrayElemAt: ["$user._id", 0] },
  //                 depth: 0,
  //               },
  //             },
  //             { $project: { user: 0, __v: 0 } },
  //           ],
  //           as: "comments",
  //         },
  //       },
  //       {
  //         $project: {
  //           _id: 1,
  //           content: 1,
  //           onModel: 1,
  //           commentable: 1,
  //           userId: 1,
  //           countOfLikes: 1,
  //           comments: 1,
  //           createdAt: 1,
  //           updatedAt: 1,
  //         },
  //       },
  //       { $skip: skip },
  //       { $limit: size },
  //     ]);
  
  //     return result;
  //   } catch (error) {
  //     console.error(
  //       "Error in Comment Repository while getting comments for tweet:",
  //       error
  //     );
  //     throw error;
  //   }
  // }
}

export default CommentRepository;
