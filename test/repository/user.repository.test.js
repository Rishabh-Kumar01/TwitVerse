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