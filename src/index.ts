import express, { Express, Request, Response } from 'express';
import { UserService } from './service/userService';
import { UserController } from './controller/userController';

const app: Express = express();

const userService = new UserService();

const userController = new UserController(userService);

app.use(express.json());

app.use('/', userController.router);
const PORT = 3030;

app.listen(PORT, () => {
  console.log(`listen to port ${PORT}`);
});
