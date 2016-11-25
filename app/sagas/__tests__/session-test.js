jest.unmock('./testSaga');
jest.unmock('../session');
jest.unmock('../../state/session');

import test from './testSaga';
import { onCreateSession,
    storeSessionToLocalStorage,
    doLoadPreviousSessions,
    onRenameSession,
    onAutoJoin
} from '../session';
import { createSessionSuccess,
    renameSession,
    joinSession,
    receiveClientList,
    loadPreviousSessions
} from '../../state/session';
import { getCurrentUser, getSessionId } from '../../selectors';
import { put, call, select } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import ls from 'local-storage';
import shortid from 'shortid';
import moment from 'moment';

const previousSessions = {
    Marcel: [
        { id: '1', name: 'Retro 1', lastJoin: moment('2014-04-19').unix() },
        { id: '2', name: 'Retro 2', lastJoin: moment('1952-04-24').unix() },
        { id: '3', name: 'Retro 3', lastJoin: moment('1982-11-01').unix() }
    ],
    Bob: [
        { id: '4', name: 'Retro 4', lastJoin: moment('1983-04-19').unix() }
    ]
};

describe('Sagas - session', () => {
    it('When a session is created by the user', () => {
        test(onCreateSession({ payload: 'My Session' }), (result, andReturns, andThen) => {
            expect(result()).toEqual(call(shortid.generate));
            andReturns('ABCD');

            expect(result()).toEqual(select(getCurrentUser));
            andReturns('Marcel');

            expect(result()).toEqual(put(createSessionSuccess({ sessionId: 'ABCD' })));
            andThen();

            expect(result()).toEqual(call(storeSessionToLocalStorage, 'Marcel', 'ABCD'));
            andThen();

            expect(result()).toEqual(put(renameSession('My Session')));
            andThen();

            expect(result()).toEqual(put(joinSession({ sessionId: 'ABCD', user: 'Marcel' })));
            andThen();

            expect(result()).toEqual(put(receiveClientList(['Marcel'])));
            andThen();

            expect(result()).toEqual(put(push('/session/ABCD')));
            andThen();
        });
    });

    it('Load Previous sessions (when they exists)', () => {
        test(doLoadPreviousSessions(), (result, andReturns, andThen) => {
            expect(result()).toEqual(select(getCurrentUser));
            andReturns('Marcel');

            expect(result()).toEqual(call(ls, 'sessions'));
            andReturns(previousSessions);

            expect(result()).toEqual(put(loadPreviousSessions([
                { id: '1', name: 'Retro 1', lastJoin: moment('2014-04-19').unix() },
                { id: '2', name: 'Retro 2', lastJoin: moment('1952-04-24').unix() },
                { id: '3', name: 'Retro 3', lastJoin: moment('1982-11-01').unix() }
            ])));
            andThen();
        });
    });

    it('Load Previous sessions (when they dont exists)', () => {
        test(doLoadPreviousSessions(), (result, andReturns, andThen) => {
            expect(result()).toEqual(select(getCurrentUser));
            andReturns('Maurice');

            expect(result()).toEqual(call(ls, 'sessions'));
            andReturns(previousSessions);

            expect(result()).toEqual(put(loadPreviousSessions([])));
            andThen();
        });
    });

    it('When a session is renamed', () => {
        test(onRenameSession({ payload: 'My New Name' }), (result, andReturns, andThen) => {
            expect(result()).toEqual(select(getSessionId));
            andReturns('2');

            expect(result()).toEqual(select(getCurrentUser));
            andReturns('Marcel');

            expect(result()).toEqual(call(ls, 'sessions'));
            andReturns(previousSessions);

            expect(result()).toEqual(call(ls, 'sessions', previousSessions));
            andThen();

            expect(result()).toEqual(put(loadPreviousSessions([
                { id: '1', name: 'Retro 1', lastJoin: moment('2014-04-19').unix() },
                { id: '2', name: 'My New Name', lastJoin: moment('1952-04-24').unix() },
                { id: '3', name: 'Retro 3', lastJoin: moment('1982-11-01').unix() }
            ])));
            andThen();
        });
    });

    it('When a user auto joins', () => {
        test(onAutoJoin({ payload: 'ABCD' }), (result, andReturns, andThen) => {
            expect(result()).toEqual(select(getSessionId));
            andReturns('WXYZ');

            expect(result()).toEqual(select(getCurrentUser));
            andReturns('Claude');

            expect(result()).toEqual(put(joinSession({
                sessionId: 'ABCD',
                user: 'Claude'
            })));
            andThen();

            expect(result()).toEqual(call(storeSessionToLocalStorage, 'Claude', 'ABCD'));
            andThen();
        });
    });
});
