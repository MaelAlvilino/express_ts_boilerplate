// controllers/userController.ts

import express, { Request, Response } from 'express';
import { UserService } from '../service/userService';

export class UserController {
  public router = express.Router();
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/createUser', this.createUser);
    this.router.delete('/:email', this.deleteUser);
    // this.router.patch('/:email', this.updateUser);
    // this.router.get('/', this.getAllUsers);
    // this.router.get('/:id', this.getUserById);
  }

  private createUser = async (req: Request, res: Response) => {
    // {
    //   "name": "jhon",
    //   "email": "jhon.does@github.com",
    //   "login": "jhon.doe",
    //   "password": "1234"
    // }

    const userData = req.body;
    try {
      const newUser = await this.userService.createUser(userData);
      res.status(201).json(newUser);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  private deleteUser = async (req: Request, res: Response) => {
    const { email } = req.params;
    try {
      const deleteUser = await this.userService.deleteUser(email);
      res.status(201).json(deleteUser);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  // private updateUser = (req: Request, res: Response) => {
  //   const { id } = req.params;
  //   const userData = req.body;
  //   const updatedUser = this.userService.updateUser(id, userData);

  //   if (updatedUser) {
  //     res.json(updatedUser);
  //   } else {
  //     res.status(404).json({ message: 'Usuário não encontrado' });
  //   }
  // };
  // private getAllUsers = (req: Request, res: Response) => {
  //   const users = this.userService.getAllUsers();
  //   res.json(users);
  // };

  // private getUserById = (req: Request, res: Response) => {
  //   const { id } = req.params;
  //   const user = this.userService.getUserById(id);

  //   if (user) {
  //     res.json(user);
  //   } else {
  //     res.status(404).json({ message: 'Usuário não encontrado' });
  //   }
  // };
}
