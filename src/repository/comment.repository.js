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

  // async getById(data) {
  //   try {
  //     const comments = await this.model.aggregate([
  //       {
  //         $match: {
  //           onModel: "Tweet",
  //           commentable: new mongoose.Types.ObjectId(data._id),
  //         },
  //       },
  //       {
  //         $graphLookup: {
  //           from: "comments",
  //           startWith: "$_id",
  //           connectFromField: "_id",
  //           connectToField: "commentable",
  //           as: "nestedComments",
  //           maxDepth: 100,
  //           depthField: "depth",
  //         },
  //       },
  //       {
  //         $addFields: {
  //           comments: {
  //             $function: {
  //               body: function (root, nestedComments) {
  //                 function nestComments(parentId) {
  //                   return nestedComments
  //                     .filter(
  //                       (comment) =>
  //                         comment.commentable.toString() === parentId.toString()
  //                     )
  //                     .map((comment) => ({
  //                       ...comment,
  //                       comments: nestComments(comment._id),
  //                     }));
  //                 }
  //                 return nestComments(root._id);
  //               },
  //               args: ["$$ROOT", "$nestedComments"],
  //               lang: "js",
  //             },
  //           },
  //         },
  //       },
  //       {
  //         $project: {
  //           nestedComments: 0,
  //         },
  //       },
  //     ]);

  //     return comments;
  //   } catch (error) {
  //     console.log(
  //       error,
  //       "Error in Comment Repository while getting comments for tweet"
  //     );
  //     throw new Error(
  //       `Error in Comment Repository while getting comments for tweet: ${error}`
  //     );
  //   }
  // }

  async getById(data, page = 1, size = 20) {
    try {
      if (!mongoose.Types.ObjectId.isValid(data._id)) {
        throw new Error("Invalid tweet ID");
      }

      const skip = (page - 1) * size;

      const result = await this.model.aggregate([
        {
          $facet: {
            comments: [
              {
                $match: {
                  onModel: "Tweet",
                  commentable: new mongoose.Types.ObjectId(data._id),
                },
              },
              {
                $lookup: {
                  from: "users",
                  localField: "userId",
                  foreignField: "_id",
                  as: "user",
                  pipeline: [
                    {
                      $project: {
                        _id: 1,
                        username: 1,
                        avatar: 1,
                      },
                    },
                  ],
                },
              },
              {
                $addFields: {
                  user: { $arrayElemAt: ["$user", 0] },
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
                  nestedComments: {
                    $function: {
                      body: function (comments) {
                        function nestComments(parentId) {
                          return comments
                            .filter(
                              (comment) =>
                                comment.commentable.toString() ===
                                parentId.toString()
                            )
                            .map((comment) => ({
                              ...comment,
                              children: nestComments(comment._id),
                            }));
                        }
                        return nestComments(this._id);
                      },
                      args: ["$nestedComments"],
                      lang: "js",
                    },
                  },
                },
              },
              { $skip: skip },
              { $limit: size },
              {
                $project: {
                  _id: 1,
                  content: 1,
                  user: 1,
                  countOfLikes: 1,
                  createdAt: 1,
                  updatedAt: 1,
                  nestedComments: 1,
                },
              },
            ],
            totalComments: [
              {
                $match: {
                  onModel: "Tweet",
                  commentable: new mongoose.Types.ObjectId(data._id),
                },
              },
              { $count: "count" },
            ],
          },
        },
      ]);

      const comments = result[0].comments;
      const totalComments = result[0].totalComments[0]?.count || 0;

      return {
        comments,
        pageInfo: {
          currentPage: page,
          pageSize: size,
          totalComments,
          totalPages: Math.ceil(totalComments / size),
        },
      };
    } catch (error) {
      console.error(
        "Error in Comment Repository while getting comments for tweet:",
        error
      );
      throw error;
    }
  }
}

export default CommentRepository;
