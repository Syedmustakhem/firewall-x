import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/user.repository.js";
import { generateToken } from "../utils/jwt.js";

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = generateToken(user.id, user.email, user.role);

    const { password_hash, ...safeUser } = user;

    return { token, user: safeUser };
  }

  async register(email: string, password: string) {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new Error("User already exists");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await this.userRepository.create(email, passwordHash, "user");

    const { password_hash, ...safeUser } = user;

    return safeUser;
  }
}