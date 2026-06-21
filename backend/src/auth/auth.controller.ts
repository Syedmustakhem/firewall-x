import { Request, Response } from "express";
import { AuthService } from "./auth.service.js";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async register(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await this.authService.register(email, password);
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      return res.json(result);
    } catch (error: any) {
      return res.status(401).json({ message: error.message });
    }
  }
}