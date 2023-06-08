import { User } from '../models/user.model';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { postalCodeInterface } from '../types/error';
import { Githubinterface } from '../types/github';
import { UploadedFile } from '../types/file';

export class UserService {
  prisma = new PrismaClient();

  constructor() {}

  async createUser(userData: User): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: userData.email,
      },
    });

    if (user) {
      throw new Error('Usuario já existe na base de dados');
    }
    const findByCep: postalCodeInterface = await axios.get(
      `https://brasilapi.com.br/api/cep/v2/${userData.postalCode}`,
    );

    if (!user) {
      const newUser: User = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        login: userData.login,
        postalCode: userData.postalCode,
        street: findByCep.data.street,
        neighborhood: findByCep.data.neighborhood,
        state: findByCep.data.state,
      };

      await this.prisma.user.create({
        data: newUser,
      });
    }

    return { message: 'Usuario Criado' };
  }

  async deleteUser(email: string): Promise<{ message: string }> {
    const findUser = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!findUser) {
      throw new Error('Usuario não cadastrado na base de dados');
    }

    await this.prisma.user.delete({
      where: {
        email,
      },
    });
    return { message: 'Usuario removido da base de dados com sucesso.' };
  }

  async updateUser(id: any, user: any): Promise<{ message: string }> {
    const userUpdate = await this.prisma.user.findUnique({
      where: {
        email: id,
      },
    });

    if (!userUpdate) {
      throw new Error('Usuario não encontrado');
    }
    if (userUpdate) {
      await this.prisma.user.update({
        where: {
          email: user.email,
        },
        data: {
          neighborhood: user.neighborhood,
          postalCode: user.postalCode,
          state: user.state,
          street: user.street,
          name: user.name,
          login: user.login,
          password: user.password,
        },
      });
    }
    return { message: 'Usuario alterado com sucesso!' };
  }

  async getAllUsers() {
    const findAllUsers = await this.prisma.user.findMany({});
    return findAllUsers;
  }

  async getUserById(email: string) {
    const findUserById = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return findUserById;
  }

  async getGitHubUser(user: string): Promise<Githubinterface | undefined> {
    try {
      const response = await axios.get(`https://api.github.com/users/${user}`);
      if (response) {
        return response.data;
      }
    } catch (error: any) {
      console.error('Erro na requisição:', error.message);
    }
  }

  async uploadFile(file: UploadedFile): Promise<void> {
    console.log(file);
    const a = file.buffer;
    const b = a.toString('base64');

    await this.prisma.arquivo.create({
      data: {
        file: b,
        fileName: file.originalname,
      },
    });
  }

  async getFiles() {
    const getAllFiles = await this.prisma.arquivo.findMany({});
    return getAllFiles;
  }

  async downloadFile(file: string) {
    console.log(file);
    const files = await this.prisma.arquivo.findUnique({
      where: {
        fileName: file,
      },
    });
    return files;
  }
}
