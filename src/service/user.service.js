import { UserRepository } from "../repository/index.repository.js";
import CrudService from "./crud.service.js";
import { jwt, bcrypt } from "../utils/imports.util.js";
import { serverConfig } from "../config/serverConfig.js";

class UserService extends CrudService {
  constructor() {
    const userRepository = UserRepository.getInstance();
    super(userRepository);
    this.userRepository = userRepository;
  }

  static getInstance() {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async #createToken(user) {
    try {
      const token = jwt.sign(user, serverConfig.JWT_KEY, { expiresIn: "24h" });
      return token;
    } catch (error) {
      console.log("Something Went Wrong: User Service: Create Token");
      throw { error };
    }
  }

  async #checkPassword(password, hashedPassword) {
    try {
      const response = await bcrypt.compare(password, hashedPassword);
      return response;
    } catch (error) {
      console.log("Something Went Wrong: User Service: Check Password");
      throw { error };
    }
  }

  async logIn(email, password) {
    try {
      console.log("service", email, password);
      const user = await this.userRepository.findByEmail(email);

      if (!user) {
        console.log("User Not Found");
        throw { message: "User Not Found" };
      }

      const isPasswordValid = await this.#checkPassword(
        password,
        user.password
      );

      if (!isPasswordValid) {
        console.log("Invalid Password");
        throw { message: "Invalid Password" };
      }

      const token = await this.#createToken({
        id: user.id,
        email: user.email,
      });

      return token;
    } catch (error) {
      console.log("Something Went Wrong: User Service: Log In User");
      throw { error };
    }
  }
}

export default UserService;
