import { Injectable } from '@nestjs/common';
import { UserSeeder } from './user.seeder';
import { ServiceSeeder } from './service.seeder';

@Injectable()
export class DatabaseSeeder {
  constructor(
    private readonly userSeeder: UserSeeder,
    private readonly serviceSeeder: ServiceSeeder,
  ) {}

  async seed() {
    await this.userSeeder.seed();
    await this.serviceSeeder.seed();
  }
}
