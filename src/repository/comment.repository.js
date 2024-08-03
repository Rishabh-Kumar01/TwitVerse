import CrudRepository from "./crud.repository.js";
import { Comment } from "../models/index.js";

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
}

export default CommentRepository;
