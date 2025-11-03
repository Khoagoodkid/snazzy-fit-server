import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AuthModule } from '../src/auth/auth.module';
import { UserService } from '../src/user/user.service';
// import { AuthService } from 'src/auth/auth.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication<App>;

  const mockUserService = {};
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    })
    .overrideProvider(UserService)
    .useValue(mockUserService)
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
  });
});
