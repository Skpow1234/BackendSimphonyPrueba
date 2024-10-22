import { Injectable } from '@nestjs/common';
import { UserService } from '../services/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserSeeder {
  constructor(private readonly userService: UserService) {}

  async seed() {
    const users = [
      {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'StrongP@ssw0rd1!',
        role: 'user',
      },
      {
        name: 'Jane Smith',
        email: 'janesmith@example.com',
        password: 'Secur3P@ss2!',
        role: 'user',
      },
      {
        name: 'Admin User',
        email: 'adminuser@example.com',
        password: 'AdminS3cretP@ss!',
        role: 'admin',
      },
    ];

    for (const user of users) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(user.password, salt);
      await this.userService.register({
        ...user,
        password: hashedPassword,
      });
    }

    console.log('Users seeded successfully');
  }
}
