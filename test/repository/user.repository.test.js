import { jest } from '@jest/globals';
import {UserRepository} from '../../src/repository/index.repository.js';
import {User} from '../../src/models/index.js';

jest.mock('../../src/models/tweet.model.js');

describe('Create User', () => {

    let userRepository;

    beforeEach(() => {
        userRepository = UserRepository.getInstance();
    });

    test('Should create a user and return it', async () => {
        const data = {
            name: 'Rishabh',
            email: 'admin@mail.com',
            password: 'admin123'
        }

        const spy = jest.spyOn(User, 'create').mockImplementation(() => {
            return {
                ...data,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        })

        const user = await userRepository.create(data);

        expect(spy).toHaveBeenCalled();
        expect(user.name).toBe(data.name);
        expect(user.email).toBe(data.email);
        expect(user.password).toBe(data.password);
        expect(user.createdAt).toBeDefined();
        expect(user.updatedAt).toBeDefined();
    })


    test('Should throw an error if user creation fails', async () => {
        const data = {
            name: 'Rishabh',
            email: 'admin@mail.com',
            password: 'admin123'
        }

        const errorMessage = 'Error creating user';
        const spy = jest.spyOn(User, 'create').mockImplementation(() => {
            throw new Error(errorMessage);
        })

        await expect(userRepository.create(data)).rejects.toThrow(`Error in Crud Repository while creating: Error: ${errorMessage}`);
        expect(spy).toHaveBeenCalled();
    })
    
    test('Should handle missing required fields', async () => {
        const incompleteData = {
            name: 'Rishabh'
            // Missing email and password
        }

        const errorMessage = 'User validation failed: email: Path `email` is required., password: Path `password` is required.';
        const spy = jest.spyOn(User, 'create').mockImplementation(() => {
            throw new Error(errorMessage);
        })

        await expect(userRepository.create(incompleteData)).rejects.toThrow(`Error in Crud Repository while creating: Error: ${errorMessage}`);
        expect(spy).toHaveBeenCalled();
    })

    test('Should handle duplicate email error', async () => {
        const data = {
            name: 'Rishabh',
            email: 'existing@mail.com',
            password: 'admin123'
        }

        const errorMessage = 'E11000 duplicate key error collection: test.users index: email_1 dup key: { email: "existing@mail.com" }';
        const spy = jest.spyOn(User, 'create').mockImplementation(() => {
            throw new Error(errorMessage);
        })

        await expect(userRepository.create(data)).rejects.toThrow(`Error in Crud Repository while creating: Error: ${errorMessage}`);
        expect(spy).toHaveBeenCalled();
    })
})

describe('User Repository - findByEmail', () => {
    let userRepository;

    beforeEach(() => {
        userRepository = UserRepository.getInstance();
        jest.clearAllMocks();
    });

    test('Should successfully find a user by email', async () => {
        const email = 'test@example.com';
        const mockUser = {
            _id: 'user123',
            email: email,
            name: 'Test User'
        };

        const findOneSpy = jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);

        const result = await userRepository.findByEmail(email);

        expect(findOneSpy).toHaveBeenCalledWith({ email: email });
        expect(result).toEqual(mockUser);
    });

    test('Should throw an error if user is not found', async () => {
        const email = 'nonexistent@example.com';

        const findOneSpy = jest.spyOn(User, 'findOne').mockResolvedValue(null);

        await expect(userRepository.findByEmail(email)).rejects.toThrow('User Not Found');
        expect(findOneSpy).toHaveBeenCalledWith({ email: email });
    });

    test('Should throw an error if database query fails', async () => {
        const email = 'test@example.com';
        const errorMessage = 'Database connection error';

        const findOneSpy = jest.spyOn(User, 'findOne').mockRejectedValue(new Error(errorMessage));

        await expect(userRepository.findByEmail(email)).rejects.toThrow(errorMessage);
        expect(findOneSpy).toHaveBeenCalledWith({ email: email });
    });

    test('Should handle empty email input', async () => {
        const email = '';

        const findOneSpy = jest.spyOn(User, 'findOne').mockResolvedValue(null);

        await expect(userRepository.findByEmail(email)).rejects.toThrow('User Not Found');
        expect(findOneSpy).toHaveBeenCalledWith({ email: email });
    });

    test('Should handle case-insensitive email search', async () => {
        const email = 'TEST@example.com';
        const mockUser = {
            _id: 'user123',
            email: 'test@example.com',
            name: 'Test User'
        };

        const findOneSpy = jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);

        const result = await userRepository.findByEmail(email);

        expect(findOneSpy).toHaveBeenCalledWith({ email: email });
        expect(result).toEqual(mockUser);
    });
});