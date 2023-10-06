import express, { Request, Response } from 'express';
import { UserService } from '../service/userService';
import multer from 'multer';

export class UserController {
  public router = express.Router();
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/user/createUser', this.createUser);
    this.router.delete('/user/:email', this.deleteUser);
    this.router.patch('/user/:email', this.updateUser);
    this.router.get('/users', this.getAllUsers);
    this.router.get('/user/:email', this.getUserById);

    this.router.post(
      '/arquivos/post',
      multer().single('File'),
      this.uploadFiles,
    );
    this.router.get('/arquivos/get', this.getFiles);
    this.router.get('/arquivos/download/:fileName', this.downloadFiles);
    this.router.get('/github/:user', this.getGitHubUser);
  }

  private createUser = async (req: Request, res: Response) => {
    const userData = req.body;
    try {
      const newUser = await this.userService.createUser(userData);
      res.status(201).json(newUser);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro desconhecido' });
      }
    }
  };

  private deleteUser = async (req: Request, res: Response) => {
    const { email } = req.params;
    try {
      const deleteUser = await this.userService.deleteUser(email);
      res.status(201).json(deleteUser);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro desconhecido' });
      }
    }
  };

  private updateUser = async (req: Request, res: Response) => {
    const { email } = req.params;
    const userData = req.body;

    try {
      const updatedUser = await this.userService.updateUser(email, userData);
      res.status(201).json(updatedUser);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro desconhecido' });
      }
    }
  };

  private getAllUsers = async (req: Request, res: Response) => {
    const users = await this.userService.getAllUsers();

    res.json(users);
  };

  private getUserById = async (req: Request, res: Response) => {
    const { email } = req.params;
    const user = await this.userService.getUserById(email);

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'Usuário não encontrado' });
    }
  };

  private getGitHubUser = async (req: Request, res: Response) => {
    const { user } = req.params;

    const userGitHub = await this.userService.getGitHubUser(user);

    if (userGitHub) {
      res.json(userGitHub);
    } else {
      res.status(404).json({ message: 'Usuário não encontrado' });
    }
  };

  private uploadFiles = async (req: Request, res: Response) => {
    const file = req.file;

    if (!file) {
      res.status(400).json({ error: 'Arquivo não fornecido' });
      return;
    }
    const fileSizeInBytes = file.size;
    const fileSizeInKB = fileSizeInBytes / 1024;
    const fileSizeInMB = fileSizeInKB / 1024;

    if (fileSizeInKB < 1 || fileSizeInMB > 5) {
      res.status(400).json({
        error:
          'Tamanho inválido do arquivo. O arquivo deve ter no mínimo 1KB e no máximo 5MB.',
      });
      return;
    }
    try {
      const result = await this.userService.uploadFile(file);
      res.json({ message: 'Arquivo enviado com sucesso', result });
    } catch (error) {
      res.status(500).json({ error: 'Falha ao enviar o arquivo' });
    }
  };

  private getFiles = async (req: Request, res: Response) => {
    const files = await this.userService.getFiles();

    res.json(files);
  };

  private downloadFiles = async (req: Request, res: Response) => {
    const { fileName } = req.params;

    const fileToDownload = await this.userService.downloadFile(fileName);
    if (fileToDownload) {
      const fileBuffer = Buffer.from(fileToDownload.file, 'base64');
      const filename = fileToDownload.fileName;

      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}"`,
      );
      res.send(fileBuffer);
    } else {
      res.status(500).json({ error: 'Erro ao fazer o download do arquivo' });
    }
  };
}
