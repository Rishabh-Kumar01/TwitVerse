import { User } from "../models/index.js";
import CrudRepository from "./crud.repository.js";


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
      const user = await User.findOne({
        email: email
      });
      if (!user) {
        console.log("User Not Found");
        throw new Error("User Not Found");
      }
      return user;
    } catch (error) {
      console.log("Something Went Wrong: User Repository: Find User By Email");
      throw error;
    }
  }
}

export default UserRepository;
