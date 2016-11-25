jest.unmock('./testSaga');
jest.unmock('../posts');
jest.unmock('../../state/posts');
jest.unmock('../../selectors');

import test from './testSaga';
import { onAddPost, onLike } from '../posts';
import { addPostSuccess, likeSuccess } from '../../state/posts';
import { getCurrentUser } from '../../selectors';
import { put, call, select } from 'redux-saga/effects';
import uuid from 'node-uuid';

describe('Sagas - posts', () => {
    it('When a user adds a post', () => {
        test(onAddPost({ payload: { postType: 'well', content: 'Hello You' } }),
        (result, andReturns, andThen) => {
            expect(result()).toEqual(select(getCurrentUser));
            andReturns('Antoine');

            expect(result()).toEqual(call(uuid.v1));
            andReturns('AA-BB-CC');

            expect(result()).toEqual(put(addPostSuccess({
                id: 'AA-BB-CC',
                postType: 'well',
                content: 'Hello You',
                user: 'Antoine',
                likes: [],
                dislikes: []
            })));
            andThen();
        });
    });

    it('When a user liks a post', () => {
        test(onLike({ payload: { post: { id: 123 }, like: true } }),
        (result, andReturns, andThen) => {
            expect(result()).toEqual(select(getCurrentUser));
            andReturns('Danièle');

            expect(result()).toEqual(put(likeSuccess({
                post: { id: 123 },
                like: true,
                user: 'Danièle'
            })));
            andThen();
        });
    });
});
