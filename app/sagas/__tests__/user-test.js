jest.unmock('./testSaga');
jest.unmock('../user');
jest.unmock('../session');
jest.unmock('../../state/user');

import test from './testSaga';
import { onLogin, onAutoLogin, onLeaveSession, onChangeLanguage, onLogout } from '../user';
import { doLoadPreviousSessions } from '../session';
import { loginSuccess, changeLanguageSuccess } from '../../state/user';
import { put, call } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import ls from 'local-storage';

describe('Sagas - user', () => {
    it('When a user logs in', () => {
        test(onLogin({ payload: { name: 'Apolline' } }), (result, andReturns, andThen) => {
            expect(result()).toEqual(call(ls, 'username', 'Apolline'));
            andThen();

            expect(result()).toEqual(put(loginSuccess('Apolline')));
            andThen();

            expect(result()).toEqual(call(doLoadPreviousSessions));
            andThen();
        });
    });

    it('When a user auto logs in and has a username and language stored', () => {
        test(onAutoLogin(), (result, andReturns, andThen) => {
            expect(result()).toEqual(call(ls, 'username'));
            andReturns('Claire');

            expect(result()).toEqual(put(loginSuccess('Claire')));
            andThen();

            expect(result()).toEqual(call(ls, 'language'));
            andReturns('fr');

            expect(result()).toEqual(put(changeLanguageSuccess('fr')));
            andThen();

            expect(result()).toEqual(call(doLoadPreviousSessions));
            andThen();
        });
    });

    it('When a user auto logs in and has no username or language stored', () => {
        test(onAutoLogin(), (result, andReturns, andThen) => {
            expect(result()).toEqual(call(ls, 'username'));
            andThen();

            expect(result()).toEqual(call(ls, 'language'));
            andThen();

            expect(result()).toEqual(call(doLoadPreviousSessions));
            andThen();
        });
    });

    it('When a user disconnets', () => {
        test(onLeaveSession(), (result, andReturns, andThen) => {
            expect(result()).toEqual(put(push('/')));
            andThen();
        });
    });

    it('When a user changes its language', () => {
        test(onChangeLanguage({ payload: 'de' }), (result, andReturns, andThen) => {
            expect(result()).toEqual(call(ls, 'language', 'de'));
            andThen();

            expect(result()).toEqual(put(changeLanguageSuccess('de')));
            andThen();
        });
    });

    it('When a user logs out', () => {
        test(onLogout(), (result, andReturns, andThen) => {
            expect(result()).toEqual(call(ls, 'username', null));
            andThen();

            expect(result()).toEqual(call(ls, 'language', 'en'));
            andThen();
        });
    });
});
