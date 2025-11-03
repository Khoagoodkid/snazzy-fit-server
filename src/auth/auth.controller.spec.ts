import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleService } from 'src/google/google.service';
import { v4 as uuidv4 } from 'uuid';
import { FastifyReply, FastifyRequest } from 'fastify';
import { CreatedResponse, GetResponse } from 'src/core/successResponse';
import { BusinessLogicError } from 'src/core/base.error';
import { ConfigService } from '@nestjs/config';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn((dto) => {
      return {
        id: uuidv4(),
        email: dto.email,
        created_at: String(Math.floor(Date.now() / 1000)),
      };
    }),
    login: jest.fn(
      (dto, reply, ip, userAgent, deviceId, fingerprint, behavior) => {
        // Simulate non-existing user error
        if (dto.email === 'nonexistent@gmail.com') {
          throw new BusinessLogicError('User not found', 401);
        }
        // Simulate wrong password error
        if (dto.password === 'wrongpassword') {
          throw new BusinessLogicError('Wrong password or email');
        }
        // Successful login
        return {
          id: uuidv4(),
          email: dto.email,
          username: 'test',
          role_id: '1',
          provider: 'email',
        };
      },
    ),
    getUserById: jest.fn((id) => {
      if (id === 'invalidid') {
        throw new BusinessLogicError('User not found');
      }
      return {
        id: id,
        email: 'email@gmail.com',
        username: 'test',
        role_id: '1',
        provider: 'email',
      };
    }),
  };

  const mockReply = {
    send: jest.fn(),
    setCookie: jest.fn(),
    clearCookie: jest.fn(),
  } as unknown as FastifyReply;

  const mockRequest = {
    headers: {
      'x-device-id': '1234567890',
      'x-fingerprint': '1234567890',
      'user-agent': 'test',
    },
    clientIp: '123.45.67.89',
    user: {
      id: '228e8214-fd70-4e78-af68-b0720fa99aba', // admin
    },
  };
  beforeEach(async () => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        GoogleService,
        ConfigService,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  const testShouldBeDefined = () => {
    expect(controller).toBeDefined();
  };

  const testShouldSignupANewUser = async () => {
    const dto = {
      email: 'test@example.com',
      password: '123456',
      username: 'test',
    };

    await controller.register(dto, mockReply);

    // ✅ check that reply.send() was called once
    expect(mockReply.send).toHaveBeenCalledTimes(1);

    // ✅ capture what was sent
    const sentResponse = (mockReply.send as jest.Mock).mock.calls[0][0];

    // ✅ assert on the actual payload
    expect(sentResponse.data).toMatchObject({
      id: expect.any(String),
      email: dto.email,
      created_at: expect.any(String),
    });
  };

  const testShouldLoginAValidUser = async () => {
    const dto = { email: 'draft@gmail.com', password: 'Password@1234' };
    await controller.login(
      dto,
      mockReply as FastifyReply,
      mockRequest as unknown as FastifyRequest,
    );

    expect(mockReply.send).toHaveBeenCalledTimes(1);

    const sentResponse = (mockReply.send as jest.Mock).mock.calls[0][0];

    expect(sentResponse.data).toMatchObject({
      id: expect.any(String),
      email: dto.email,
      username: expect.any(String),
      role_id: expect.any(String),
      provider: expect.any(String),
    });
  };

  const testShouldNotLoginANonExistingUser = async () => {
    const dto = { email: 'nonexistent@gmail.com', password: 'Password@1234' };

    await expect(
      controller.login(
        dto,
        mockReply as FastifyReply,
        mockRequest as unknown as FastifyRequest,
      ),
    ).rejects.toThrow(BusinessLogicError);
  };

  const testShouldNotLoginAWrongPasswordUser = async () => {
    const dto = { email: 'draft@gmail.com', password: 'wrongpassword' };

    await expect(
      controller.login(
        dto,
        mockReply as FastifyReply,
        mockRequest as unknown as FastifyRequest,
      ),
    ).rejects.toThrow(BusinessLogicError);
  };

  const testShouldReturnAValidGetMe = async () => {
    await controller.getMe(mockRequest as unknown as FastifyRequest, mockReply);

    const sentResponse = (mockReply.send as jest.Mock).mock.calls[0][0];

    expect(sentResponse).toBeInstanceOf(GetResponse);

    expect(authService.getUserById).toHaveBeenCalled();

    expect(sentResponse.data).toMatchObject({
      id: mockRequest.user.id,
      email: expect.any(String),
      username: expect.any(String),
      role_id: expect.any(String),
      provider: expect.any(String),
    });
  };

  const testInvalidGetMe = async () => {
    const inValidMockRequest = {
      user: {
        id: 'invalidid', // admin
      },
    };
    await expect(
      controller.getMe(
        inValidMockRequest as unknown as FastifyRequest,
        mockReply,
      ),
    ).rejects.toThrow(BusinessLogicError);
  };

  it('Should be defined', testShouldBeDefined);
  it('Should signup a new user', testShouldSignupANewUser);
  it('Should login a valid user', testShouldLoginAValidUser);
  it(
    'Should not login a non-existing user',
    testShouldNotLoginANonExistingUser,
  );
  it(
    'Should not login a wrong password user',
    testShouldNotLoginAWrongPasswordUser,
  );
  it('Should return a valid getMe', testShouldReturnAValidGetMe);
  it('Should throw an exception', testInvalidGetMe);
});
