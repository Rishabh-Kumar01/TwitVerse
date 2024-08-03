import { UserRepository } from "../repository/index.repository.js";
import CrudService from "./crud.service.js";

class UserService extends CrudService {
  constructor() {
    const userRepository = UserRepository.getInstance();
    super(userRepository);
  }

  static getInstance() {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }
}

export default UserService;
