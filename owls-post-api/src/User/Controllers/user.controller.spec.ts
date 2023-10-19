/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../Services/user.service';
import { UserDTO } from '../Dto/user.dto';
import { User } from '../Entities/user.entity';
import { ReturnUserDto } from '../Dto/returnUser.dto';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  // Mock para o UserService
  const mockUserService = {
    getAllUsers: jest.fn(),
    registerUser: jest.fn(),
    getUserById: jest.fn(),
    changeDescription: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const result = [];
      mockUserService.getAllUsers.mockResolvedValue(result);
      expect(await userController.getAllUsers()).toBe(result);
    });
  });


  describe('registerUser', () => {
    it('should register a new user',async () => {
      const userDto: UserDTO = {
        username: 'JohnDoe',
        email: 'john@example.com',
        password: 'securePassword123',
        followers_count: 0,
        description: '',
        token: ''
      };

      const createdUser: User = {
        ...userDto,
        id: 1,
        created_at: new Date(),
        followers: []
      };

      mockUserService.registerUser.mockResolvedValue(createdUser);
      expect(await userController.registerUser(userDto)).toEqual(createdUser);
    })

    it('should throw an error if signup fails',async () => {
      const userDto: UserDTO = {
        username: 'JohnDoe',
        email: 'john@example.com',
        password: 'securePassword123',
        followers_count: 0,
        description: '',
        token: ''
      };

      mockUserService.registerUser.mockRejectedValue(new Error('Signup failed for some reason'));
      await expect(userController.registerUser(userDto)).rejects.toThrow('Signup failed for some reason');
    });
  });

  describe('getUserById', () => {
    it('should return an user',async () => {
      const result: ReturnUserDto = {
        id: 1,
        username: 'JohnDoe',
        email: 'john@example.com',
        followers_count: 0,
        description: '',
        created_at: undefined,
      };
      const id = 1;
      mockUserService.getUserById.mockResolvedValue(result);
      expect(await userController.getUserById(id)).toEqual(result);
    });
  });

  describe('changeDescription', () => {
    it('should change the user description', async () => {
      const result = {
        newDescription: 'New Description',
        userid: '1',
      };
      mockUserService.changeDescription.mockResolvedValue(result);
      expect(await userController.changeDescription(result));
    });
  });

});
