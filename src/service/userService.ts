import { User } from '../models/user.model';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { postalCodeInterface } from '../types/error';
import { Githubinterface } from '../types/github';
import { UploadedFile } from '../types/file';
import { findId } from '../types/findId';

export class UserService {
  prisma = new PrismaClient();

  constructor() {}

  async createUser(userData: User): Promise<{ message: string }> {
    try {
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
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(email: string): Promise<{ message: string }> {
    try {
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
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id: any, user: any): Promise<{ message: string }> {
    try {
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
    } catch (error) {
      throw error;
    }
  }

  async getAllUsers(): Promise<findId[]> {
    try {
      const findAllUsers = await this.prisma.user.findMany({});

      const mappedUsers: findId[] = findAllUsers.map((user) => {
        return {
          email: user.email,
          name: user.name,
          addres: {
            state: user.state ?? 'Estado não encontrado.',
            street: user.street ?? 'Rua não encontrada.',
            neighborhood: user.neighborhood ?? 'Vizinhança não encontrada.',
            postalCode: user.postalCode || '',
          },
        };
      });

      return mappedUsers;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(email: string) {
    try {
      const findUserById = await this.prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (!findUserById) {
        throw new Error('Usuario não encontrado');
      }

      const data_to_return: findId = {
        name: findUserById.name,
        email: findUserById.email,
        addres: {
          neighborhood:
            findUserById.neighborhood ?? 'Vizinhança não encontrada.',
          postalCode: findUserById.postalCode,
          state: findUserById.state ?? 'Estado não encontrado.',
          street: findUserById.street ?? 'Rua não encontrada.',
        },
      };

      return data_to_return;
    } catch (error) {
      throw error;
    }
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
    try {
      const a = file.buffer;
      const b = a.toString('base64');

      await this.prisma.arquivo.create({
        data: {
          file: b,
          fileName: file.originalname,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async getFiles() {
    try {
      const getAllFiles = await this.prisma.arquivo.findMany({});
      return getAllFiles;
    } catch (error) {
      throw error;
    }
  }

  async downloadFile(file: string) {
    try {
      const files = await this.prisma.arquivo.findUnique({
        where: {
          fileName: file,
        },
      });
      return files;
    } catch (error) {
      throw error;
    }
  }
}
