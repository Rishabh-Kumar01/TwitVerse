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
}

export default UserRepository;
