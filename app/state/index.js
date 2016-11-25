import { combineReducers } from 'redux';
import posts from './posts';
import session from './session';
import user from './user';
import modes from './modes';
import invite from './invite';
import { routerReducer } from 'react-router-redux';

const rootReducer = combineReducers({
    posts,
    session,
    user,
    modes,
    invite,
    routing: routerReducer
});

export default rootReducer;
