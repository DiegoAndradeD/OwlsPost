/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../Entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import authConfig from '../../Auth/auth.config';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { UserDTO } from '../Dto/user.dto';
import { ReturnUserDto } from '../Dto/returnUser.dto';
import { mock } from 'node:test';

describe('UserService', () => {
    let service: UserService;
    let mockRepository;

    let hashSpy: jest.SpyInstance;
    let signSpy: jest.SpyInstance;

    beforeEach(async () => {
        mockRepository = {
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
        };

        hashSpy = jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
        signSpy = jest.spyOn(jwt, 'sign').mockReturnValue('testToken');

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
    });

    afterEach(() => {
        hashSpy.mockClear();
        signSpy.mockClear();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('registerUser', () => {
        const userDTO = {
            username: 'test',
            email: 'test@example.com',
            password: 'test123',
            followers_count: 0,
            description: '',
            token: ''
        };

        it('should successfully register a user', async () => {
            mockRepository.save.mockResolvedValue(userDTO);

            const result = await service.registerUser(userDTO);

            expect(result).toEqual(userDTO);
            expect(hashSpy).toHaveBeenCalled();
            expect(signSpy).toHaveBeenCalledWith(
                {
                    userid: userDTO.username,
                    email: userDTO.email,
                },
                authConfig.jwtSecret
            );
        });

        it('should throw ConflictException when username or email is already in use', async () => {
            const userDto: UserDTO = {
              username: 'JohnDoe',
              email: 'john@example.com',
              password: 'securePassword123',
              followers_count: 0,
              description: '',
              token: ''
            };
      
            mockRepository.save.mockRejectedValue(new Error('should throw ConflictException when username or email is already in use'));
            await expect(service.registerUser(userDto)).rejects.toThrow('should throw ConflictException when username or email is already in use');
          });
    });

    describe('getAllUsers', () => {
        it('should return an array of users', async () => {
            const usersArray = [
                {
                    username: 'test',
                    email: 'test@example.com',
                    password: 'test123',
                },
            ];

            mockRepository.find.mockResolvedValue(usersArray);
            const result = await service.getAllUsers();
            expect(result).toEqual(usersArray);
        });
    });

    describe('findOne', () => {
        it('shoudl return a user by its username', async () => {
            const user: ReturnUserDto = {
                id: 1,
                username: 'JohnDoe',
                email: 'john@example.com',
                followers_count: 0,
                description: '',
                created_at: undefined,
            };
            const id = '1';
            mockRepository.findOne.mockResolvedValue(user)
            const result = await service.findOne(id);
            expect(result).toEqual(user);

        });
    })
});
