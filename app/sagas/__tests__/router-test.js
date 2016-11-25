jest.unmock('./testSaga');
jest.unmock('../router');
jest.unmock('../../state/session');
jest.unmock('../../selectors');

import test from './testSaga';
import { onLocationChange } from '../router';
import { leave } from '../../state/session';
import { getSessionId } from '../../selectors';
import { put, select } from 'redux-saga/effects';

describe('Sagas - router', () => {
    it('When a user changes location to /', () => {
        test(onLocationChange({ payload: { pathname: '/' } }),
        (result, andReturns, andThen) => {
            expect(result()).toEqual(select(getSessionId));
            andReturns('123');

            expect(result()).toEqual(put(leave()));
            andThen();
        });
    });

    it('When a user changes location to /session/xxx', () => {
        test(onLocationChange({ payload: { pathname: '/session/xxx' } }),
        (result) => {
            expect(result()).not.toEqual(select(getSessionId));
        });
    });

    it('When a user changes location to / and no session is running', () => {
        test(onLocationChange({ payload: { pathname: '/' } }),
        (result, andReturns, andThen) => {
            expect(result()).toEqual(select(getSessionId));
            andReturns(null);

            expect(result()).not.toEqual(put(leave()));
            andThen();
        });
    });
});
