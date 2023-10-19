/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

import { Test, TestingModule } from "@nestjs/testing";
import { StoryService } from "../Services/story.service";
import { StoryController } from "./story.controller"
import { AuthService } from "../../Auth/Services/auth.service";
import { StoryDTO } from "../Dto/story.dto";
import { Story } from "../Entities/story.entity";
import { HttpStatus } from "@nestjs/common";

describe('StoryController', () => {
    let storyController: StoryController;
    let storyService: StoryService;
    let authService: AuthService

    const mockStoryService = {
        getAllStories: jest.fn(),
        registerStory: jest.fn(),
        getUserStories: jest.fn(),
        getStoryById: jest.fn(),
        getStoryOnlyByStoryId: jest.fn(),
        deleteStoryById: jest.fn(),
        getStoryByTitle: jest.fn(),
        getStoriesByTags: jest.fn(),
    };
    const mockAuthService = {
        
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [StoryController],
            providers: [
                {
                    provide: StoryService,
                    useValue: mockStoryService,
                },
                {
                    provide: AuthService,   
                    useValue: mockAuthService,
                },
            ],
        }).compile();

        storyController = module.get<StoryController>(StoryController);
        storyService = module.get<StoryService>(StoryService);
    });

    it('should be defined', () => {
        expect(storyController).toBeDefined();
    });

    describe('getAllStories', () => {
        it('should return an array of stories', async () => {
            const result = [];
            mockStoryService.getAllStories.mockResolvedValue(result);
            expect(await storyController.getAllStories()).toBe(result);
        });
    });

    describe('registerStory', () => {
        it('should register a new story to the user author',async () => {
            const storyDto: StoryDTO = {
                title: "Example",
                description: "Example description",
                userid: 1,
                username: "User Example",
                tags: []
            };

            const createdStory: Story = {
                ...storyDto,
                id: 1,
                chapters: [],
                created_at: new Date(),
            };

            const mockReq = {
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await storyController.registerStory(storyDto, mockReq as any, mockRes as any);
            expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.CREATED);
        });
    });
});