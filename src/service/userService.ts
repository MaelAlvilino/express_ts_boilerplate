import { User } from '../models/user.model';
import { PrismaClient } from '@prisma/client';

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

    if (!user) {
      const newUser: User = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        login: userData.login,
        postalCode: userData.postalCode,
      };

      await this.prisma.user.create({
        data: newUser,
      });
    }

    return { message: 'Usuario Criado' };
  }

  async deleteUser(email: string): Promise<{ message: string }> {
    console.log(email);
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

  //   updateUser(email: string): User | undefined {
  //     const user = this.prisma.user.update({
  //         where: {
  //             email,
  //         },
  //         data:{

  //         }
  //     });

  //     if (user) {
  //       user.name = userData.name;
  //       user.email = userData.email;

  //       return user;
  //     }

  //     return undefined;
  //   }

  //   getAllUsers(): User {
  //   }

  //   getUserById(id: string): User | undefined {
  //     return this.users.find((user) => user.id === id);
  //   }
}
