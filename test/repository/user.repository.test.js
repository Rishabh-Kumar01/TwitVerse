import { jest } from '@jest/globals';
import {TweetRepository} from '../../src/repository/index.repository.js';
import {Tweet} from '../../src/models/index.js';

jest.mock('../../src/models/tweet.model.js');

describe('Create User', () => {

    test('Should create a user and return it', async () => {
        const data = {
            name: 'Rishabh',
            email: 'admin@mail.com',
            password: 'admin123'
        }

        const spy = jest.spyOn(Tweet, 'create').mockImplementation(() => {
            return {
                ...data,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        })

        const user = await TweetRepository.getInstance().create(data);

        expect(spy).toHaveBeenCalled();
        expect(user.name).toBe(data.name);
        expect(user.email).toBe(data.email);
        expect(user.password).toBe(data.password);
        expect(user.createdAt).toBeDefined();
        expect(user.updatedAt).toBeDefined();
    })

    
})