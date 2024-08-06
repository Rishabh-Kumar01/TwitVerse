import { User } from "../models/index.js";
import CrudRepository from "./crud.repository.js";
import {responseCodes} from "../utils/imports.util.js"

const { StatusCodes } = responseCodes;

class UserRepository extends CrudRepository {
  constructor() {
    super(User);
  }

  static getInstance() {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }
    return UserRepository.instance;
  }

  async findByEmail(email) {
    try {
      console.log("repo", email)
      const user = await User.findOne({
        email: email
      });
      if (!user) {
        console.log("User Not Found");
        throw new Error(
          "UserNotFound",
          "User Not Found",
          "User with the given Email is not found",
          StatusCodes.NOT_FOUND
        );
      }
      return user;
    } catch (error) {
      console.log("Something Went Wrong: User Repository: Find User By Email");
      throw error;
    }
  }
}

export default UserRepository;
