/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';

import { typeOrmConfig } from '../src/config/typeorm.config';
import { UserRepository } from '../src/auth/user.repository';
import { AuthModule } from '../src/auth/auth.module';
import { User } from '../src/auth/user.entity';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
          AuthModule,
          TypeOrmModule.forRoot(typeOrmConfig),
          TypeOrmModule.forFeature([User]),
          PassportModule.register({defaultStrategy: 'jwt'}),
          JwtModule.register({
            secret: 'jwt-secret',
            signOptions: {
              expiresIn: 3600,
            }
          }),
        ],
    }).compile();

    userRepository = moduleFixture.get<UserRepository>(UserRepository);

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/register (POST)', async () => {
    const userRegisterDto = {
        name: 'test1234',
        email: 'test12as3a45@test12345678.com',
        password: '1234'   
    }

    const data = await request(app.getHttpServer())
      .post('/auth/register')
      .send(userRegisterDto)
      .expect(201)

    const response = data.body

    const user = await userRepository.findOne(response.user_id)

    expect(response).toEqual({
        email: userRegisterDto.email,
        name: userRegisterDto.name,
        password: user.password,
        user_id: user.user_id,
        created_at: expect.any(String),
        updated_at: expect.any(String),
        token: expect.any(String)
    })

    await userRepository.remove(user)

    return data
  });

  it('/auth/login (POST)', async () => {
    const userRegisterDto = {
      name: 'test1234',
      email: 'test12as3a45@test12345678.com',
      password: '1234'   
    }

    await request(app.getHttpServer())
      .post('/auth/register')
      .send(userRegisterDto)
      .expect(201)

    const userLoginDto = {
        email: 'test12as3a45@test12345678.com',
        password: '1234'   
    }

    const data = await request(app.getHttpServer())
      .post('/auth/login')
      .send(userLoginDto)
      .expect(201)

    const response = data.body

    const user = await userRepository.findOne(response.user_id)

    expect(response).toEqual({
        email: userRegisterDto.email,
        name: userRegisterDto.name,
        password: user.password,
        user_id: user.user_id,
        created_at: expect.any(String),
        updated_at: expect.any(String),
        token: expect.any(String)
    })

    await userRepository.remove(user)

    return data
  });

  it('/auth/user (GET)', async () => {
    const userRegisterDto = {
      name: 'test1234',
      email: 'test12as3a45@test12345678.com',
      password: '1234'   
    }

    const login = await request(app.getHttpServer())
      .post('/auth/register')
      .send(userRegisterDto)
      .expect(201)

    const response = login.body

    const user = await userRepository.findOne(response.user_id)

    expect(response).toEqual({
      email: userRegisterDto.email,
      name: userRegisterDto.name,
      password: user.password,
      user_id: user.user_id,
      created_at: expect.any(String),
      updated_at: expect.any(String),
      token: expect.any(String)
    })

    const data = await request(app.getHttpServer())
      .get('/auth/user')
      .set('Authorization', `Bearer ${response.token}`)
      .expect(200)

    expect(response).toEqual({
      email: userRegisterDto.email,
      name: userRegisterDto.name,
      password: user.password,
      user_id: user.user_id,
      created_at: expect.any(String),
      updated_at: expect.any(String),
      token: expect.any(String)
    })

    await userRepository.remove(user)

    return data
  });

});
